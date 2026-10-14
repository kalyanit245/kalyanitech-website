import asyncio
import logging
import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import List, Optional

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, Response
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from lib.db import client, db, ensure_indexes
from lib.email import notify_new_inquiry

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

JWT_ALGORITHM = "HS256"
ACCESS_TTL_SECONDS = 15 * 60
REFRESH_TTL_SECONDS = 7 * 24 * 3600
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_token(user_id: str, kind: str, ttl_seconds: int, email: Optional[str] = None) -> str:
    payload = {
        "sub": user_id,
        "type": kind,
        "exp": datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds),
    }
    if email:
        payload["email"] = email
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str) -> None:
    response.set_cookie("access_token", create_token(user_id, "access", ACCESS_TTL_SECONDS, email),
                        httponly=True, secure=True, samesite="lax", max_age=ACCESS_TTL_SECONDS, path="/")
    response.set_cookie("refresh_token", create_token(user_id, "refresh", REFRESH_TTL_SECONDS),
                        httponly=True, secure=True, samesite="lax", max_age=REFRESH_TTL_SECONDS, path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def seed_admin() -> None:
    email = os.environ["ADMIN_EMAIL"].lower()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": email,
            "password_hash": hash_password(password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc),
        })
        logger.info("Seeded admin account %s", email)
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})
        logger.info("Updated admin password for %s", email)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.index_task = asyncio.create_task(ensure_indexes())
    await seed_admin()
    yield
    client.close()


app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str


class InquiryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default=None, max_length=160)
    service: str = Field(min_length=2, max_length=80)
    budget: Optional[str] = Field(default=None, max_length=80)
    message: str = Field(min_length=10, max_length=4000)


class Inquiry(InquiryCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.get("/")
async def root():
    return {"message": "Kalyani Technologies API"}


@api_router.post("/auth/login", response_model=UserOut)
async def login(input: LoginRequest, request: Request, response: Response):
    email = input.email.lower()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"
    now = datetime.now(timezone.utc)

    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until"):
        locked_until = attempt["locked_until"]
        if locked_until.tzinfo is None:
            locked_until = locked_until.replace(tzinfo=timezone.utc)
        if locked_until > now:
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in a few minutes.")

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user["password_hash"]):
        count = (attempt.get("count", 0) if attempt else 0) + 1
        update = {"identifier": identifier, "count": count, "last_attempt": now}
        if count >= MAX_FAILED_ATTEMPTS:
            update["locked_until"] = now + timedelta(minutes=LOCKOUT_MINUTES)
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    set_auth_cookies(response, user["id"], email)
    return UserOut(id=user["id"], email=email, name=user.get("name", "Admin"), role=user.get("role", "admin"))


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"status": "logged out"}


@api_router.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(id=user["id"], email=user["email"], name=user.get("name", "Admin"), role=user.get("role", "admin"))


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    set_auth_cookies(response, user["id"], user["email"])
    return {"status": "refreshed"}


@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(input: InquiryCreate):
    inquiry = Inquiry(**input.model_dump())
    await db.inquiries.insert_one(inquiry.model_dump())
    asyncio.create_task(notify_new_inquiry(inquiry))
    return inquiry


@api_router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries(user: dict = Depends(get_current_user)):
    docs = await db.inquiries.find().sort("created_at", -1).to_list(500)
    return [Inquiry(**doc) for doc in docs]


app.include_router(api_router)

_cors = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip() and o.strip() != "*"]
if os.environ.get("APP_URL"):
    _cors.append(os.environ["APP_URL"])
_cors.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=list(dict.fromkeys(_cors)),
    allow_methods=["*"],
    allow_headers=["*"],
)

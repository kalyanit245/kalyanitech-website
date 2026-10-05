import asyncio
import logging
import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from lib.db import client, db, ensure_indexes


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.index_task = asyncio.create_task(ensure_indexes())
    yield
    client.close()


app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")


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


@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(input: InquiryCreate):
    inquiry = Inquiry(**input.model_dump())
    await db.inquiries.insert_one(inquiry.model_dump())
    return inquiry


@api_router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries():
    docs = await db.inquiries.find().sort("created_at", -1).to_list(500)
    return [Inquiry(**doc) for doc in docs]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

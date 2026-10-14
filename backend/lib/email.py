"""Emergent-managed Resend email: guardrail gate + async sender + inquiry notification."""

import ipaddress
import logging
import os
import re
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

import httpx
from fastapi import HTTPException

logger = logging.getLogger(__name__)

# Constant by design (survives deployment); the key/name come from env.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "delivered@resend.dev")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        try:
            code = e.response.json().get("code", "")
        except ValueError:
            code = ""
        if code in ("insufficient_credits", "integration_disabled", "daily_limit_reached"):
            logger.warning("Email paused: %s (%s): %s", code, e.response.status_code,
                           e.response.json().get("message", ""))
            raise HTTPException(status_code=503, detail="Email is temporarily unavailable")
        logger.error("Email send failed: %s %s", e.response.status_code, e.response.text)
        raise HTTPException(status_code=502, detail="Failed to send email")
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Email send error: %s", str(e))
        raise HTTPException(status_code=500, detail="Failed to send email")


def _row(label: str, value: str) -> str:
    return (
        f'<tr><td style="padding:8px 16px;font-size:11px;color:#94A3B8;text-transform:uppercase;'
        f'letter-spacing:1px;white-space:nowrap;vertical-align:top">{escape(label)}</td>'
        f'<td style="padding:8px 16px;font-size:14px;color:#F1F5F9">{value}</td></tr>'
    )


def _inquiry_email_html(inquiry) -> str:
    email_esc = escape(inquiry.email)
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#070B12;padding:32px 16px;font-family:Arial,sans-serif">'
        '<tr><td align="center">'
        '<table role="presentation" width="560" cellpadding="0" cellspacing="0" '
        'style="background:#0B132B;border:1px solid #1E293B;border-radius:12px;overflow:hidden">'
        '<tr><td style="padding:24px 28px;border-bottom:1px solid #1E293B">'
        '<span style="font-size:20px;color:#2DD4BF;font-family:Georgia,serif;letter-spacing:2px">KALYANI</span>'
        '<span style="display:block;font-size:10px;color:#FF6B4A;letter-spacing:4px;margin-top:4px">TECHNOLOGIES</span>'
        '</td></tr>'
        '<tr><td style="padding:20px 28px 4px;font-size:16px;color:#F1F5F9"><strong>New project enquiry</strong></td></tr>'
        '<tr><td style="padding:8px 12px 20px"><table role="presentation" cellpadding="0" cellspacing="0">'
        + _row("Name", escape(inquiry.name))
        + _row("Email", f'<a href="mailto:{email_esc}" style="color:#2DD4BF">{email_esc}</a>')
        + _row("Company", escape(inquiry.company or "—"))
        + _row("Service", escape(inquiry.service))
        + _row("Budget", escape(inquiry.budget or "—"))
        + _row("Message", escape(inquiry.message))
        + '</table></td></tr>'
        '<tr><td style="padding:16px 28px;border-top:1px solid #1E293B;font-size:11px;color:#94A3B8">'
        f'Sent by the {escape(EMAIL_FROM_NAME)} website enquiry form. We never ask for passwords or card details by email.'
        '</td></tr></table></td></tr></table>'
    )


async def notify_new_inquiry(inquiry) -> None:
    """Fire-and-forget: never lets an email failure surface to the enquiry submitter."""
    if not EMAIL_KEY:
        logger.warning("EMERGENT_EMAIL_KEY not set; skipping inquiry notification")
        return
    try:
        email_id = await send_email(
            to=OWNER_EMAIL,
            subject=f"New project enquiry — {inquiry.service}",
            html=_inquiry_email_html(inquiry),
        )
        logger.info("Inquiry notification sent (id=%s) to %s", email_id, OWNER_EMAIL)
    except Exception:
        logger.exception("Failed to send inquiry notification email")

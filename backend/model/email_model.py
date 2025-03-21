from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Email(BaseModel):
    id: str
    subject: str
    sender: str
    date: datetime
    folder: Optional[str] = "inbox"
    account: Optional[str] = None
    category: Optional[str] = None  # AI-generated label (Interested, Spam, etc.)

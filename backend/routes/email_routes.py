from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict
from database.db_connections import get_emails, add_email

router = APIRouter()

@router.get("/")
async def list_emails(folder: Optional[str] = None) -> List[Dict]:
    """Get all emails, optionally filtered by folder"""
    try:
        emails = get_emails(folder)
        return emails
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def create_email(email: Dict) -> Dict:
    """Create a new email"""
    try:
        return add_email(email)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

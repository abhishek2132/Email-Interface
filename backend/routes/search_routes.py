from fastapi import APIRouter, HTTPException
from typing import List, Dict
from database.db_connections import search_emails

# Create API Router
router = APIRouter()

@router.get("/")
async def search(query: str) -> List[Dict]:
    """Search emails by query string"""
    try:
        results = search_emails(query)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

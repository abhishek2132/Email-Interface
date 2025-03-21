from fastapi import APIRouter, HTTPException
from utils.slack_utils import send_slack_notification

router = APIRouter()

@router.post("/send-slack")
async def notify_slack(message: str):
    """
    API endpoint to send a Slack notification.
    """
    try:
        response = send_slack_notification(message)
        return {"status": "success", "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

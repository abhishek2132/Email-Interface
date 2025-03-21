import requests
import json

# Webhook URL (Replace with actual webhook URL, e.g., from webhook.site)
WEBHOOK_URL = "https://webhook.site/your-custom-url"

def trigger_webhook(email_data):
    """
    Sends a webhook notification when an email is marked as 'Interested'.
    Args:
        email_data (dict): Email details containing subject, sender, and body.
    Returns:
        dict: Response from webhook server.
    """
    payload = {
        "event": "email_marked_interested",
        "email": {
            "subject": email_data.get("subject", "No Subject"),
            "sender": email_data.get("sender", "Unknown"),
            "body": email_data.get("body", "")[:500],  # Limit body length
        },
    }

    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(WEBHOOK_URL, data=json.dumps(payload), headers=headers)
        response.raise_for_status()  # Raise an error for failed requests
        return {"status": "success", "response": response.json()}
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    test_email = {
        "subject": "Job Interview Invitation",
        "sender": "hr@example.com",
        "body": "Hi, we'd like to schedule an interview with you.",
    }
    print(trigger_webhook(test_email))

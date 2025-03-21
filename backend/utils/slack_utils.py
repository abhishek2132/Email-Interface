import os
import requests

SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL")  # Set this in your .env file

def send_slack_notification(message: str):
    """
    Sends a message to the configured Slack channel.
    """
    if not SLACK_WEBHOOK_URL:
        raise ValueError("Slack Webhook URL is not set.")

    payload = {"text": message}
    headers = {"Content-Type": "application/json"}

    response = requests.post(SLACK_WEBHOOK_URL, json=payload, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Slack API Error: {response.text}")

    return response.json()

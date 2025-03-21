import imaplib
import email
from email.header import decode_header
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

IMAP_SERVER = os.getenv("IMAP_SERVER")
IMAP_USER = os.getenv("IMAP_USER")
IMAP_PASSWORD = os.getenv("IMAP_PASSWORD")

def get_emails():
    """
    Fetches the last 30 days of emails from the IMAP server.
    """
    try:
        # Connect to the IMAP server
        mail = imaplib.IMAP4_SSL(IMAP_SERVER)
        mail.login(IMAP_USER, IMAP_PASSWORD)
        mail.select("inbox")

        # Search for emails from the last 30 days
        result, data = mail.search(None, "SINCE 01-Jan-2024")
        email_ids = data[0].split()

        emails = []
        for email_id in email_ids:
            result, msg_data = mail.fetch(email_id, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    subject, encoding = decode_header(msg["Subject"])[0]
                    if isinstance(subject, bytes):
                        subject = subject.decode(encoding or "utf-8")

                    emails.append({
                        "id": email_id.decode(),
                        "subject": subject,
                        "from": msg["From"],
                        "date": msg["Date"]
                    })

        mail.logout()
        return emails

    except Exception as e:
        return {"error": str(e)}

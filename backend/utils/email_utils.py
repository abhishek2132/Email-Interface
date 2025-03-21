import re
import email
from bs4 import BeautifulSoup
from email import policy
from email.parser import BytesParser

def extract_email_content(raw_email):
    """
    Extracts subject, body, and sender details from a raw email.
    Args:
        raw_email (bytes): Raw email content in bytes.
    Returns:
        dict: Extracted email details.
    """
    msg = BytesParser(policy=policy.default).parsebytes(raw_email)
    
    subject = msg["subject"] or "No Subject"
    sender = msg["from"] or "Unknown Sender"
    body = extract_email_body(msg)

    return {
        "subject": subject,
        "sender": sender,
        "body": body,
    }

def extract_email_body(msg):
    """
    Extracts and cleans the email body.
    Args:
        msg (email.message.EmailMessage): Parsed email object.
    Returns:
        str: Cleaned email body.
    """
    body = ""

    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))

            # Extract only plain text content
            if "attachment" not in content_disposition and content_type == "text/plain":
                body += part.get_payload(decode=True).decode(errors="ignore")
            elif content_type == "text/html":
                body += clean_html(part.get_payload(decode=True).decode(errors="ignore"))
    else:
        body = msg.get_payload(decode=True).decode(errors="ignore")

    return body.strip()

def clean_html(html_content):
    """
    Removes HTML tags from email body.
    Args:
        html_content (str): Raw HTML content.
    Returns:
        str: Clean text content.
    """
    soup = BeautifulSoup(html_content, "html.parser")
    return soup.get_text()

def normalize_text(text):
    """
    Normalizes text by removing extra spaces and special characters.
    Args:
        text (str): Raw text content.
    Returns:
        str: Normalized text.
    """
    text = re.sub(r"\s+", " ", text)  # Remove extra spaces
    text = re.sub(r"[^\w\s.,!?]", "", text)  # Remove special characters
    return text.strip()

if __name__ == "__main__":
    print("Email utils ready.")

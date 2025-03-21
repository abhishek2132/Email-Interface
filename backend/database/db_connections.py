from typing import Dict, List

# In-memory store for development
emails_store = {
    "emails": [
        {
            "id": "1",
            "subject": "Project Update",
            "sender": "john@example.com",
            "preview": "Here are the latest updates on the project...",
            "content": "Here are the latest updates on the project:\n\n1. Frontend development is 80% complete\n2. Backend API endpoints are defined\n3. Database schema is finalized\n\nNext steps:\n- Complete remaining UI components\n- Integrate with backend\n- Start testing phase\n\nLet me know if you have any questions!",
            "folder": "Inbox",
            "account": "user@example.com",
            "timestamp": "10:30 AM",
            "isStarred": False,
            "labels": ["Work", "Important"],
            "unread": True,
            "cc": "team@example.com"
        },
        {
            "id": "2",
            "subject": "Team Meeting Tomorrow",
            "sender": "alice@example.com",
            "preview": "Let's discuss the upcoming features...",
            "content": "Hi team,\n\nLet's meet tomorrow at 10 AM to discuss:\n\n- Current sprint progress\n- Upcoming feature priorities\n- Technical challenges\n- Resource allocation\n\nPlease come prepared with your updates.\n\nBest regards,\nAlice",
            "folder": "Inbox",
            "account": "user@example.com",
            "timestamp": "9:15 AM",
            "isStarred": False,
            "labels": ["Work"],
            "unread": True,
            "cc": "team@example.com, manager@example.com"
        },
        {
            "id": "3",
            "subject": "Weekly Report",
            "sender": "reports@example.com",
            "preview": "Please find attached the weekly report...",
            "content": "Dear Team,\n\nPlease find attached the weekly report for the current sprint.\n\nHighlights:\n- Revenue up 15%\n- New user signups increased by 20%\n- Customer satisfaction score: 4.8/5\n\nLet me know if you have any questions.\n\nBest regards,\nReporting Team",
            "folder": "Inbox",
            "account": "user@example.com",
            "timestamp": "Yesterday",
            "isStarred": True,
            "labels": ["Reports"],
            "unread": False,
            "cc": ""
        }
    ]
}

def get_emails(folder: str = None) -> List[Dict]:
    """Get emails, optionally filtered by folder"""
    if folder:
        return [email for email in emails_store["emails"] if email["folder"] == folder]
    return emails_store["emails"]

def add_email(email: Dict) -> Dict:
    """Add a new email to the store"""
    emails_store["emails"].append(email)
    return email

def search_emails(query: str) -> List[Dict]:
    """Simple search implementation"""
    query = query.lower()
    return [
        email for email in emails_store["emails"]
        if query in email["subject"].lower() or query in email["content"].lower()
    ]

if __name__ == "__main__":
    print("In-memory email store initialized.")

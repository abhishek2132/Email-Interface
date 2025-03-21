from transformers import pipeline

# Load a pre-trained model for text classification
classifier = pipeline("text-classification", model="distilbert-base-uncased")

# Define possible categories
CATEGORIES = ["Interested", "Meeting Booked", "Not Interested", "Spam", "Out of Office"]

def categorize_email(email_subject: str, email_body: str) -> str:
    """
    Categorizes an email into one of the predefined categories.
    """
    text = email_subject + " " + email_body
    prediction = classifier(text)[0]

    # Mapping AI predictions to categories (simplified logic)
    if "meet" in text.lower() or "schedule" in text.lower():
        return "Meeting Booked"
    elif "interested" in text.lower() or "let’s discuss" in text.lower():
        return "Interested"
    elif "not interested" in text.lower() or "no thanks" in text.lower():
        return "Not Interested"
    elif "out of office" in text.lower():
        return "Out of Office"
    else:
        return "Spam"

# Example Usage
if __name__ == "__main__":
    test_subject = "Let's schedule a call this week!"
    test_body = "Hi, I am interested in your product. Can we set up a call?"
    
    category = categorize_email(test_subject, test_body)
    print(f"Predicted Category: {category}")

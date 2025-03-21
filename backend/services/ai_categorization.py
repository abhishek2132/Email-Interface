import openai
from transformers import pipeline

# Set your OpenAI API key (store this securely in environment variables)
OPENAI_API_KEY = "your-openai-api-key"

# Use a Hugging Face zero-shot classification model
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Email categories
CATEGORIES = [
    "Interested",
    "Meeting Booked",
    "Not Interested",
    "Spam",
    "Out of Office"
]

def classify_email_huggingface(subject, body):
    """Categorize an email using a Hugging Face model."""
    text = f"Subject: {subject}\n\n{body}"
    result = classifier(text, CATEGORIES)
    return result["labels"][0]  # Top category

def classify_email_openai(subject, body):
    """Categorize an email using OpenAI's GPT model."""
    prompt = f"""
    Categorize the following email into one of the categories: {", ".join(CATEGORIES)}.
    
    Email Subject: {subject}
    Email Body: {body}
    
    Return only the category name.
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": prompt}],
        api_key=OPENAI_API_KEY
    )

    return response["choices"][0]["message"]["content"].strip()

def classify_email(subject, body, method="huggingface"):
    """Classify email using the chosen AI method."""
    if method == "openai":
        return classify_email_openai(subject, body)
    else:
        return classify_email_huggingface(subject, body)

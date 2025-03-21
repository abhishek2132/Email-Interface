from elasticsearch import Elasticsearch

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

# Define email index mapping
email_index_mapping = {
    "mappings": {
        "properties": {
            "id": {"type": "keyword"},
            "subject": {"type": "text"},
            "body": {"type": "text"},
            "folder": {"type": "keyword"},
            "account": {"type": "keyword"},
            "timestamp": {"type": "date"}
        }
    }
}

def create_index():
    """Create an Elasticsearch index if it doesn't exist."""
    if not es.indices.exists(index="emails"):
        es.indices.create(index="emails", body=email_index_mapping)
        print("Elasticsearch index 'emails' created.")
    else:
        print("Index already exists.")

def index_email(email_id, subject, body, folder, account, timestamp):
    """Index an email document in Elasticsearch."""
    email_doc = {
        "id": email_id,
        "subject": subject,
        "body": body,
        "folder": folder,
        "account": account,
        "timestamp": timestamp
    }
    es.index(index="emails", id=email_id, body=email_doc)

# Run index creation when script is executed
if __name__ == "__main__":
    create_index()

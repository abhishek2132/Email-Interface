from elasticsearch import Elasticsearch
from datetime import datetime

# Connect to the locally running Elasticsearch instance
es = Elasticsearch("http://localhost:9200")

INDEX_NAME = "emails"

def create_index():
    """
    Creates an Elasticsearch index with a defined schema if it does not exist.
    """
    if not es.indices.exists(index=INDEX_NAME):
        es.indices.create(index=INDEX_NAME, body={
            "mappings": {
                "properties": {
                    "subject": {"type": "text"},
                    "sender": {"type": "keyword"},
                    "date": {"type": "date"},
                    "folder": {"type": "keyword"},
                    "account": {"type": "keyword"},
                    "category": {"type": "keyword"},
                    "body": {"type": "text"}
                }
            }
        })
        print(f"Index '{INDEX_NAME}' created successfully.")

def store_email(email):
    """
    Stores an email in Elasticsearch.
    """
    doc = {
        "subject": email.subject,
        "sender": email.sender,
        "date": email.date.isoformat(),
        "folder": email.folder,
        "account": email.account,
        "category": email.category,
        "body": email.body
    }
    es.index(index=INDEX_NAME, document=doc)
    print("Email stored successfully.")

def search_emails(query, folder=None, account=None):
    """
    Searches for emails in Elasticsearch based on the query, with optional filtering.
    """
    search_body = {
        "query": {
            "bool": {
                "must": [{"match": {"body": query}}],
                "filter": []
            }
        }
    }
    if folder:
        search_body["query"]["bool"]["filter"].append({"term": {"folder": folder}})
    if account:
        search_body["query"]["bool"]["filter"].append({"term": {"account": account}})

    results = es.search(index=INDEX_NAME, body=search_body)
    return [hit["_source"] for hit in results["hits"]["hits"]]

# Example Usage
if __name__ == "__main__":
    create_index()
    
    # Example email
    email = {
        "subject": "Meeting Scheduled for Next Week",
        "sender": "client@example.com",
        "date": datetime.utcnow(),
        "folder": "inbox",
        "account": "user@example.com",
        "category": "Meeting Booked",
        "body": "Hi, let's schedule a call next week to discuss further."
    }
    
    store_email(email)
    
    # Search example
    results = search_emails("schedule a call")
    print(f"Search Results: {results}")

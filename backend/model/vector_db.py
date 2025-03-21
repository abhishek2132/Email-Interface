import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Tuple

# Load a pre-trained sentence transformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

class VectorDatabase:
    def __init__(self):
        """
        Initializes a FAISS vector database.
        """
        self.dimension = 384  # Dimension of sentence embeddings
        self.index = faiss.IndexFlatL2(self.dimension)  # L2 distance index
        self.data_store = []  # Stores (text, vector) pairs

    def add_entry(self, text: str):
        """
        Adds a new text entry to the vector database.
        """
        vector = model.encode([text])[0]
        self.index.add(np.array([vector], dtype=np.float32))
        self.data_store.append(text)

    def search(self, query: str, top_k: int = 1) -> List[Tuple[str, float]]:
        """
        Searches the vector database for the most relevant response.
        Returns a list of (response_text, similarity_score).
        """
        query_vector = model.encode([query])[0]
        distances, indices = self.index.search(np.array([query_vector], dtype=np.float32), top_k)

        results = []
        for i in range(top_k):
            if indices[0][i] != -1:
                results.append((self.data_store[indices[0][i]], distances[0][i]))

        return results

# Example Usage
if __name__ == "__main__":
    db = VectorDatabase()

    # Store some predefined responses
    db.add_entry("I am applying for a job position. If the lead is interested, share the meeting booking link: https://cal.com/example")
    db.add_entry("Thank you for reaching out. I am currently out of office and will get back to you soon.")

    # Search for a relevant response
    query = "Hi, Your resume has been shortlisted. When will be a good time for you to attend the technical interview?"
    best_match = db.search(query, top_k=1)

    print(f"Suggested Reply: {best_match[0][0]} (Score: {best_match[0][1]})")

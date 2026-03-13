from embeddings import embed
from vector_store import create_index, search

# Example documents
documents = [
    {
        "text": "Employees are entitled to 20 days of annual leave per year.",
        "source": "employee_policy.pdf",
        "page": 4
    },
    {
        "text": "Annual leave must be approved by the department manager.",
        "source": "company_handbook.pdf",
        "page": 12
    }
]

# Extract text
texts = [doc["text"] for doc in documents]

# Create embeddings
embeddings = embed(texts)

# Build FAISS index
create_index(embeddings, documents)


def retrieve_context(query):

    q_embedding = embed([query])

    results = search(q_embedding)

    context = [r["text"] for r in results]

    return context
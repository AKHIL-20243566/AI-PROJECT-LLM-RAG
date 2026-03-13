import faiss
import numpy as np

index = None
documents = []

def create_index(embeddings, docs):
    global index, documents

    dim = len(embeddings[0])

    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings).astype("float32"))

    documents = docs


def search(query_embedding, k=2):

    D, I = index.search(np.array(query_embedding).astype("float32"), k)

    results = [documents[i] for i in I[0]]

    return results
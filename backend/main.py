from fastapi import FastAPI
from pydantic import BaseModel
from rag import retrieve_context

app = FastAPI()

class Question(BaseModel):
    question: str


@app.post("/chat")
def chat(q: Question):

    context = retrieve_context(q.question)

    answer = f"Mock LLM answer using context: {context}"

    return {
        "answer": answer,
        "sources": ["employee_policy.pdf"],
        "confidence": 0.85,
        "context": context
    }
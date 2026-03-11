export async function askQuestion(question) {
    //Send the question to the backend API and return the response
    const response = await fetch("http://localhost:8000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      question: question
    })
  });

  return response.json();
}
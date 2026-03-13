const API_URL = "http://localhost:8000/chat";
export async function askQuestion(question) {

  console.log("Mock API called with:", question);

  // simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  return {
    answer: `Mock AI response to: "${question}"`,
    sources: [
      { doc: "employee_policy.pdf", page: 4, score: 0.87 },
      { doc: "company_handbook.pdf", page: 12, score: 0.82 }
    ],
    confidence: 0.87,
    context: [
      "Employees are entitled to 20 days of annual leave per year.",
      "Annual leave must be approved by the department manager."
    ]
  };
}
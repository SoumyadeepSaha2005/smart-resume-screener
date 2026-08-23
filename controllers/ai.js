const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

//Prompt to evaluate the resume against the job description and extract relevant information

async function evaluateResume(resumeText, jobDescription) {
  const prompt = `Compare the following resume with this job description and rate fit on 1-100 with justification.
Extract the candidate's skills, experience, and education.
Respond strictly in JSON format with exactly these keys: "score" (number), "matchingSkills" (array of strings), "missingSkills" (array of strings), "education" (string), "experience" (string), and "summary" (string).

Resume: ${resumeText}
Job Description: ${jobDescription}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  
  if (text.startsWith('```json')) {
    text = text.replace(/```json\n?/, '').replace(/```/g, '');
  }

  return JSON.parse(text);
}

module.exports = { evaluateResume };
# Smart Resume Screener

An automated resume evaluation pipeline that matches candidate profiles against specific job descriptions using Google Gemini LLM, Node.js, and React.

---

## Overview

The Smart Resume Screener streamlines recruitment by parsing PDF resumes, extracting key qualifications (skills, education, and professional experience), and scoring each candidate against a provided job description. Evaluation results are stored in MongoDB and rendered in an interactive dashboard for comparison.

---

## Key Features

* **Multi-PDF Parsing:** Extracts raw text directly from in-memory PDF uploads.
* **Structured AI Evaluation:** Uses Google Gemini (gemini-3.5-flash) with schema enforcement to output strict JSON evaluations.
* **Candidate Fit Scoring:** Generates a 1-100 compatibility score alongside matching and missing skill breakdowns.
* **Persistent Record Keeping:** Saves evaluations directly to MongoDB for historical tracking and sorting.
* **Clean User Interface:** Simple React dashboard for submitting job descriptions and reviewing ranked candidates.

---

## Architecture & Data Flow

    [React Client] 
          │ (Multipart Form Data)
          ▼
    [Express Server / Multer Memory Storage]
          │
          ├─► [pdf-parse] ──► Extracted Resume Text
          │
          ├─► [Gemini API] ──► Evaluates Text against Job Description
          │                         │
          │                         ▼
          │                   Structured JSON
          │                         │
          └─► [MongoDB] ◄───────────┘

1. **Client Submission:** The frontend sends the job description text and PDF files via a multipart/form-data request.
2. **Buffer Ingestion:** Multer stores file buffers temporarily in memory to avoid disk I/O overhead.
3. **Text Extraction:** pdf-parse reads the buffer content and outputs unstructured text strings.
4. **LLM Inference:** The backend constructs an evaluation prompt and calls the Gemini API to analyze the resume against the role requirements.
5. **Database Persistence:** Candidate records (scores, skills, experience summary) are validated against the Mongoose schema and saved.
6. **Client Synchronization:** The frontend refetches the updated candidate collection and displays cards sorted by submission date.

---

## Prompt Engineering

To prevent hallucinated formats and guarantee valid database inserts, the model is prompted with explicit JSON schema constraints:

    Compare the following resume with this job description and rate fit on 1-100 with justification.
    Extract the candidate's skills, experience, and education.
    Respond strictly in JSON format with exactly these keys: "score" (number), "matchingSkills" (array of strings), "missingSkills" (array of strings), "education" (string), "experience" (string), and "summary" (string).

    Resume: ${resumeText}
    Job Description: ${jobDescription}

---

## Tech Stack

* **Frontend:** React, Vite, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose ODM
* **File Handling:** Multer, pdf-parse
* **AI Model:** Google Generative AI SDK (gemini-3.5-flash)

---

## Getting Started

### Prerequisites

* Node.js (v18 or higher)
* MongoDB (local instance or MongoDB Atlas connection string)
* Google Gemini API Key

---

### Installation & Setup

#### 1. Clone the repository
    git clone [https://github.com/your-username/smart-resume-screener.git](https://github.com/your-username/smart-resume-screener.git)
    cd smart-resume-screener

#### 2. Backend Configuration
Create a .env file in the root project directory:

    PORT=3000
    MONGO_URI=mongodb://127.0.0.1:27017/resume-screener
    LLM_API_KEY=your_google_gemini_api_key

Install backend dependencies and start the server:

    npm install
    node index.js

#### 3. Frontend Configuration
Navigate to the frontend folder, install client dependencies, and start the development server:

    cd frontend
    npm install
    npm run dev

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/process` | Accepts `jobDescription` (text) and `resumes` (PDF files) for parsing and evaluation |
| `GET` | `/api/candidates` | Retrieves all evaluated candidates from MongoDB |

---
**Author:** Soumyadeep Saha
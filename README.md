# AI Resume Analyzer & Job Matcher

Upload your resume as a PDF, paste a job description, and see how well you match. It shows matched and missing skills, a match score, specific suggestions to improve the resume for that job, and interview questions you are likely to be asked.

**Live:** add frontend link here

## How it works

1. The PDF is read in memory with `pdf-parse`. Nothing is written to disk.
2. Skills are matched against a list of about 100 common tech skills (with aliases like `node`, `nodejs`, `node.js`). This part works even without the AI.
3. The resume, job description and the first match are sent to Gemini with a structured prompt. Gemini returns JSON with a short fit summary, extra skills the list missed, suggestions, and interview questions.
4. Both results are merged and the match score is `matched / (matched + missing)`.
5. Each analysis is saved in MongoDB.

If every Gemini key fails, the app still returns the skill match and says AI suggestions are not available right now. It doesn't fail the whole request.

## Tech stack

- **Frontend:** React, React Router, Axios, Tailwind CSS, Vite
- **Backend:** Node.js, Express, Mongoose, Multer, pdf-parse, express-rate-limit
- **Database:** MongoDB Atlas
- **AI:** Google Gemini API (JSON mode with a response schema)

## API

All routes except `/health` need an `X-Client-Id` header. The frontend creates a random id once and keeps it in localStorage, so every browser only sees its own analyses without needing a login.

| Method | Route | What it does |
|---|---|---|
| GET | `/health` | Server and database status |
| POST | `/analyze` | Form data: `resume` (PDF, max 5 MB), `jobDescription` (50 to 8000 chars), `jobTitle` (optional) |
| GET | `/analyses` | Your last 50 analyses |
| GET | `/analyses/:id` | One analysis |
| DELETE | `/analyses/:id` | Delete an analysis |

`POST /analyze` is limited to 10 requests per 15 minutes per IP, to protect the Gemini quota.

## Run locally

Backend:

```bash
cd backend
cp .env.example .env
# fill MONGODB_URI and GEMINI_API_KEYS
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Environment variables

Backend (`backend/.env`):

| Name | Example |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GEMINI_API_KEYS` | One or more keys, comma separated. If one fails, the next is tried |
| `GEMINI_MODEL` | `gemini-3.5-flash-lite` |
| `ALLOWED_ORIGINS` | Frontend URL, e.g. `http://localhost:5173` |
| `PORT` | `3000` |

Frontend (`frontend/.env`):

| Name | Example |
|---|---|
| `VITE_API_URL` | Backend URL, e.g. `http://localhost:3000` |

## Things I handled

- Only PDFs up to 5 MB, checked on both frontend and backend
- Scanned PDFs with no text get a clear error instead of a useless analysis
- The resume text is stored but never sent back in API responses
- Users can only read or delete their own analyses
- The prompt tells the model to treat the resume and job description as data, not instructions
- Gemini output is cleaned before saving (only strings, length limits, empty items removed)

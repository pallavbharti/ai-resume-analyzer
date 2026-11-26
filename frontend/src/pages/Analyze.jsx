import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../utils/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MIN_JD_LENGTH = 50;
const MAX_JD_LENGTH = 8000;

const Analyze = () => {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const pickFile = (selected) => {
    setError("");
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError("Resume must be smaller than 5 MB");
      return;
    }
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please upload your resume as a PDF");
      return;
    }
    if (jobDescription.trim().length < MIN_JD_LENGTH) {
      setError("Job description must be at least 50 characters");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobTitle", jobTitle.trim());
    formData.append("jobDescription", jobDescription.trim());

    try {
      setLoading(true);
      const res = await api.post("/analyze", formData);
      navigate("/analysis/" + res.data.data._id, { state: { notice: res.data.message } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const jdLength = jobDescription.trim().length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Check your resume against a job</h1>
        <p className="mt-2 text-slate-600">
          Upload your resume and paste the job description. You get matched and missing skills, specific
          suggestions, and interview questions for that role.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium">Resume (PDF, max 5 MB)</label>
          <div
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition " +
              (dragging ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50")
            }
          >
            {file ? (
              <>
                <p className="font-medium text-indigo-700">{file.name}</p>
                <p className="mt-1 text-sm text-slate-500">{(file.size / 1024).toFixed(0)} KB · click to change</p>
              </>
            ) : (
              <>
                <p className="font-medium">Drop your PDF here or click to browse</p>
                <p className="mt-1 text-sm text-slate-500">Text based PDFs work best, not scanned images</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => pickFile(e.target.files[0])}
            />
          </div>
        </div>

        <div>
          <label htmlFor="jobTitle" className="mb-2 block text-sm font-medium">
            Job title <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="jobTitle"
            type="text"
            value={jobTitle}
            maxLength={100}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Full Stack Developer Intern"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="jobDescription" className="text-sm font-medium">
              Job description
            </label>
            <span className={"text-xs " + (jdLength > MAX_JD_LENGTH ? "text-red-600" : "text-slate-400")}>
              {jdLength} / {MAX_JD_LENGTH}
            </span>
          </div>
          <textarea
            id="jobDescription"
            rows={10}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here"
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading || jdLength > MAX_JD_LENGTH}
          className="w-full rounded-lg bg-indigo-700 px-4 py-3 font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Analyzing your resume, this takes 10 to 20 seconds..." : "Analyze resume"}
        </button>
      </form>
    </div>
  );
};

export default Analyze;

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api, { getErrorMessage } from "../utils/api";
import ScoreRing from "../components/ScoreRing";
import SkillList from "../components/SkillList";

const Result = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setError("");
        const res = await api.get("/analyses/" + id);
        setAnalysis(res.data.data);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };
    fetchAnalysis();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete("/analyses/" + id);
      navigate("/history");
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600">{error}</p>
        <Link to="/" className="mt-4 inline-block font-medium text-indigo-700 hover:underline">
          Analyze a resume
        </Link>
      </div>
    );
  }

  if (!analysis) {
    return <p className="py-16 text-center text-slate-500">Loading analysis...</p>;
  }

  const notice = location.state && location.state.notice;

  return (
    <div className="space-y-6">
      {!analysis.aiAvailable && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {notice || "AI suggestions were not available for this analysis. Only the skill match is shown."}
        </p>
      )}

      <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <ScoreRing score={analysis.matchScore} />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{analysis.jobTitle || "Job match"}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {analysis.fileName} · {new Date(analysis.createdAt).toLocaleString()}
          </p>
          {analysis.summary && <p className="mt-3 text-slate-700">{analysis.summary}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SkillList
          title="Matched skills"
          type="matched"
          skills={analysis.matchedSkills}
          emptyText="No matching skills found."
        />
        <SkillList
          title="Missing skills"
          type="missing"
          skills={analysis.missingSkills}
          emptyText="Your resume covers every skill we found in this job."
        />
      </div>

      {analysis.suggestions.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold">How to improve your resume for this job</h2>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="flex gap-3 text-slate-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {analysis.interviewQuestions.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold">Questions you may be asked</h2>
          <ol className="space-y-3">
            {analysis.interviewQuestions.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-semibold text-slate-400">{index + 1}.</span>
                <div>
                  <p className="text-slate-800">{item.question}</p>
                  {item.topic && (
                    <span className="mt-1 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {item.topic}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          to="/"
          className="rounded-lg bg-indigo-700 px-4 py-2 font-medium text-white transition hover:bg-indigo-800"
        >
          Analyze another
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default Result;

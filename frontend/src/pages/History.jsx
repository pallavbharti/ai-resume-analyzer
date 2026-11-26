import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../utils/api";

const scoreClass = (score) => {
  if (score >= 75) return "bg-emerald-50 text-emerald-700";
  if (score >= 50) return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
};

const History = () => {
  const [analyses, setAnalyses] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await api.get("/analyses");
        setAnalyses(res.data.data);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };
    fetchAnalyses();
  }, []);

  if (error) return <p className="py-16 text-center text-slate-600">{error}</p>;
  if (!analyses) return <p className="py-16 text-center text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Your analyses</h1>

      {analyses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-slate-600">You have not analyzed a resume yet.</p>
          <Link to="/" className="mt-3 inline-block font-medium text-indigo-700 hover:underline">
            Analyze your first resume
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {analyses.map((analysis) => (
            <Link
              key={analysis._id}
              to={"/analysis/" + analysis._id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 transition hover:border-indigo-300 hover:shadow-sm"
            >
              <div>
                <p className="font-medium">{analysis.jobTitle || "Job match"}</p>
                <p className="text-sm text-slate-500">
                  {analysis.fileName} · {new Date(analysis.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={"rounded-full px-3 py-1 text-sm font-semibold " + scoreClass(analysis.matchScore)}>
                {analysis.matchScore}%
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;

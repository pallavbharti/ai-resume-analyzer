const getColor = (score) => {
  if (score >= 75) return { stroke: "#059669", label: "Strong match" };
  if (score >= 50) return { stroke: "#d97706", label: "Decent match" };
  return { stroke: "#dc2626", label: "Weak match" };
};

const ScoreRing = ({ score }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { stroke, label } = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <svg width="132" height="132" viewBox="0 0 132 132">
        <circle cx="66" cy="66" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        <circle
          cx="66"
          cy="66"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 66 66)"
        />
        <text x="66" y="72" textAnchor="middle" fontSize="28" fontWeight="700" fill="#0f172a">
          {score}%
        </text>
      </svg>
      <span className="mt-1 text-sm font-medium" style={{ color: stroke }}>
        {label}
      </span>
    </div>
  );
};

export default ScoreRing;

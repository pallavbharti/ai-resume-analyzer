const styles = {
  matched: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  missing: "bg-red-50 text-red-700 ring-red-200",
};

const SkillList = ({ title, skills, type, emptyText }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-sm text-slate-500">{skills.length}</span>
      </div>
      {skills.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyText}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className={"rounded-full px-3 py-1 text-sm ring-1 " + styles[type]}>
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillList;

const validateAnalyzeData = (req) => {
  const { jobTitle, jobDescription } = req.body;

  if (!req.file) {
    throw new Error("Please upload your resume as a PDF");
  }
  if (typeof jobDescription !== "string" || jobDescription.trim().length < 50) {
    throw new Error("Job description must be at least 50 characters");
  }
  if (jobDescription.trim().length > 8000) {
    throw new Error("Job description must be at most 8000 characters");
  }
  if (jobTitle && (typeof jobTitle !== "string" || jobTitle.trim().length > 100)) {
    throw new Error("Job title must be at most 100 characters");
  }
};

module.exports = { validateAnalyzeData };

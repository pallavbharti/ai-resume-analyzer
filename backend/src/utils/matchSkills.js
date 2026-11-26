const SKILLS = require("./skills");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const hasWord = (text, word) => {
  const pattern = new RegExp("(^|[^a-z0-9+#.])" + escapeRegex(word) + "(?=$|[^a-z0-9+#])", "i");
  return pattern.test(text);
};

const findSkills = (text) => {
  const lowerText = text.toLowerCase();
  return SKILLS.filter((skill) => skill.aliases.some((alias) => hasWord(lowerText, alias))).map(
    (skill) => skill.name
  );
};

const matchSkills = (resumeText, jobDescription) => {
  const jobSkills = findSkills(jobDescription);
  const resumeSkills = new Set(findSkills(resumeText));

  const matched = jobSkills.filter((skill) => resumeSkills.has(skill));
  const missing = jobSkills.filter((skill) => !resumeSkills.has(skill));

  return { matched, missing };
};

const mergeSkills = (localResult, aiResult) => {
  const matched = [];
  const missing = [];
  const seen = new Set();

  const addSkill = (list, skill) => {
    const key = skill.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    list.push(skill);
  };

  localResult.matched.forEach((skill) => addSkill(matched, skill));
  if (aiResult) aiResult.extraMatchedSkills.forEach((skill) => addSkill(matched, skill));

  localResult.missing.forEach((skill) => addSkill(missing, skill));
  if (aiResult) aiResult.extraMissingSkills.forEach((skill) => addSkill(missing, skill));

  const total = matched.length + missing.length;
  const matchScore = total === 0 ? 0 : Math.round((matched.length / total) * 100);

  return { matched, missing, matchScore };
};

module.exports = { findSkills, matchSkills, mergeSkills };

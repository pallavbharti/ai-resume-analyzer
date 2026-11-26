const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const Analysis = require("../models/analysis");
const { requireClientId } = require("../middlewares/clientId");
const { uploadResume } = require("../middlewares/upload");
const { validateAnalyzeData } = require("../utils/validation");
const extractText = require("../utils/extractText");
const { matchSkills, mergeSkills } = require("../utils/matchSkills");
const { getAiFeedback } = require("../utils/gemini");

const analysisRouter = express.Router();

const LIST_FIELDS = "fileName jobTitle matchScore aiAvailable createdAt";

const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many analyses. Please try again in a few minutes" },
});

analysisRouter.post("/analyze", requireClientId, analyzeLimiter, uploadResume, async (req, res) => {
  try {
    validateAnalyzeData(req);

    const jobTitle = (req.body.jobTitle || "").trim();
    const jobDescription = req.body.jobDescription.trim();

    const resumeText = await extractText(req.file.buffer);
    if (resumeText.length < 100) {
      throw new Error("Could not find text in this PDF. Please upload a text based PDF, not a scanned image");
    }

    const localResult = matchSkills(resumeText, jobDescription);

    const aiResult = await getAiFeedback({
      resumeText,
      jobTitle,
      jobDescription,
      matched: localResult.matched,
      missing: localResult.missing,
    });

    const { matched, missing, matchScore } = mergeSkills(localResult, aiResult);

    const analysis = new Analysis({
      clientId: req.clientId,
      fileName: req.file.originalname.slice(0, 200),
      jobTitle,
      jobDescription,
      resumeText,
      matchScore,
      matchedSkills: matched,
      missingSkills: missing,
      summary: aiResult ? aiResult.summary : "",
      suggestions: aiResult ? aiResult.suggestions : [],
      interviewQuestions: aiResult ? aiResult.interviewQuestions : [],
      aiAvailable: Boolean(aiResult),
    });

    const savedAnalysis = await analysis.save();
    const data = savedAnalysis.toObject();
    delete data.resumeText;
    delete data.clientId;

    res.json({
      message: aiResult
        ? "Resume analyzed successfully"
        : "Skills matched, but AI suggestions are not available right now. Please try again later",
      data,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

analysisRouter.get("/analyses", requireClientId, async (req, res) => {
  try {
    const analyses = await Analysis.find({ clientId: req.clientId })
      .select(LIST_FIELDS)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ data: analyses });
  } catch (err) {
    res.status(500).json({ message: "Could not load your analyses" });
  }
});

analysisRouter.get("/analyses/:id", requireClientId, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    const analysis = await Analysis.findOne({ _id: id, clientId: req.clientId }).select("-clientId");
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    res.json({ data: analysis });
  } catch (err) {
    res.status(500).json({ message: "Could not load this analysis" });
  }
});

analysisRouter.delete("/analyses/:id", requireClientId, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    const deleted = await Analysis.findOneAndDelete({ _id: id, clientId: req.clientId });
    if (!deleted) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    res.json({ message: "Analysis deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete this analysis" });
  }
});

module.exports = analysisRouter;

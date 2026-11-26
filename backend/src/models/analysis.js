const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    topic: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    jobTitle: {
      type: String,
      trim: true,
      maxLength: 100,
      default: "",
    },
    jobDescription: {
      type: String,
      required: true,
      maxLength: 8000,
    },
    resumeText: {
      type: String,
      required: true,
      select: false,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: "",
    },
    suggestions: {
      type: [String],
      default: [],
    },
    interviewQuestions: {
      type: [interviewQuestionSchema],
      default: [],
    },
    aiAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

analysisSchema.index({ clientId: 1, createdAt: -1 });

module.exports = mongoose.model("Analysis", analysisSchema);

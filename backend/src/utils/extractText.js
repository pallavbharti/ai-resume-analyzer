const { PDFParse } = require("pdf-parse");

const extractText = async (buffer) => {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return result.text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  } catch (err) {
    throw new Error("Could not read this PDF. Please upload a valid, unlocked PDF");
  } finally {
    await parser.destroy();
  }
};

module.exports = extractText;

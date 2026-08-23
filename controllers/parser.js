const pdfParse = require('pdf-parse');
// Function to parse PDF buffer and extract text
const parsePdf = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (err) {
    throw new Error('Failed to parse PDF');
  }
};

module.exports = { parsePdf };
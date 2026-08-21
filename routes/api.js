const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Candidate = require('../models/Candidate');
const { evaluateResume } = require('../controllers/ai');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/process', upload.array('resumes', 10), async (req, res) => {
  try {
    const jd = req.body.jobDescription;
    if (!jd) return res.status(400).send('Job description missing');

    for (const file of req.files) {
      console.log(`Processing: ${file.originalname}...`);
      const pdfData = await pdfParse(file.buffer);
      const resumeText = pdfData.text;

      const evaluation = await evaluateResume(resumeText, jd);

      const newCandidate = new Candidate({
        fileName: file.originalname,
        jobDescription: jd,
        score: evaluation.score,
        matchingSkills: evaluation.matchingSkills,
        missingSkills: evaluation.missingSkills,
        education: evaluation.education,
        experience: evaluation.experience,
        summary: evaluation.summary
      });
      
      await newCandidate.save();
    }
    res.status(200).send('Processed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
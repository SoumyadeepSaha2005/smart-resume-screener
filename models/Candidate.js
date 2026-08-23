const mongoose = require('mongoose');

//Defining the schema for the Candidate model 

const candidateSchema = new mongoose.Schema({
  fileName: String,
  jobDescription: String,
  score: Number,
  matchingSkills: [String],
  missingSkills: [String],
  education: String,
  experience: String,
  summary: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
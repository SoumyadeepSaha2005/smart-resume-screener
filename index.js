
require('dotenv').config();

// 1. Import dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();

// 2. Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err));

// 4. Mount API routes
app.use('/api', apiRoutes);

// 5. Start the server
app.listen(3000, () => {
  console.log('Running on 3000');
});
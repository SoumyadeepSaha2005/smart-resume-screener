// 1. THIS MUST BE THE VERY FIRST LINE
require('dotenv').config();

// 2. Import everything else
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();

// 3. Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err));

// 5. Mount API routes
app.use('/api', apiRoutes);

// 6. Start the server
app.listen(3000, () => {
  console.log('Running on 3000');
});
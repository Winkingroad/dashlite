const express = require('express');
const mongoose = require('mongoose');
const vehicleRoutes = require('./routes/vehicleRoutes');
const csvRoutes = require('./routes/csvRoutes');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*'
}));

// Database connection with mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connection successful"))
.catch((err) => console.error("Connection failed:", err));

// vehicle routes
app.use(vehicleRoutes);

// Register CSV upload route
app.use(csvRoutes);


module.exports = {app};
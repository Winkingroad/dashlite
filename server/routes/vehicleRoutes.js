const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');


router.get('/reports', vehicleController.getReport);

module.exports = router;



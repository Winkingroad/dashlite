const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { validateRequest } = require('../middleware/validationMiddleware');


router.get('/reports', vehicleController.getReport);

module.exports = router;

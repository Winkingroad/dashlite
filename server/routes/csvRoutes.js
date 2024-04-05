const express = require('express');
const router = express.Router();
const csvController = require('../controllers/csvControllers');

router.get('/upload-csv', csvController.uploadCSV);

module.exports = router;

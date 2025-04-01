const express = require('express');
const router = express.Router();
const adjusterController = require('../controllers/adjuster.controller');

router.post('/', adjusterController.createAdjuster);
router.get('/', adjusterController.getAdjusters);

module.exports = router;
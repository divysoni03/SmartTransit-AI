const express = require('express');
const { scenarioController } = require('../controllers');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// Retrieve specific scenario
router.get('/:id', auth(), scenarioController.getScenarioById);

// Retrieve scenario optimization result
router.get('/:id/result', auth(), scenarioController.getScenarioResult);

module.exports = router;

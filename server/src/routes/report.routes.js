const express = require('express');
const { reportController } = require('../controllers');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// Generate scenario report (usage: ?format=pdf)
router.get('/scenarios/:id', auth(), reportController.generateReport);

module.exports = router;

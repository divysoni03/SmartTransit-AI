const express = require('express');
const { projectController } = require('../controllers');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// Retrieve list of projects
router.get('/', auth(), projectController.getProjects);

// Retrieve specific project along with its scenarios
router.get('/:id', auth(), projectController.getProjectById);

module.exports = router;

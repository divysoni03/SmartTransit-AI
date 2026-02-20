const express = require('express');
const router = express.Router();
const optimizeController = require('../controllers/optimize.controller');
const geojsonValidation = require('../middleware/geojsonValidation.middleware');
const { startOptimization } = require('../validators/optimize.validator');
const { ApiError } = require('../utils/apiResponse');
const auth = require('../middleware/auth.middleware');

const validateStartOptimization = (req, res, next) => {
    const { error } = startOptimization.validate(req.body);
    if (error) {
        return next(new ApiError(400, error.details[0].message));
    }
    next();
};

// POST /api/optimize/start
router.post('/start', auth(), validateStartOptimization, geojsonValidation, optimizeController.startOptimization);

// GET /api/optimize/:id
router.get('/:id', auth(), optimizeController.getOptimizationResult);

module.exports = router;

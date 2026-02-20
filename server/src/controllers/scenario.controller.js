const { Scenario, Result } = require('../models');
const { ApiError } = require('../utils/apiResponse');

const getScenarioById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const scenario = await Scenario.findById(id).populate('project_id');

        if (!scenario) {
            throw new ApiError(404, 'Scenario not found');
        }

        // Verify the user owns the project that this scenario belongs to
        if (scenario.project_id.created_by.toString() !== req.user._id.toString()) {
            throw new ApiError(403, 'Access denied');
        }

        res.status(200).json({
            data: scenario
        });
    } catch (error) {
        next(error);
    }
};

const getScenarioResult = async (req, res, next) => {
    try {
        const { id } = req.params;
        const scenario = await Scenario.findById(id).populate('project_id');

        if (!scenario) {
            throw new ApiError(404, 'Scenario not found');
        }

        if (scenario.project_id.created_by.toString() !== req.user._id.toString()) {
            throw new ApiError(403, 'Access denied');
        }

        const result = await Result.findOne({ scenario_id: id });

        if (!result) {
            throw new ApiError(404, 'Result not found for this scenario');
        }

        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getScenarioById,
    getScenarioResult
};

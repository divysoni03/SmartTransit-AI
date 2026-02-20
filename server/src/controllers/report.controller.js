const { Scenario, Result } = require('../models');
const { ApiError } = require('../utils/apiResponse');
const { reportService } = require('../services');

const generateReport = async (req, res, next) => {
    try {
        const { id } = req.params; // scenario_id
        const { format = 'json' } = req.query; // json or pdf

        const scenario = await Scenario.findById(id).populate('project_id');
        if (!scenario) throw new ApiError(404, 'Scenario not found');

        if (scenario.project_id.created_by.toString() !== req.user._id.toString()) {
            throw new ApiError(403, 'Access denied');
        }

        const result = await Result.findOne({ scenario_id: id });
        if (!result) throw new ApiError(404, 'Result not found for this scenario');

        const report = await reportService.generateReport(scenario, result, format);

        res.setHeader('Content-Type', report.contentType);
        res.setHeader('Content-Disposition', `attachment; filename=scenario-report-${id}.${report.extension}`);
        res.send(report.buffer);

    } catch (error) {
        next(error);
    }
};

module.exports = { generateReport };

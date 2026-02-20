const axios = require('axios');
const { Project, Scenario, Result } = require('../models');
const { ApiError } = require('../utils/apiResponse');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

exports.startOptimization = async (req, res, next) => {
    try {
        const { city_name, boundary_geojson, num_buses, operating_hours, avg_speed } = req.body;
        // User is attached by auth middleware
        const userId = req.user ? req.user._id : '000000000000000000000000';

        // 2. Create/Find project & create scenario (status = processing)
        let project = await Project.findOne({ city_name, created_by: userId });
        if (!project) {
            project = await Project.create({ city_name, boundary_geojson, created_by: userId });
        }

        const scenario = await Scenario.create({
            project_id: project._id,
            num_buses,
            operating_hours,
            avg_speed,
            status: 'processing'
        });

        // Convert the polygon coordinates for the ML service placeholder requirement
        let boundaryPoints = [];
        if (boundary_geojson.type === 'Polygon' && boundary_geojson.coordinates && boundary_geojson.coordinates[0]) {
            boundaryPoints = boundary_geojson.coordinates[0].map(coord => ({ lng: coord[0], lat: coord[1] }));
        }

        // 3. Call ML service
        let mlResponse;
        try {
            mlResponse = await axios.post(`${ML_SERVICE_URL}/optimize`, {
                city_name,
                boundary: boundaryPoints,
                parameters: { num_buses, operating_hours, avg_speed, scenario_id: scenario._id }
            });
        } catch (mlErr) {
            throw new ApiError(500, 'ML Service failed to process request');
        }

        // 4. Store result
        const mlData = mlResponse.data;
        const result = await Result.create({
            scenario_id: scenario._id,
            stops: mlData.data?.stops || { type: 'FeatureCollection', features: [] },
            routes: mlData.data?.routes || { type: 'FeatureCollection', features: [] },
            allocation: mlData.data?.allocation || {},
            coverage_percent: mlData.data?.estimated_coverage ? mlData.data.estimated_coverage * 100 : 0,
            metrics: mlData.data || {}
        });

        // 5. Update scenario status
        scenario.status = 'completed';
        await scenario.save();

        // 6. Return response
        res.status(200).json({
            message: 'Optimization completed successfully',
            scenario,
            result
        });
    } catch (error) {
        next(error);
    }
};

exports.getOptimizationResult = async (req, res, next) => {
    try {
        const { id } = req.params;
        const scenario = await Scenario.findById(id).populate('project_id');
        if (!scenario) {
            throw new ApiError(404, 'Scenario not found');
        }

        const result = await Result.findOne({ scenario_id: id });

        res.status(200).json({
            scenario,
            result
        });
    } catch (error) {
        next(error);
    }
};

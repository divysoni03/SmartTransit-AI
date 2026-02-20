const { ApiError } = require('../utils/apiResponse');

const geojsonValidation = (req, res, next) => {
    try {
        const { boundary_geojson } = req.body;

        if (!boundary_geojson) {
            return next(new ApiError(400, 'boundary_geojson is required'));
        }

        // Prevent huge payload (e.g. check stringified length)
        const payloadStr = JSON.stringify(boundary_geojson);
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
        if (payloadStr.length > MAX_SIZE) {
            return next(new ApiError(413, 'GeoJSON payload is too large. Maximum allowed size is 5MB.'));
        }

        // Check structure
        if (!['FeatureCollection', 'Polygon', 'MultiPolygon', 'Feature'].includes(boundary_geojson.type)) {
            return next(new ApiError(400, 'Invalid GeoJSON structure. Must be a Polygon, MultiPolygon, Feature, or FeatureCollection.'));
        }

        // Basic check for injection or invalid keys deep inside
        if (payloadStr.includes('$where') || payloadStr.includes('javascript:')) {
            return next(new ApiError(400, 'Invalid characters in GeoJSON payload.'));
        }

        next();
    } catch (error) {
        next(new ApiError(400, 'Error parsing GeoJSON data'));
    }
};

module.exports = geojsonValidation;

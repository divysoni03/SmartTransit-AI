const Joi = require('joi');

const startOptimization = Joi.object({
    city_name: Joi.string().required(),
    boundary_geojson: Joi.object().required(),
    num_buses: Joi.number().integer().min(1).required(),
    operating_hours: Joi.number().min(1).max(24).required(),
    avg_speed: Joi.number().min(1).required()
});

module.exports = {
    startOptimization
};

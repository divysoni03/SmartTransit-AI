const Joi = require('joi');

const startOptimization = Joi.object({
    city_name: Joi.string().required(),
    boundary: Joi.array().items(
        Joi.object({
            lat: Joi.number().required(),
            lng: Joi.number().required()
        })
    ).optional(),
    bus_stops: Joi.array().items(
        Joi.object({
            lat: Joi.number().required(),
            lng: Joi.number().required()
        })
    ).optional(),
    num_buses: Joi.number().integer().min(1).required(),
    operating_hours: Joi.number().min(1).max(24).required(),
    avg_speed_kmph: Joi.number().min(1).required(),
    parameters: Joi.object({
        population_density: Joi.string().valid('metro', 'urban', 'suburban').required(),
        peak_hours: Joi.array().items(Joi.string()).required(),
        commercial_weight: Joi.number().min(0).required(),
        residential_weight: Joi.number().min(0).required(),
        school_weight: Joi.number().min(0).required(),
        min_stop_distance_m: Joi.number().min(10).required(),
        max_walk_distance_m: Joi.number().min(10).required()
    }).optional()
});

module.exports = {
    startOptimization
};

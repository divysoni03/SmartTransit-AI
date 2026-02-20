const Joi = require('joi');

const startOptimization = Joi.object({
    city_name: Joi.string().required(),
    boundary: Joi.object().required(),
    bus_stops: Joi.array().items(
        Joi.object({
            lat: Joi.number().required(),
            lng: Joi.number().required()
        })
    ).optional(),
    num_buses: Joi.number().integer().min(1).required(),
    operating_hours: Joi.number().min(1).max(24).required(),
    avg_speed: Joi.number().min(1).required(),
    depot: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required()
    }).allow(null).optional()
});

module.exports = {
    startOptimization
};

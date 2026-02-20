const mongoose = require('mongoose');

const scenarioSchema = mongoose.Schema(
    {
        project_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Project',
            required: true,
        },
        num_buses: {
            type: Number,
            required: true,
            min: 1,
        },
        operating_hours: {
            type: Number,
            required: true,
            min: 1,
            max: 24,
        },
        avg_speed: {
            type: Number, // km/h or mph
            required: true,
            min: 1,
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'completed'],
            default: 'pending',
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

scenarioSchema.index({ project_id: 1 });
scenarioSchema.index({ status: 1 });

scenarioSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
};

const Scenario = mongoose.model('Scenario', scenarioSchema);

module.exports = Scenario;

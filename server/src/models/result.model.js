const mongoose = require('mongoose');

const resultSchema = mongoose.Schema(
    {
        scenario_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Scenario',
            required: true,
        },
        stops: {
            type: mongoose.Schema.Types.Mixed, // GeoJSON for transit stops
            required: true,
        },
        routes: {
            type: mongoose.Schema.Types.Mixed, // GeoJSON for routes
            required: true,
        },
        allocation: {
            type: mongoose.Schema.Types.Mixed, // e.g. how vehicles are distributed
            required: true,
        },
        coverage_percent: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        metrics: {
            type: mongoose.Schema.Types.Mixed, // arbitrary metrics like average_wait_time, etc.
            required: true,
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

resultSchema.index({ scenario_id: 1 });
resultSchema.index({ stops: '2dsphere' });
resultSchema.index({ routes: '2dsphere' });

resultSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
};

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;

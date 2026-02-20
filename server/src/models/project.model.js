const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
    {
        city_name: {
            type: String,
            required: true,
            trim: true,
        },
        boundary_geojson: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        created_by: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

projectSchema.index({ created_by: 1 });
projectSchema.index({ city_name: 1 });
projectSchema.index({ boundary_geojson: '2dsphere' });

projectSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

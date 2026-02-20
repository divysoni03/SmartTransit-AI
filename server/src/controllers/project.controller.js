const { Project, Scenario } = require('../models');
const { ApiError } = require('../utils/apiResponse');

const getProjects = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

        // User-based filtering
        const filter = { created_by: req.user._id };

        const options = {
            limit: parseInt(limit, 10),
            skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
            sort: { [sortBy]: order === 'desc' ? -1 : 1 }
        };

        const projects = await Project.find(filter, null, options);
        const total = await Project.countDocuments(filter);

        res.status(200).json({
            data: projects,
            meta: {
                total,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                totalPages: Math.ceil(total / parseInt(limit, 10))
            }
        });
    } catch (error) {
        next(error);
    }
};

const getProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const project = await Project.findOne({ _id: id, created_by: req.user._id });

        if (!project) {
            throw new ApiError(404, 'Project not found');
        }

        // Fetch scenarios associated with this project
        const scenarios = await Scenario.find({ project_id: id }).sort({ createdAt: -1 });

        res.status(200).json({
            data: {
                project,
                scenarios
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProjects,
    getProjectById
};

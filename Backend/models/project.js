const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    projectName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    deadline: {
        type: String,
        required: false,
    },
    dependency: {
        id: { type: String, default: "" },
        type: { type: String, enum: ['Task', 'Project', ""], default: "" }
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
        default: 'Not Started',
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

projectSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Add indexes for better query performance
projectSchema.index({ email: 1 }); // For filtering projects by email
projectSchema.index({ email: 1, status: 1 }); // For filtering by email and status
projectSchema.index({ email: 1, priority: 1 }); // For filtering by email and priority
projectSchema.index({ createdAt: -1 }); // For sorting by creation date

module.exports = mongoose.model("Project", projectSchema);

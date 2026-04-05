const mongoose = require("mongoose");

const taskScheme = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        taskName: {
            type: String,
            required: true,
        },
        detail: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: true,
        },
        deadline: {
            type: String,
            required: true,
        },
        dependency: {
            id: { type: String, default: "" },
            type: { type: String, enum: ['Task', 'Project', ""], default: "" }
        },
        status: {
            type: String,
            enum: ['Not Completed', 'Completed'],
            default: 'Not Completed',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: false,
        }
    },
    {
        timestamps: true, // Add createdAt and updatedAt
    }
)

// Add indexes for better query performance
taskScheme.index({ email: 1, status: 1 }); // For filtering by email and status
taskScheme.index({ email: 1, priority: 1 }); // For filtering by email and priority
taskScheme.index({ email: 1, createdAt: -1 }); // For sorting by creation date
taskScheme.index({ project: 1 }); // For project relationships

module.exports = mongoose.model("Task", taskScheme);
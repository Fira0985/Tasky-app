const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true, // e.g., "Created task", "Updated project", "Completed task"
    },
    target: {
        type: String,
        required: true, // The name of the task or project
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Activity", activitySchema);

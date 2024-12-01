const mongoose = require("mongoose")

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
            required: true,
        },
        deadline: {
            type: String,
            required: true,
        },
        dependency: {
            type: String,
            required: false,
        },

        status: {
            type: String,
            required: false,
        }
    }
)

module.exports = mongoose.model("Task", taskScheme);
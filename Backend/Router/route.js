const express = require("express")
// const Signup = require("../controller/control")
const User = require("../models/user")
const Task = require("../models/task");
const Project = require("../models/project");
const Activity = require("../models/activity");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const route = express.Router()

dotenv.config();

// Input validation helpers
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validateRequired = (value, fieldName) => {
    if (!value || value.trim().length === 0) {
        throw new Error(`${fieldName} is required`);
    }
};

route.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation
        validateRequired(name, 'Name');
        validateRequired(email, 'Email');
        validateRequired(password, 'Password');

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const userExist = await User.findOne({ email }).lean();

        if (userExist) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ name: name.trim(), email: email.toLowerCase().trim(), password });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { name: newUser.name, email: newUser.email }
        });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ message: 'Failed to register user', error: err.message });
    }
});

route.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        validateRequired(email, 'Email');
        validateRequired(password, 'Password');

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: "User logged in successfully",
            token,
            user: { name: user.name, email: user.email }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Login failed', error: err.message });
    }
})

route.post('/add-task', async (req, res) => {
    const { email,
        taskName,
        detail,
        priority,
        deadline,
        dependency, status } = req.body;

    try {
        const taskExist = await Task.findOne({ taskName })

        if (taskExist) {
            return res.status(400).json({ message: "This task already exists" })
        }
        const newTask = new Task({ email, taskName, detail, priority, deadline, dependency, status });
        await newTask.save();

        // Log Activity
        const newActivity = new Activity({
            email,
            action: "Created task",
            target: taskName
        });
        await newActivity.save();

        return res.status(201).json({ message: 'Task Added successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to add the task', error: err.message });
    }
});

route.get('/get-task', async (req, res) => {
    try {
        const { email, page = 1, limit = 50, status, priority } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Build query object
        const query = { email: email.toLowerCase().trim() };

        if (status && status !== 'all') {
            query.status = status;
        }

        if (priority && priority !== 'all') {
            query.priority = priority;
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const tasksLimit = parseInt(limit);

        // Get tasks with pagination and sorting
        const tasks = await Task.find(query)
            .sort({ createdAt: -1 }) // Most recent first
            .skip(skip)
            .limit(tasksLimit)
            .populate('project', 'projectName') // Populate project info if needed
            .lean(); // Use lean for better performance

        // Get total count for pagination info
        const totalTasks = await Task.countDocuments(query);

        return res.status(200).json({
            message: tasks,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalTasks / tasksLimit),
                totalTasks,
                hasNextPage: parseInt(page) * tasksLimit < totalTasks,
                hasPrevPage: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        return res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
    }
});

route.delete('/delete', async (req, res) => {
    const { name } = req.body; // Destructure taskName from the request body
    try {
        // Check if the task exists in the database
        const taskExist = await Task.findOne({ taskName: name });

        if (taskExist) {
            // Delete the task
            await Task.deleteOne({ taskName: name });

            // Log Activity
            const newActivity = new Activity({
                email: taskExist.email,
                action: "Deleted task",
                target: name
            });
            await newActivity.save();

            return res.status(200).json({ message: "Task deleted successfully" });
        }

        // If task does not exist
        return res.status(404).json({ message: "Task not found" });
    } catch (err) {
        // Handle unexpected errors
        return res.status(500).json({ message: 'Failed to delete task', error: err.message });
    }
});

route.post("/update", async (req, res) => {
    const { initialName,
        taskName,
        detail,
        priority,
        deadline,
        dependency } = req.body

    try {
        const task = await Task.findOneAndUpdate({ taskName: initialName }, { $set: { taskName: taskName, detail: detail, priority: priority, deadline: deadline, dependency: dependency } }, { new: true })

        // Log Activity
        const newActivity = new Activity({
            email: task.email,
            action: "Updated task",
            target: taskName
        });
        await newActivity.save();

        return res.status(200).json({ message: "Task Updated Successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }

})

route.post('/get-profile', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email }, { name: 1, email: 1, _id: 0 });
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch profile", error: error.message });
    }
});

route.post('/update-profile', async (req, res) => {
    const { email, name, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required to set a new one" });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect current password" });
            }
            user.password = newPassword;
        }

        await user.save();
        return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
});

route.post('/set-status', async (req, res) => {
    const { task_name, task_status } = req.body;

    try {
        const task = await Task.findOneAndUpdate(
            { taskName: task_name },
            { $set: { status: task_status } },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Log Activity
        const newActivity = new Activity({
            email: task.email,
            action: task_status === "Completed" ? "Completed task" : "Reopened task",
            target: task_name
        });
        await newActivity.save();

        return res.status(200).json({ message: "Task status updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update task status", error: error.message });
    }
});

route.post('/get-name', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email }, { name: 1, _id: 0 });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: user.name });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch user name", error: error.message });
    }
});

// Project routes
route.post('/create-project', async (req, res) => {
    const { email, projectName, description, priority, deadline } = req.body;

    try {
        const projectExist = await Project.findOne({ projectName, email });

        if (projectExist) {
            return res.status(400).json({ message: "Project with this name already exists" });
        }

        const newProject = new Project({
            email,
            projectName,
            description,
            priority,
            deadline,
            status: 'Not Started'
        });

        await newProject.save();
        return res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to create project', error: error.message });
    }
});

route.get('/get-projects', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email not found" });
    }

    try {
        const projects = await Project.find({ email }).populate('tasks');
        return res.status(200).json({ message: projects });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch projects", error: error.message });
    }
});

route.post('/add-task-to-project', async (req, res) => {
    const { projectId, taskName } = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const task = await Task.findOne({ taskName });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Remove task from any existing project
        await Project.updateMany(
            { tasks: task._id },
            { $pull: { tasks: task._id } }
        );

        // Add task to the new project
        project.tasks.push(task._id);
        task.project = projectId;

        await project.save();
        await task.save();

        return res.status(200).json({ message: "Task added to project successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to add task to project", error: error.message });
    }
});

route.delete('/delete-project', async (req, res) => {
    const { projectId } = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Remove project reference from all tasks in this project
        await Task.updateMany(
            { project: projectId },
            { $unset: { project: 1 } }
        );

        await Project.findByIdAndDelete(projectId);
        return res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete project", error: error.message });
    }
});

route.post('/update-project', async (req, res) => {
    const { projectId, projectName, description, priority, deadline, status } = req.body;

    try {
        const project = await Project.findByIdAndUpdate(
            projectId,
            {
                $set: {
                    projectName,
                    description,
                    priority,
                    deadline,
                    status,
                    updatedAt: Date.now()
                }
            },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json({ message: "Project updated successfully", project });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update project", error: error.message });
    }
});

// Activity Routes
route.get('/get-activity', async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    try {
        const activities = await Activity.find({ email })
            .sort({ timestamp: -1 })
            .limit(10)
            .lean();
        return res.status(200).json({ message: activities });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch activities", error: error.message });
    }
});

// Dashboard Stats Route
route.get('/dashboard-stats', async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalTasks = await Task.countDocuments({ email });
        const completedTasks = await Task.countDocuments({ email, status: "Completed" });
        const pendingTasks = totalTasks - completedTasks;

        // Calculate overdue: Not Completed and deadline < today
        const overdueTasks = await Task.countDocuments({
            email,
            status: "Not Completed",
            deadline: { $lt: today.toISOString().split('T')[0] }
        });

        return res.status(200).json({
            pending: pendingTasks,
            completed: completedTasks,
            overdue: overdueTasks
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch stats", error: error.message });
    }
});

module.exports = route;
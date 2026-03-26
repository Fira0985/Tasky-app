const express = require("express")
const User = require("../models/user")
const Task = require("../models/task");
const Project = require("../models/project");
const Activity = require("../models/activity");
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const route = express.Router()

dotenv.config();

// Multer Configuration for Profile Photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = filetypes.test(file.mimetype)

        if (mimetype && extname) {
            return cb(null, true)
        } else {
            cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"))
        }
    }
})

// Auth Middleware
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.email) {
        req.body.email = req.session.email;
        req.query.email = req.session.email;
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
};

route.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully' });
    });
});

route.get('/check-auth', isAuthenticated, (req, res) => {
    return res.status(200).json({ message: 'Authenticated', email: req.session.email });
});

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
        validateRequired(name, 'Name');
        validateRequired(email, 'Email');
        validateRequired(password, 'Password');

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const userExist = await User.findOne({ email }).lean();
        if (userExist) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const newUser = new User({ name: name.trim(), email: email.toLowerCase().trim(), password });
        await newUser.save();
        req.session.email = newUser.email;

        return res.status(201).json({
            message: 'User registered successfully',
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
        validateRequired(email, 'Email');
        validateRequired(password, 'Password');

        if (!validateEmail(email)) {
             return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        req.session.email = user.email;
        return res.status(200).json({
            message: "User logged in successfully",
            user: { name: user.name, email: user.email }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Login failed', error: err.message });
    }
})

route.post('/add-task', isAuthenticated, async (req, res) => {
    const { email, taskName, detail, priority, deadline, dependency, status } = req.body;
    try {
        const taskExist = await Task.findOne({ taskName })
        if (taskExist) {
            return res.status(400).json({ message: "This task already exists" })
        }
        const newTask = new Task({ email, taskName, detail, priority, deadline, dependency, status });
        await newTask.save();

        const newActivity = new Activity({ email, action: "Created task", target: taskName });
        await newActivity.save();

        return res.status(201).json({ message: 'Task Added successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to add the task', error: err.message });
    }
});

route.get('/get-task', isAuthenticated, async (req, res) => {
    try {
        const { email, page = 1, limit = 50, status, priority } = req.query;
        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!validateEmail(email)) return res.status(400).json({ message: "Invalid email format" });

        const query = { email: email.toLowerCase().trim() };
        if (status && status !== 'all') query.status = status;
        if (priority && priority !== 'all') query.priority = priority;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const tasksLimit = parseInt(limit);

        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(tasksLimit)
            .populate('project', 'projectName')
            .lean();

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

route.delete('/delete', isAuthenticated, async (req, res) => {
    const { name } = req.body;
    try {
        const taskExist = await Task.findOne({ taskName: name });
        if (taskExist) {
            await Task.deleteOne({ taskName: name });
            const newActivity = new Activity({ email: taskExist.email, action: "Deleted task", target: name });
            await newActivity.save();
            return res.status(200).json({ message: "Task deleted successfully" });
        }
        return res.status(404).json({ message: "Task not found" });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to delete task', error: err.message });
    }
});

route.post("/update", isAuthenticated, async (req, res) => {
    const { initialName, taskName, detail, priority, deadline, dependency } = req.body
    try {
        const task = await Task.findOneAndUpdate({ taskName: initialName }, { $set: { taskName: taskName, detail: detail, priority: priority, deadline: deadline, dependency: dependency } }, { new: true })
        const newActivity = new Activity({ email: task.email, action: "Updated task", target: taskName });
        await newActivity.save();
        return res.status(200).json({ message: "Task Updated Successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
})

route.post('/get-profile', isAuthenticated, async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email }, { name: 1, email: 1, avatar: 1, _id: 0 });
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch profile", error: error.message });
    }
});

route.post('/update-profile', isAuthenticated, async (req, res) => {
    const { email, name, currentPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (newPassword) {
            if (!currentPassword) return res.status(400).json({ message: "Current password is required" });
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });
            user.password = newPassword;
        }

        await user.save();
        return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
});

route.post('/set-status', isAuthenticated, async (req, res) => {
    const { task_name, task_status } = req.body;
    try {
        const task = await Task.findOneAndUpdate({ taskName: task_name }, { $set: { status: task_status } }, { new: true });
        if (!task) return res.status(404).json({ message: "Task not found" });
        const newActivity = new Activity({ email: task.email, action: task_status === "Completed" ? "Completed task" : "Reopened task", target: task_name });
        await newActivity.save();
        return res.status(200).json({ message: "Task status updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update task status", error: error.message });
    }
});

route.post('/get-name', isAuthenticated, async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email }, { name: 1, avatar: 1, _id: 0 });
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ name: user.name, avatar: user.avatar });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch user info", error: error.message });
    }
});

// Project routes
route.post('/create-project', isAuthenticated, async (req, res) => {
    const { email, projectName, description, priority, deadline, dependency, tasks } = req.body;
    try {
        const projectExist = await Project.findOne({ projectName, email });
        if (projectExist) return res.status(400).json({ message: "Project with this name already exists" });

        const newProject = new Project({ email, projectName, description, priority, deadline, dependency, status: 'Not Started', tasks: tasks || [] });
        await newProject.save();

        if (tasks && tasks.length > 0) {
            await Task.updateMany({ _id: { $in: tasks } }, { $set: { project: newProject._id } });
        }
        return res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to create project', error: error.message });
    }
});

route.get('/get-projects', isAuthenticated, async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email not found" });
    try {
        const projects = await Project.find({ email }).populate('tasks').lean();
        return res.status(200).json({ message: projects });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch projects", error: error.message });
    }
});

route.post('/update-project', isAuthenticated, async (req, res) => {
    const { projectId, projectName, description, priority, deadline, dependency, status, tasks } = req.body;
    try {
        const oldProject = await Project.findById(projectId);
        if (!oldProject) return res.status(404).json({ message: "Project not found" });

        const project = await Project.findByIdAndUpdate(projectId, { $set: { projectName, description, priority, deadline, dependency, status, tasks: tasks || [], updatedAt: Date.now() } }, { new: true });
        const removedTasks = oldProject.tasks.filter(id => !tasks.includes(id.toString()));
        if (removedTasks.length > 0) {
            await Task.updateMany({ _id: { $in: removedTasks } }, { $unset: { project: 1 } });
        }
        if (tasks && tasks.length > 0) {
            await Task.updateMany({ _id: { $in: tasks } }, { $set: { project: projectId } });
        }
        return res.status(200).json({ message: "Project updated successfully", project });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update project", error: error.message });
    }
});

route.get('/get-activity', isAuthenticated, async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });
    try {
        const activities = await Activity.find({ email }).sort({ timestamp: -1 }).limit(10).lean();
        return res.status(200).json({ message: activities });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch activities", error: error.message });
    }
});

route.get('/dashboard-stats', isAuthenticated, async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const totalTasks = await Task.countDocuments({ email });
        const completedTasks = await Task.countDocuments({ email, status: "Completed" });
        const pendingTasks = totalTasks - completedTasks;
        const overdueTasks = await Task.countDocuments({ email, status: "Not Completed", deadline: { $lt: today.toISOString().split('T')[0] } });
        return res.status(200).json({ pending: pendingTasks, completed: completedTasks, overdue: overdueTasks });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch stats", error: error.message });
    }
});

// Update Avatar Endpoint
route.post("/update-avatar", isAuthenticated, upload.single("avatar"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ ok: false, message: "No file uploaded" });
        const email = req.session.email;
        const avatarUrl = `/uploads/${req.file.filename}`;
        const user = await User.findOneAndUpdate({ email }, { $set: { avatar: avatarUrl } }, { new: true });
        if (!user) return res.status(404).json({ ok: false, message: "User not found" });
        res.status(200).json({ ok: true, message: "Profile photo updated successfully", avatarUrl });
    } catch (error) {
        console.error("Avatar upload error:", error);
        res.status(500).json({ ok: false, message: "Server error during upload" });
    }
});

module.exports = route;

const express = require("express")
// const Signup = require("../controller/control")
const User = require("../models/user")
const Task = require("../models/task");


const route = express.Router()

route.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Await the asynchronous findOne call
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const newUser = new User({ name, email, password });
        
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to register user', error: err.message });
    }
});

route.post('/login', async (req,res) => {
    const {email, password} = req.body
    userEmail = email
    try{
        const userExist = await User.findOne({email})
        

        if(userExist){
            if (userExist.password == password){
                return res.status(200).json({message: "User loged in successfully"})
            }
            return res.status(400).json({message: "Incorrect Password"})
        }
        return res.status(404).json({message: "You don't have account,so please register first"})
    } catch(err){
        return res.status(400).json({message: err.message})
    }
})

route.post('/add-task', async (req, res) => {
    const { email,
        taskName,
        detail,
        priority,
        deadline,
        dependency,status } = req.body;

    try {
        const taskExist = await Task.findOne({taskName})

        if(taskExist){
            return res.status(400).json({message: "This task already exists"})
        }
        const newTask = new Task({email, taskName, detail, priority,deadline,dependency,status });
        
        await newTask.save();

        return res.status(201).json({ message: 'Task Added successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to add the task', error: err.message });
    }
});

route.get('/get-task', async (req,res) => {
    const { email } = req.query

    if (!email){
        return res.status(400).json({message: "Email not Found"})
    }
    try {
    // Find all tasks with email
    const tasks = await Task.find({email: email});
    // console.log('Tasks', tasks);
    return res.status(200).json({ message: tasks });
} catch (error) {
    console.error('Error reading tasks:', error);
    return res.status(404).json({ message: "Failed to get task" });
}
});

route.post('/get-name', async (req, res) => {
    const { email } = req.body;
    try {
      // Find the user's name by email
      const user = await User.findOne({ email }, { name: 1, _id: 0 }); // Only select `name`
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: user.name });
    } catch (error) {
      console.error('Error reading user name:', error);
      return res.status(500).json({ message: "Failed to get name of the user" });
    }
  });

route.post('/remove-task',async (req,res) =>{
    const { task_name } = req.body;

    try {
        // Find all tasks
        const task = await Task.deleteOne({task_name});
    } catch (error) {
        console.error('Error deleting the task', error);
        return res.status(404).json({ message: "Failed to delete the task" });
    }
})

route.post('/set-status', async (req,res) =>{
    const {task_name,task_status} = req.body

    if (!task_name || !task_status){
        console.log("this is")
        return res.status(400).json({message: "task name and task status required for this operation"})
    }

    try {
        const task = await Task.findOneAndUpdate({taskName: task_name},{$set: {status: task_status}},{new: true})
        return res.status(200).json({message: "Task status updated successfully"})
    } catch (error){
        return res.status(500).json({message : "Failed to update the task" + error})
    }
})

// route.get('/get-complete', async (req,res) => {
//     try{

//     } catch(err){

//     }
// })

module.exports = route;
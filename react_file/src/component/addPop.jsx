import React, { useState } from "react";
import '../styles/addPop.css';


function Add(props){
    const [taskName,setTaskName] = useState("")
    const [detail, setDetail] = useState("")
    const email = props.email
    const [priority, setPriority] = useState("")
    const [deadline, setDeadline] = useState("")
    const [dependency, setDependency] = useState("")
    const [status, setStatus] = useState("Not Completed")

    const data = {
    email,
    taskName,
    detail,
    priority,
    deadline,
    dependency,
    status
    }

    function taskNameValue(event){
        setTaskName(event.target.value)
    }

    function detailValue(event){
        setDetail(event.target.value)
    }

    function priorityValue(event){
        setPriority(event.target.value)
    }

    function deadlineValue(event){
        setDeadline(event.target.value)
    }

    function dependencyValue(event){
        setDependency(event.target.value)
    }

    // Used to close the form
    function closeForm(){
        props.GetData(false)
    }

    async function TaskFormRequest(event) {
        event.preventDefault()
        const url = "https://tasky-app-backend.vercel.app/add-task"
        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
  
        try{
            const response = await fetch(url, option)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Request failed with status ${response.status}: ${errorData.message}`);
            }
            const result = await response.json();
            closeForm()
        } catch(error){
            const response = await fetch(url, option)
            const result = await response.json();
            console.error("There was an error during the request:", error.message);
        }
    }

    return(
        <div className="form-container">
        <span class="close-btn" onClick={closeForm}>&times;</span>
        <h2>Add New Task</h2>
        <form action="#" onSubmit={TaskFormRequest}>
            <div className="form-group">
                <label for="taskName">Task Name</label>
                <input type="text" id="taskName" placeholder="Enter task name" required onChange={taskNameValue} />
            </div>
            <div className="form-group">
                <label for="taskDetail">Task Details</label>
                <textarea id="taskDetail" rows="4" placeholder="Enter task details" required onChange={detailValue}></textarea>
            </div>
            <div className="form-group">
                <label for="taskDeadline">Deadline</label>
                <input type="date" id="taskDeadline" required onChange={deadlineValue} />
            </div>
            <div className="form-group">
                <label for="taskPriority">Priority</label>
                <select id="taskPriority" required onChange={priorityValue}>
                    <option value="" disabled selected>Select priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>
            <div className="form-group">
                <label for="taskDependencies">Dependencies</label>
                <input type="text" id="taskDependencies" placeholder="Enter dependencies (optional)" onChange={dependencyValue} />
            </div>
            <button type="submit" className="submit-btn">Add Task</button>
        </form>
    </div>
    )
}


export default Add
import React, { useState } from "react";
import "../styles/editForm.css";

function EditTaskForm(props) {

    const initialName = props.name
    const [taskName,setTaskName] = useState(props.name || "")
    const [detail, setDetail] = useState(props.detail || "")
    const [priority, setPriority] = useState(props.priority || "")
    const [deadline, setDeadline] = useState(props.deadline || "")
    const [dependency, setDependency] = useState(props.dependency || "")
    const api_url = process.env.REACT_APP_API_URL
    const api_url_vercel = process.env.REACT_APP_API_URL_vercel

    const data = {
    initialName,
    taskName,
    detail,
    priority,
    deadline,
    dependency,
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


    function closeForm(){
        props.GetData(false)
    }

    async function UpdateTask(event){
        event.preventDefault()
        const url = api_url + "update"
        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        try{
            const response = await fetch(url,option)

            if (!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            closeForm()
            return await response.json()
        } catch (error) {
            return {message: "Failed to Update the Task"}
        }
    }

    return (
        <form className="edit-task-form" onSubmit={UpdateTask}>
            <span class="close-btn" onClick={closeForm}>&times;</span>
            <h2>Edit Task</h2>

            <div>
                <label htmlFor="taskName">Task Name:</label>
                <input
                    type="text"
                    id="taskName"
                    name="taskName"
                    defaultValue={props.name}
                    onChange={taskNameValue}
                    required
                />
            </div>

            <div>
                <label htmlFor="detail">Detail:</label>
                <textarea
                    id="detail"
                    name="detail"
                    defaultValue={props.detail}
                    onChange={detailValue}
                    required
                ></textarea>
            </div>

            <div>
                <label htmlFor="priority">Priority:</label>
                <select id="priority" name="priority" required defaultValue={props.priority} onChange={priorityValue}>
                    <option value="">Select priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

            <div>
                <label htmlFor="deadline">Deadline:</label>
                <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    defaultValue={props.deadline}
                    onChange={deadlineValue}
                    required
                />
            </div>

            <div>
                <label htmlFor="dependency">Dependency:</label>
                <input
                    type="text"
                    id="dependency"
                    name="dependency"
                    defaultValue={props.dependency}
                    onChange={dependencyValue}
                />
            </div>

            <button type="submit">Update Task</button>
        </form>
    );
};

export default EditTaskForm;

import React from 'react';
import '../styles/task.css';

function Task (props){

    async function DeleteTask(){
        const url = "https://tasky-app-backend.vercel.app/delete"
        const option = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: props.TName})
        }

        try{
            const response = await fetch(url,option)

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error){
            return {message: error}
        }
    }

    function sendEvent(){
        props.editEvent(true,props.TName,props.detail,props.priority,props.deadline,props.dependency)
    }

    function HandleStatus(event){
        // setStatus(event.target.checked)
        localStorage.setItem(props.TName, event.target.checked)
        props.StatusData(props.TName, event.target.checked)
    }

    return(
        <div className="task-card">
        <div class="task-header">
            <h3 className="task-title">Task Name: {props.TName}</h3>
            <span className="task-status">Status: <strong>{props.status}</strong></span>
        </div>
        <div className="task-body">
            <p><strong>Details:</strong>{props.detail}</p>
            <p><strong>Deadline:</strong>{props.deadline}</p>
            <p><strong>Priority:</strong>{props.priority}</p>
            <p><strong>Dependencies:</strong>{props.dependency}</p>
        </div>
        <div className="task-footer">
            <label className="complete-checkbox">
                <input type="checkbox" checked={(localStorage.getItem(props.TName) === 'true')} className="checkbox" onChange={HandleStatus} />
                <span>Mark as Complete</span>
            </label>
            <div class="action-buttons">
                <button className="edit-btn" onClick={sendEvent}>Edit</button>
                <button className="delete-btn" onClick={DeleteTask}>Delete</button>
            </div>
        </div>
    </div>
    )
}

export default Task
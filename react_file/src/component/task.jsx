import React, { useCallback } from 'react';
import {
    Pencil,
    Trash2,
    Clock,
    Layers,
    Info,
    AlertTriangle
} from "lucide-react";
import '../styles/task.css';

function Task(props) {
    const api_url_vercel = process.env.REACT_APP_API_URL_vercel;
    const isCompleted = props.status === "Completed";

    const deleteTask = useCallback(async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            const response = await fetch(api_url_vercel + "delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: props.TName })
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            if (props.onRefresh) props.onRefresh();
        } catch (error) {
            console.error('Delete task error:', error);
            alert("Failed to delete task. Please try again.");
        }
    }, [api_url_vercel, props.TName]);

    const sendEvent = useCallback(() => {
        props.editEvent(true, props.TName, props.detail, props.priority, props.deadline, props.dependency);
    }, [props.editEvent, props.TName, props.detail, props.priority, props.deadline, props.dependency]);

    const handleStatus = useCallback((event) => {
        props.StatusData(props.TName, event.target.checked);
    }, [props.StatusData, props.TName]);

    const priorityClass = `priority-badge priority-${props.priority.toLowerCase()}`;

    return (
        <div className={`task-card ${isCompleted ? 'completed' : ''}`}>
            <div className="task-header">
                <h3 className="task-title">{props.TName}</h3>
                <span className={priorityClass}>{props.priority}</span>
            </div>

            <div className="task-body">
                <p className="task-detail">{props.detail}</p>
                <div className="task-info-item">
                    <Clock size={14} />
                    <span>Due: {props.deadline}</span>
                </div>
                <div className="task-info-item">
                    <Layers size={14} />
                    <span>Depends on: {props.dependency || 'None'}</span>
                </div>
            </div>

            <div className="task-footer">
                <label className="status-toggle">
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={handleStatus}
                    />
                    <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
                </label>

                <div className="action-buttons">
                    <button className="task-action-btn btn-edit" title="Edit Task" onClick={sendEvent}>
                        <Pencil size={16} />
                    </button>
                    <button className="task-action-btn btn-delete" title="Delete Task" onClick={deleteTask}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Task;
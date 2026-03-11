import React, { useCallback } from 'react';
import {
    Pencil,
    Trash2,
    Clock,
    Layers,
} from "lucide-react";
import '../styles/task.css';
import { fetchAPI } from '../api';

function Task(props) {
    const isCompleted = props.status === "Completed";

    const deleteTask = useCallback(async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            const result = await fetchAPI("delete", {
                method: "DELETE",
                body: JSON.stringify({ name: props.TName })
            });

            if (!result.ok) throw new Error(result.message || "Failed to delete task");

            if (props.onRefresh) props.onRefresh();
        } catch (error) {
            console.error('Delete task error:', error);
            alert(error.message || "Failed to delete task. Please try again.");
        }
    }, [props.TName, props.onRefresh]);

    const sendEvent = useCallback(() => {
        props.editEvent(true, props.TName, props.detail, props.priority, props.deadline, props.dependency);
    }, [props.editEvent, props.TName, props.detail, props.priority, props.deadline, props.dependency]);

    const handleStatus = useCallback((event) => {
        props.StatusData(props.TName, event.target.checked);
    }, [props.StatusData, props.TName]);

    const priorityLower = props.priority?.toLowerCase() || 'low';
    const priorityClass = `priority-badge priority-${priorityLower}`;
    const cardClass = `task-card ${isCompleted ? 'completed' : ''} border-priority-${priorityLower}`;

    return (
        <div className={cardClass}>
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
                {props.dependency && (
                    <div className="task-info-item">
                        <Layers size={14} />
                        <span>Depends on: {props.dependency}</span>
                    </div>
                )}
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
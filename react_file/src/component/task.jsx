import React, { useCallback } from 'react';
import {
    Pencil,
    Trash2,
    Clock,
    Layers,
} from "lucide-react";
import '../styles/task.css';
import { fetchAPI } from '../api';
import ProfileImage from '../asset/profile.png';

function Task(props) {
    const isCompleted = props.status === "Completed";
    const progress = isCompleted ? 100 : 40; // Simulated progress for visual parity

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

    const handleStatus = useCallback(() => {
        props.StatusData(props.TName, !isCompleted);
    }, [props.StatusData, props.TName, isCompleted]);

    const priorityLower = props.priority?.toLowerCase() || 'low';
    const priorityClass = `priority-badge priority-${priorityLower}`;
    const cardClass = `task-card ${isCompleted ? 'completed' : ''}`;

    return (
        <div className={cardClass}>
            <div className="task-header">
                <div className="task-title" onClick={handleStatus}>
                    <div className="task-checkbox-custom"></div>
                    {props.TName}
                </div>
                <span className={priorityClass}>{props.priority}</span>
            </div>

            <div className="task-body">
                <div className="task-meta">
                    <div className="meta-item">
                        <Clock size={14} />
                        <span>{props.deadline}</span>
                    </div>
                    {props.dependency && (
                        <div className="meta-item">
                            <Layers size={14} />
                            <span>{props.dependency}</span>
                        </div>
                    )}
                </div>

                <p className="task-detail">{props.detail}</p>

                <div className="progress-container">
                    <div className="progress-label">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="task-footer">
                <div className="collaborators">
                    <img src={ProfileImage} alt="User" className="collab-avatar" />
                    <div className="collab-avatar" style={{ background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>+2</div>
                </div>

                <div className="task-actions">
                    <button className="task-action-btn-modern" onClick={sendEvent}>
                        <Pencil size={16} />
                    </button>
                    <button className="task-action-btn-modern btn-delete-modern" onClick={deleteTask}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Task;
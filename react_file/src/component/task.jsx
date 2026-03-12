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
    const {
        status,
        TName,
        onRefresh,
        editEvent,
        detail,
        priority,
        deadline,
        dependency,
        StatusData
    } = props;

    const isCompleted = status === "Completed";
    const progress = isCompleted ? 100 : 40; // Simulated progress for visual parity

    const deleteTask = useCallback(async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            const result = await fetchAPI("delete", {
                method: "DELETE",
                body: JSON.stringify({ name: TName })
            });

            if (!result.ok) throw new Error(result.message || "Failed to delete task");

            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Delete task error:', error);
            alert(error.message || "Failed to delete task. Please try again.");
        }
    }, [TName, onRefresh]);

    const sendEvent = useCallback(() => {
        editEvent(true, TName, detail, priority, deadline, dependency);
    }, [editEvent, TName, detail, priority, deadline, dependency]);

    const handleStatus = useCallback(() => {
        StatusData(TName, !isCompleted);
    }, [StatusData, TName, isCompleted]);

    const priorityLower = props.priority?.toLowerCase() || 'low';
    const priorityClass = `priority-badge priority-${priorityLower}`;
    const cardClass = `task-card ${isCompleted ? 'completed' : ''}`;

    return (
        <div className={cardClass}>
            <div className="task-header">
                <div className="task-title" onClick={handleStatus}>
                    <div className="task-checkbox-custom"></div>
                    {TName}
                </div>
                <span className={priorityClass}>{priority}</span>
            </div>

            <div className="task-body">
                <div className="task-meta">
                    <div className="meta-item">
                        <Clock size={14} />
                        <span>{deadline}</span>
                    </div>
                    {dependency && (
                        <div className="meta-item">
                            <Layers size={14} />
                            <span>{dependency}</span>
                        </div>
                    )}
                </div>

                <p className="task-detail">{detail}</p>

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
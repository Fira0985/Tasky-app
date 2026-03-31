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
    const {
        status,
        TName,
        onRefresh,
        editEvent,
        detail,
        priority,
        deadline,
        dependency,
        StatusData,
        allTasks = [],
        allProjects = []
    } = props;

    // Resolve dependency info
    const resolvedDep = React.useMemo(() => {
        if (!dependency || !dependency.id) return null;
        if (dependency.type === 'Task') {
            const depTask = allTasks.find(t => t._id === dependency.id);
            return depTask ? { name: depTask.taskName, status: depTask.status, type: 'Task' } : null;
        } else if (dependency.type === 'Project') {
            const depProj = allProjects.find(p => p._id === dependency.id);
            return depProj ? { name: depProj.projectName, status: depProj.status, type: 'Project' } : null;
        }
        return null;
    }, [dependency, allTasks, allProjects]);

    const isBlocked = resolvedDep && resolvedDep.status !== "Completed";

    const isCompleted = status === "Completed";

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
        editEvent(true, TName, detail, priority, deadline, dependency, status);
    }, [editEvent, TName, detail, priority, deadline, dependency, status]);

    const handleStatus = useCallback(() => {
        if (!isCompleted && isBlocked) {
            alert(`This task is blocked by "${resolvedDep.name}". Please complete that first.`);
            return;
        }
        StatusData(TName, !isCompleted);
    }, [StatusData, TName, isCompleted, isBlocked, resolvedDep]);

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
                        <Clock size={16} />
                        <span>Due: {deadline}</span>
                    </div>
                    {resolvedDep && (
                        <div className={`meta-item ${isBlocked ? 'blocked-meta' : 'cleared-meta'}`}>
                            <Layers size={16} />
                            <span>{isBlocked ? 'Blocked by: ' : 'Requires: '} {resolvedDep.name}</span>
                        </div>
                    )}
                </div>

                <p className="task-detail">{detail}</p>
            </div>

            <div className="task-footer">
                <div className="task-actions">
                    <button className="task-action-btn-modern" onClick={sendEvent} title="Edit Task">
                        <Pencil size={16} />
                    </button>
                    <button className="task-action-btn-modern btn-delete-modern" onClick={deleteTask} title="Delete Task">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Task;

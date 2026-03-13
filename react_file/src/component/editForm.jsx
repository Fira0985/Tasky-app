import React, { useState, useCallback, useEffect } from "react";
import { X, Type, AlignLeft, Calendar, Flag, Link, Loader2 } from "lucide-react";
import "../styles/editForm.css";
import { fetchAPI } from "../api";

function EditTaskForm(props) {
    const initialName = props.name;
    const [taskName, setTaskName] = useState(props.name || "");
    const [detail, setDetail] = useState(props.detail || "");
    const [priority, setPriority] = useState(props.priority?.toLowerCase() || "");
    const [deadline, setDeadline] = useState(props.deadline || "");
    const [dependency, setDependency] = useState(props.dependency || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const closeForm = useCallback(() => {
        props.GetData(false);
    }, [props.GetData]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeForm();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeForm]);

    async function UpdateTask(event) {
        event.preventDefault();
        setLoading(true);
        setError("");

        const data = {
            initialName,
            taskName,
            detail,
            priority,
            deadline,
            dependency,
        };

        try {
            const result = await fetchAPI("/update", {
                method: "POST",
                body: JSON.stringify(data)
            });

            if (!result.ok) {
                throw new Error(result.message || "Failed to update task");
            }

            closeForm();
            if (props.onRefresh) props.onRefresh();
        } catch (error) {
            console.error("Error updating task:", error);
            setError(error.message || "Failed to update the task");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeForm()}>
            <div className="form-container">
                <button className="close-btn" onClick={closeForm} title="Close">
                    <X size={20} />
                </button>

                <h2>Edit Task</h2>

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={UpdateTask}>
                    <div className="form-group">
                        <label htmlFor="taskName">Task Name</label>
                        <div className="input-wrapper">
                            <Type size={18} />
                            <input
                                type="text"
                                id="taskName"
                                placeholder="Task name"
                                required
                                onChange={(e) => setTaskName(e.target.value)}
                                value={taskName}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="taskDetail">Description</label>
                        <div className="input-wrapper">
                            <AlignLeft size={18} style={{ top: '0.85rem' }} />
                            <textarea
                                id="taskDetail"
                                rows="3"
                                placeholder="Task description..."
                                required
                                onChange={(e) => setDetail(e.target.value)}
                                value={detail}
                                disabled={loading}
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label htmlFor="taskDeadline">Deadline</label>
                            <div className="input-wrapper">
                                <Calendar size={18} />
                                <input
                                    type="date"
                                    id="taskDeadline"
                                    required
                                    onChange={(e) => setDeadline(e.target.value)}
                                    value={deadline}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="taskPriority">Priority</label>
                            <div className="input-wrapper">
                                <Flag size={18} />
                                <select
                                    id="taskPriority"
                                    required
                                    onChange={(e) => setPriority(e.target.value)}
                                    value={priority}
                                    disabled={loading}
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="taskDependencies">Project / Dependency</label>
                        <div className="input-wrapper">
                            <Link size={18} />
                            <input
                                type="text"
                                id="taskDependencies"
                                placeholder="Link to project or other task"
                                onChange={(e) => setDependency(e.target.value)}
                                value={dependency}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Loader2 size={18} className="animate-spin" />
                                Updating...
                            </span>
                        ) : "Update Task"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditTaskForm;

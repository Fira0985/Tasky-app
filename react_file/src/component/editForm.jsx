import React, { useState, useEffect } from "react";
import { X, Type, AlignLeft, Calendar, Flag, Link, Loader2, Edit3, Save } from "lucide-react";
import "../styles/editForm.css";
import { fetchAPI } from "../api";

function EditForm(props) {
    const [taskName, setTaskName] = useState(props.task.taskName || "");
    const [detail, setDetail] = useState(props.task.detail || "");
    const [priority, setPriority] = useState(props.task.priority || "");
    const [deadline, setDeadline] = useState(props.task.deadline || "");
    const [dependency, setDependency] = useState(props.task.dependency || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const email = props.email;
    const taskId = props.task.id;

    const closeForm = () => {
        props.GetData(false);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeForm();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const editFormRequest = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const data = {
            id: taskId,
            email,
            taskName,
            detail,
            priority,
            deadline,
            dependency,
            status: props.task.status,
        };

        try {
            const result = await fetchAPI("edit-task", {
                method: "PUT",
                body: JSON.stringify(data)
            });

            if (!result.ok) {
                throw new Error(result.message || "Failed to update task");
            }

            closeForm();
            if (props.onRefresh) props.onRefresh();
        } catch (error) {
            console.error("Error updating task:", error);
            setError(error.message || "Failed to update task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeForm()}>
            <div className="premium-form-container edit-task-modal">
                <div className="form-header-decoration edit-theme"></div>
                <button className="close-btn" onClick={closeForm} title="Close">
                    <X size={20} />
                </button>

                <div className="form-title-section">
                    <div className="icon-badge edit-theme">
                        <Edit3 size={24} />
                    </div>
                    <h2>Edit Task</h2>
                    <p>Refine your task details</p>
                </div>

                {error && (
                    <div className="error-message animate-shake">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={editFormRequest}>
                    <div className="premium-input-group">
                        <label className="premium-label" htmlFor="taskName">Task Name</label>
                        <div className="premium-input-wrapper">
                            <Type size={18} />
                            <input
                                className="premium-input"
                                type="text"
                                id="taskName"
                                required
                                onChange={(e) => setTaskName(e.target.value)}
                                value={taskName}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="premium-input-group">
                        <label className="premium-label" htmlFor="taskDetail">Description</label>
                        <div className="premium-input-wrapper">
                            <AlignLeft size={18} style={{ top: '0.85rem' }} />
                            <textarea
                                className="premium-input premium-textarea"
                                id="taskDetail"
                                rows="3"
                                required
                                onChange={(e) => setDetail(e.target.value)}
                                value={detail}
                                disabled={loading}
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-row-grid">
                        <div className="premium-input-group">
                            <label className="premium-label" htmlFor="taskDeadline">Deadline</label>
                            <div className="premium-input-wrapper">
                                <Calendar size={18} />
                                <input
                                    className="premium-input"
                                    type="date"
                                    id="taskDeadline"
                                    required
                                    onChange={(e) => setDeadline(e.target.value)}
                                    value={deadline}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="premium-input-group">
                            <label className="premium-label" htmlFor="taskPriority">Priority</label>
                            <div className="premium-input-wrapper">
                                <Flag size={18} />
                                <select
                                    className="premium-input"
                                    id="taskPriority"
                                    required
                                    onChange={(e) => setPriority(e.target.value)}
                                    value={priority}
                                    disabled={loading}
                                >
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="premium-input-group">
                        <label className="premium-label" htmlFor="taskDependencies">Project / Dependency</label>
                        <div className="premium-input-wrapper">
                            <Link size={18} />
                            <input
                                className="premium-input"
                                type="text"
                                id="taskDependencies"
                                placeholder="Link to project or other task"
                                onChange={(e) => setDependency(e.target.value)}
                                value={dependency}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button type="submit" className="premium-btn-primary edit-theme" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditForm;

import React, { useState, useCallback, useEffect } from "react";
import { X, Type, AlignLeft, Calendar, Flag, Link, Loader2, PlusCircle } from "lucide-react";
import '../styles/addPop.css';
import { fetchAPI } from "../api";

function AddForm(props) {
    const [taskName, setTaskName] = useState("");
    const [detail, setDetail] = useState("");
    const [priority, setPriority] = useState("");
    const [deadline, setDeadline] = useState("");
    const [dependency, setDependency] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const email = props.email;

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

    const taskFormRequest = useCallback(async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const data = {
            email,
            taskName,
            detail,
            priority,
            deadline,
            dependency,
            status: "Not Completed"
        };

        try {
            const result = await fetchAPI("add-task", {
                method: "POST",
                body: JSON.stringify(data)
            });

            if (!result.ok) {
                throw new Error(result.message || "Failed to add task");
            }

            closeForm();
            if (props.onRefresh) props.onRefresh();
        } catch (error) {
            console.error("Error adding task:", error);
            setError(error.message || "Failed to add task. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [email, taskName, detail, priority, deadline, dependency, closeForm, props]);

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeForm()}>
            <div className="premium-form-container add-task-modal">
                <div className="form-header-decoration"></div>
                <button className="close-btn" onClick={closeForm} title="Close">
                    <X size={20} />
                </button>

                <div className="form-title-section">
                    <div className="icon-badge">
                        <PlusCircle size={24} />
                    </div>
                    <h2>Add New Task</h2>
                    <p>Organize your day with a new objective</p>
                </div>

                {error && (
                    <div className="error-message animate-shake">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={taskFormRequest}>
                    <div className="premium-input-group">
                        <label className="premium-label" htmlFor="taskName">Task Name</label>
                        <div className="premium-input-wrapper">
                            <Type size={18} />
                            <input
                                className="premium-input"
                                type="text"
                                id="taskName"
                                placeholder="What needs to be done?"
                                required
                                onChange={(e) => setTaskName(e.target.value)}
                                value={taskName}
                                disabled={loading}
                                autoFocus
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
                                placeholder="Add more details..."
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
                                    <option value="" disabled>Select</option>
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

                    <button type="submit" className="premium-btn-primary" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <PlusCircle size={18} />
                                <span>Add Task</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddForm;
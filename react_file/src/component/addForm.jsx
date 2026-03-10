import React, { useState, useCallback, useEffect } from "react";
import { X, Type, AlignLeft, Calendar, Flag, Link, Loader2 } from "lucide-react";
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
            <div className="form-container">
                <button className="close-btn" onClick={closeForm} title="Close">
                    <X size={20} />
                </button>

                <h2>Add New Task</h2>

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={taskFormRequest}>
                    <div className="form-group">
                        <label htmlFor="taskName">Task Name</label>
                        <div className="input-wrapper">
                            <Type size={18} />
                            <input
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

                    <div className="form-group">
                        <label htmlFor="taskDetail">Description</label>
                        <div className="input-wrapper">
                            <AlignLeft size={18} style={{ top: '0.85rem' }} />
                            <textarea
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
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
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
                                Adding...
                            </span>
                        ) : "Add Task"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddForm;
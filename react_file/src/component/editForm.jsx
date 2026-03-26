import React, { useState, useEffect } from "react";
import { X, Type, AlignLeft, Calendar, Flag, Link, Loader2, Edit3, Save } from "lucide-react";
import "../styles/editForm.css";
import { fetchAPI } from "../api";

function EditForm(props) {
    const [taskName, setTaskName] = useState(props.name || "");
    const [detail, setDetail] = useState(props.detail || "");
    const [priority, setPriority] = useState(props.priority || "");
    const [deadline, setDeadline] = useState(props.deadline || "");
    const [dependency, setDependency] = useState(props.dependency || { id: "", type: "" });
    const [availableDependencies, setAvailableDependencies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const closeForm = () => {
        props.GetData(false);
    };

    useEffect(() => {
        const fetchDeps = async () => {
            const email = localStorage.getItem('userEmail'); // Or however email is available
            const [tasksRes, projectsRes] = await Promise.all([
                fetchAPI(`/get-task?email=${email}`),
                fetchAPI(`/get-projects?email=${email}`)
            ]);
            
            let deps = [];
            if (tasksRes.ok) {
                // Filter out the current task to prevent self-dependency and completed tasks
                deps = [...deps, ...tasksRes.data.message
                    .filter(t => t.taskName !== props.name && t.status !== "Completed")
                    .map(t => ({ id: t._id, name: t.taskName, type: 'Task' }))];
            }
            if (projectsRes.ok) {
                deps = [...deps, ...projectsRes.data.message
                    .filter(p => p.status !== "Completed")
                    .map(p => ({ id: p._id, name: p.projectName, type: 'Project' }))];
            }
            setAvailableDependencies(deps);
        };
        fetchDeps();

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeForm();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [props.name]);

    const editFormRequest = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const data = {
            initialName: props.name,
            taskName,
            detail,
            priority,
            deadline,
            dependency
        };

        try {
            const result = await fetchAPI("update", {
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
            setError(error.message || "Failed to update task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeForm()}>
            <div className="modern-form-container edit-task-modal">
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
                    <div className="modern-input-group">
                        <label className="modern-label" htmlFor="taskName">Task Name</label>
                        <div className="modern-input-wrapper">
                            <Type size={18} />
                            <input
                                className="modern-input"
                                type="text"
                                id="taskName"
                                required
                                onChange={(e) => setTaskName(e.target.value)}
                                value={taskName}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="modern-input-group">
                        <label className="modern-label" htmlFor="taskDetail">Description</label>
                        <div className="modern-input-wrapper">
                            <AlignLeft size={18} style={{ top: '0.85rem' }} />
                            <textarea
                                className="modern-input modern-textarea"
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
                        <div className="modern-input-group">
                            <label className="modern-label" htmlFor="taskDeadline">Deadline</label>
                            <div className="modern-input-wrapper">
                                <Calendar size={18} />
                                <input
                                    className="modern-input"
                                    type="date"
                                    id="taskDeadline"
                                    required
                                    onChange={(e) => setDeadline(e.target.value)}
                                    value={deadline}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="modern-input-group">
                            <label className="modern-label" htmlFor="taskPriority">Priority</label>
                            <div className="modern-input-wrapper">
                                <Flag size={18} />
                                <select
                                    className="modern-input"
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

                    <div className="modern-input-group">
                        <label className="modern-label" htmlFor="taskDependencies">
                            Blocking Dependency (Optional)
                            {props.status?.toLowerCase() === "completed" && <span className="restriction-note" style={{ color: '#6366f1', marginLeft: '8px', fontSize: '0.85em' }}> (Locked - Task Completed)</span>}
                        </label>
                        <div className="modern-input-wrapper">
                            <Link size={18} />
                            <select
                                className="modern-input"
                                id="taskDependencies"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (!val) setDependency({ id: "", type: "" });
                                    else {
                                        const [type, id] = val.split(':');
                                        setDependency({ id, type });
                                    }
                                }}
                                value={dependency?.id ? `${dependency.type}:${dependency.id}` : ""}
                                disabled={loading || props.status?.toLowerCase() === "completed"}
                                style={props.status?.toLowerCase() === "completed" ? { opacity: 0.7, cursor: 'not-allowed', backgroundColor: '#f9fafb' } : {}}
                            >
                                <option value="">No Dependency</option>
                                {availableDependencies.map((dep, idx) => (
                                    <option key={idx} value={`${dep.type}:${dep.id}`}>
                                        [{dep.type}] {dep.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="modern-btn-secondary" onClick={closeForm} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="modern-btn-primary edit-theme" disabled={loading}>
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
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditForm;

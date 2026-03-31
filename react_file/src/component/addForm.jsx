import React, { useState, useCallback, useEffect } from "react";
import { X, Type, AlignLeft, Calendar, Flag, Link, Loader2, PlusCircle } from "lucide-react";
import '../styles/addPop.css';
import { fetchAPI } from "../api";

function AddForm(props) {
    const [taskName, setTaskName] = useState("");
    const [detail, setDetail] = useState("");
    const [priority, setPriority] = useState("");
    const [deadline, setDeadline] = useState("");
    const [dependency, setDependency] = useState({ id: "", type: "" });
    const [availableDependencies, setAvailableDependencies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const email = props.email;

    const closeForm = useCallback(() => {
        props.GetData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.GetData]);

    useEffect(() => {
        const fetchDeps = async () => {
            const [tasksRes, projectsRes] = await Promise.all([
                fetchAPI(`/get-task?email=${email}`),
                fetchAPI(`/get-projects?email=${email}`)
            ]);
            
            let deps = [];
            if (tasksRes.ok) {
                deps = [...deps, ...tasksRes.data.message
                    .filter(t => t.status !== "Completed")
                    .map(t => ({ id: t._id, name: t.taskName, type: 'Task' }))];
            }
            if (projectsRes.ok) {
                // For projects, we might need to check their calculated status or the 'status' field from DB
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
    }, [email, closeForm]);

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
            <div className="modern-form-container add-task-modal">
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
                    <div className="modern-input-group">
                        <label className="modern-label" htmlFor="taskName">Task Name</label>
                        <div className="modern-input-wrapper">
                            <Type size={18} />
                            <input
                                className="modern-input"
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

                    <div className="modern-input-group">
                        <label className="modern-label" htmlFor="taskDetail">Description</label>
                        <div className="modern-input-wrapper">
                            <AlignLeft size={18} style={{ top: '0.85rem' }} />
                            <textarea
                                className="modern-input modern-textarea"
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
                                    <option value="" disabled>Select</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="modern-input-group">
                        <label className="modern-label" htmlFor="taskDependencies">Blocking Dependency (Optional)</label>
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
                                value={dependency.id ? `${dependency.type}:${dependency.id}` : ""}
                                disabled={loading}
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
                        <button type="submit" className="modern-btn-primary" disabled={loading}>
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
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddForm;

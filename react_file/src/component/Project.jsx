import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Search,
  Calendar,
  Flag,
  Layout,
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  X,
  AlignLeft,
  Loader2,
  FolderPlus,
  Briefcase,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Link,
  Save
} from "lucide-react";
import { fetchAPI } from "../api";
import "../styles/ProjectPage.css";

const ProjectPage = ({ email }) => {
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    priority: 'medium',
    deadline: '',
    dependency: { id: "", type: "" },
    tasks: [] // Array of task IDs
  });
  const [editingProject, setEditingProject] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);

  const fetchProjects = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const result = await fetchAPI(`/get-projects?email=${email}`);
      if (result.ok) {
        setProjects(result.data.message || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setLoading(false);
  };

  const lazyFetchTasks = async () => {
    if (!email || allTasks.length > 0) return; // Only fetch once when needed
    setTasksLoading(true);
    try {
      const result = await fetchAPI(`/get-task?email=${email}`);
      if (result.ok) {
        setAllTasks(result.data.message || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setTasksLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [email]);

  useEffect(() => {
    if (showCreateForm) {
      lazyFetchTasks();
    }
  }, [showCreateForm]);

  const closeForm = useCallback(() => {
    setShowCreateForm(false);
    setEditingProject(null);
    setShowTaskSelector(false);
    setFormData({
      projectName: '',
      description: '',
      priority: 'medium',
      deadline: '',
      tasks: []
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeForm();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTaskSelection = (taskId) => {
    setFormData(prev => {
      const currentTasks = [...prev.tasks];
      const index = currentTasks.indexOf(taskId);
      if (index > -1) {
        currentTasks.splice(index, 1);
      } else {
        currentTasks.push(taskId);
      }
      return { ...prev, tasks: currentTasks };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const endpoint = editingProject ? "/update-project" : "/create-project";
      const body = {
          email,
          ...formData,
          projectId: editingProject?._id
      };

      const result = await fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (result.ok) {
        await fetchProjects();
        await lazyFetchTasks(); // Refresh tasks to update project associations
        closeForm();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
    setFormLoading(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      projectName: project.projectName,
      description: project.description || '',
      priority: project.priority,
      deadline: project.deadline || '',
      dependency: project.dependency || { id: "", type: "" },
      tasks: project.tasks ? project.tasks.map(t => t._id) : []
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const result = await fetchAPI("/delete-project", {
        method: 'DELETE',
        body: JSON.stringify({ projectId }),
      });

      if (result.ok) {
        await fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const getProjectStatus = (tasks) => {
    if (!tasks || tasks.length === 0) return 'Not Started';
    const completedCount = tasks.filter(t => t.status === 'Completed').length;
    if (completedCount === tasks.length) return 'Completed';
    if (completedCount > 0) return 'In Progress';
    return 'Not Started';
  };

  const toggleExpansion = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const priorityBadgeClass = (p) => `priority-badge priority-${p?.toLowerCase() || 'medium'}`;
  const statusBadgeClass = (s) => `status-badge status-${s?.toLowerCase().replace(' ', '-') || 'not-started'}`;

  return (
    <div className="project-overlay animate-fade-in">
      <div className="project-container">
        <div className="project-header">
          <div className="header-title-area">
            <h2 className="project-title">Project Workspace</h2>
            <p className="project-subtitle">Organize your tasks into high-level goals</p>
          </div>
          <button
            className="modern-btn-primary create-project-btn"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        </div>

        {showCreateForm && (
          <div className="project-form-modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeForm()}>
            <div className="modern-form-container project-form-modal">
              <div className="form-header-decoration project-theme"></div>
              <button className="close-btn" onClick={closeForm} title="Close">
                <X size={20} />
              </button>

              <div className="form-title-section">
                <div className="icon-badge project-theme">
                  {editingProject ? <Pencil size={24} /> : <FolderPlus size={24} />}
                </div>
                <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
                <p>{editingProject ? 'Make adjustments to your project' : 'Start a new organized workspace'}</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modern-input-group">
                  <label className="modern-label" htmlFor="projectName">Project Name</label>
                  <div className="modern-input-wrapper">
                    <Layout size={18} />
                    <input
                      className="modern-input"
                      type="text"
                      id="projectName"
                      name="projectName"
                      placeholder="e.g. Website Redesign"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="modern-input-group">
                  <label className="modern-label" htmlFor="description">Description</label>
                  <div className="modern-input-wrapper">
                    <AlignLeft size={18} style={{ top: '0.85rem' }} />
                    <textarea
                      className="modern-input modern-textarea"
                      id="description"
                      name="description"
                      placeholder="What is this project about?"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="2"
                    />
                  </div>
                </div>

                <div className="form-row-grid">
                  <div className="modern-input-group">
                    <label className="modern-label" htmlFor="priority">Priority</label>
                    <div className="modern-input-wrapper">
                      <Flag size={18} />
                      <select
                        className="modern-input"
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="modern-input-group">
                    <label className="modern-label" htmlFor="deadline">Deadline</label>
                    <div className="modern-input-wrapper">
                      <Calendar size={18} />
                      <input
                        className="modern-input"
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="modern-input-group">
                  <label className="modern-label" htmlFor="projectDependencies">
                      Blocking Dependency (Optional)
                      {editingProject && getProjectStatus(editingProject.tasks) === 'Completed' && (
                        <span className="restriction-note" style={{ color: '#6366f1', marginLeft: '8px', fontSize: '0.85em' }}> (Locked - Project Completed)</span>
                      )}
                    </label>
                    <div className="modern-input-wrapper">
                      <Link size={18} />
                      <select
                        className="modern-input"
                        id="projectDependencies"
                        style={editingProject && getProjectStatus(editingProject.tasks) === 'Completed' ? { opacity: 0.7, cursor: 'not-allowed', backgroundColor: '#f9fafb' } : {}}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) setFormData(prev => ({ ...prev, dependency: { id: "", type: "" } }));
                          else {
                            const [type, id] = val.split(':');
                            setFormData(prev => ({ ...prev, dependency: { id, type } }));
                          }
                        }}
                        value={formData.dependency?.id ? `${formData.dependency.type}:${formData.dependency.id}` : ""}
                        disabled={formLoading || (editingProject && getProjectStatus(editingProject.tasks) === 'Completed')}
                      >
                      <option value="">No Dependency</option>
                      {allTasks
                        .filter(t => t.status !== 'Completed')
                        .map(t => ({ id: t._id, name: t.taskName, type: 'Task' }))
                        .concat(projects
                          .filter(p => p.status !== 'Completed' && (!editingProject || p._id !== editingProject._id))
                          .map(p => ({ id: p._id, name: p.projectName, type: 'Project' }))
                        )
                        .map((dep, idx) => (
                          <option key={idx} value={`${dep.type}:${dep.id}`}>
                            [{dep.type}] {dep.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="task-selector-section">
                  <div className="selector-header" onClick={() => setShowTaskSelector(!showTaskSelector)}>
                    <div className="header-info">
                      <ListChecks size={18} />
                      <span>Linked Tasks ({formData.tasks.length})</span>
                    </div>
                    {showTaskSelector ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                  
                  {showTaskSelector && (
                    <div className="task-selection-list animate-slide-down">
                      {tasksLoading ? (
                        <div className="mini-loader">
                          <Loader2 size={16} className="animate-spin" />
                          <span>Loading tasks...</span>
                        </div>
                      ) : allTasks.length === 0 ? (
                        <p className="empty-tasks-txt">No tasks found. Create tasks first to link them.</p>
                      ) : (
                        allTasks.map(task => (
                          <div 
                            key={task._id} 
                            className={`task-select-item ${formData.tasks.includes(task._id) ? 'selected' : ''}`}
                            onClick={() => toggleTaskSelection(task._id)}
                          >
                            <div className="select-box">
                                {formData.tasks.includes(task._id) && <CheckCircle2 size={14} />}
                            </div>
                            <div className="task-item-info">
                                <span className="name">{task.taskName}</span>
                                <span className="status">{task.status}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="button" className="modern-btn-secondary" onClick={closeForm} disabled={formLoading}>
                    Cancel
                  </button>
                  <button type="submit" className="modern-btn-primary project-theme" disabled={formLoading}>
                    {formLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>{editingProject ? 'Save Changes' : 'Create Project'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="projects-grid">
          {loading && projects.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="project-card skeleton-card">
                <div className="skeleton-line" style={{ height: '200px', margin: '1rem' }}></div>
              </div>
            ))
          ) : projects.length === 0 ? (
            <div className="no-projects-view" style={{ gridColumn: '1/-1' }}>
              <div className="empty-state-illustration">📁</div>
              <h3>No active projects</h3>
              <p>Break down your major goals into trackable projects.</p>
              <button className="modern-btn-primary" onClick={() => setShowCreateForm(true)} style={{ width: 'auto', marginTop: '1.5rem' }}>
                <Plus size={18} /> New Project
              </button>
            </div>
          ) : (
            projects.map((project) => {
              const progress = Math.round((project.tasks?.filter(t => t.status === 'Completed').length / (project.tasks?.length || 1)) * 100) || 0;
              const status = getProjectStatus(project.tasks);
              return (
                  <div 
                    key={project._id} 
                    className={`modern-project-card ${progress === 100 ? 'fully-completed' : ''} ${expandedProject === project._id ? 'is-expanded' : ''}`}
                    onClick={() => toggleExpansion(project._id)}
                  >
                  <div className="project-card-header">
                    <div className="header-main">
                      <h3 className="project-name">{project.projectName}</h3>
                      <span className={priorityBadgeClass(project.priority)}>{project.priority}</span>
                    </div>
                    <div className="project-actions-dropdown">
                        <button className="icon-action-btn edit" onClick={(e) => { e.stopPropagation(); handleEdit(project); }} title="Edit">
                           <Pencil size={15} />
                        </button>
                        <button className="icon-action-btn delete" onClick={(e) => { e.stopPropagation(); handleDelete(project._id); }} title="Delete">
                           <Trash2 size={15} />
                        </button>
                    </div>
                  </div>

                  <div className="project-card-body">
                    {project.description && (
                      <p className="project-description">{project.description}</p>
                    )}

                    <div className="project-progress-area">
                        <div className="progress-info">
                            <span>Project Completion</span>
                            <span className="percentage">{progress}%</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <div className="project-details-grid">
                      {project.deadline && (
                        <div className="detail-pill">
                          <Clock size={12} />
                          <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="detail-pill">
                        <ListChecks size={12} />
                        <span>{project.tasks?.length || 0} Linked Tasks</span>
                      </div>
                    </div>
                  </div>

                  <div className="project-card-footer">
                      <div className={`project-status-pill ${status.toLowerCase().replace(' ', '-')}`}>
                         {status}
                      </div>
                      <div className="expansion-indicator">
                        {expandedProject === project._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                   </div>

                   {expandedProject === project._id && (
                     <div className="project-expanded-content animate-slide-down" onClick={(e) => e.stopPropagation()}>
                       <div className="expanded-divider"></div>
                       <h4 className="expanded-tasks-title">Assigned Tasks</h4>
                       <div className="project-tasks-list">
                         {project.tasks && project.tasks.length > 0 ? (
                           project.tasks.map(task => (
                             <div key={task._id} className={`project-task-item ${task.status.toLowerCase()}`}>
                               <div className="task-status-icon">
                                 {task.status === 'Completed' ? <CheckCircle2 size={14} className="completed-icon" /> : <Clock size={14} className="pending-icon" />}
                               </div>
                               <div className="task-main-info">
                                 <span className="task-name">{task.taskName}</span>
                                 {task.deadline && <span className="task-deadline">{task.deadline}</span>}
                               </div>
                               <span className={`task-status-tag ${task.status.toLowerCase()}`}>{task.status}</span>
                             </div>
                           ))
                         ) : (
                           <p className="no-tasks-text">No tasks linked to this project.</p>
                         )}
                       </div>
                     </div>
                   )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;

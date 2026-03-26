import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Calendar,
  Flag,
  Layout,
  MoreVertical,
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  AlignLeft,
  Loader2,
  FolderPlus,
  Briefcase
} from "lucide-react";
import { fetchAPI } from "../api";
import "../styles/ProjectPage.css";

const ProjectPage = ({ email }) => {
  const [projects, setProjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    priority: 'medium',
    deadline: ''
  });
  const [editingProject, setEditingProject] = useState(null);

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

  useEffect(() => {
    fetchProjects();
  }, [email]);

  const closeForm = useCallback(() => {
    setShowCreateForm(false);
    setEditingProject(null);
    setFormData({
      projectName: '',
      description: '',
      priority: 'medium',
      deadline: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const endpoint = editingProject ? "/update-project" : "/create-project";
      const body = editingProject
        ? { projectId: editingProject._id, ...formData }
        : { email, ...formData };

      const result = await fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (result.ok) {
        await fetchProjects();
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
      deadline: project.deadline || ''
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

  const priorityBadgeClass = (p) => `priority-badge priority-${p.toLowerCase()}`;
  const statusBadgeClass = (s) => `status-badge status-${s.toLowerCase().replace(' ', '-')}`;

  return (
    <div className="project-overlay animate-fade-in">
      <div className="project-container">
        <div className="project-header">
          <div className="header-title-area">
            <h2 className="project-title">My Projects</h2>
            <p className="project-subtitle">Manage and track your long-term goals</p>
          </div>
          <button
            className="premium-btn-primary create-project-btn"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        </div>

        {showCreateForm && (
          <div className="project-form-modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeForm()}>
            <div className="premium-form-container project-form-modal">
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
                <div className="premium-input-group">
                  <label className="premium-label" htmlFor="projectName">Project Name</label>
                  <div className="premium-input-wrapper">
                    <Layout size={18} />
                    <input
                      className="premium-input"
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

                <div className="premium-input-group">
                  <label className="premium-label" htmlFor="description">Description</label>
                  <div className="premium-input-wrapper">
                    <AlignLeft size={18} style={{ top: '0.85rem' }} />
                    <textarea
                      className="premium-input premium-textarea"
                      id="description"
                      name="description"
                      placeholder="What is this project about?"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-row-grid">
                  <div className="premium-input-group">
                    <label className="premium-label" htmlFor="priority">Priority</label>
                    <div className="premium-input-wrapper">
                      <Flag size={18} />
                      <select
                        className="premium-input"
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

                  <div className="premium-input-group">
                    <label className="premium-label" htmlFor="deadline">Deadline</label>
                    <div className="premium-input-wrapper">
                      <Calendar size={18} />
                      <input
                        className="premium-input"
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="premium-btn-primary project-theme" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Briefcase size={18} />
                      <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="projects-grid">
          {loading && projects.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="project-card skeleton-card">
                <div className="skeleton-line" style={{ height: '100px', margin: '1.5rem' }}></div>
              </div>
            ))
          ) : projects.length === 0 ? (
            <div className="no-projects-view" style={{ gridColumn: '1/-1' }}>
              <div className="empty-state-illustration">📁</div>
              <h3>No projects found</h3>
              <p>Create your first project to start organizing your work better.</p>
              <button className="premium-btn-primary" onClick={() => setShowCreateForm(true)} style={{ width: 'auto', marginTop: '1.5rem' }}>
                <Plus size={18} /> Create Project
              </button>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project._id} className={`premium-project-card ${project.status === 'Completed' ? 'completed' : ''}`}>
                <div className="project-card-highlight"></div>
                <div className="project-card-header">
                  <div className="header-main">
                    <h3 className="project-name">{project.projectName}</h3>
                  </div>
                  <div className="project-badges">
                    <span className={priorityBadgeClass(project.priority)}>
                      {project.priority}
                    </span>
                  </div>
                </div>

                <div className="project-card-body">
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}

                  <div className="project-details-grid">
                    {project.deadline && (
                      <div className="detail-pill">
                        <Clock size={12} />
                        <span>Ends: {new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="detail-pill">
                      <CheckCircle2 size={12} />
                      <span>Tasks: <strong>{project.tasks?.length || 0}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="project-card-footer">
                   <div className="status-indicator">
                      <span className={statusBadgeClass(project.status)}>
                        {project.status}
                      </span>
                   </div>
                  <div className="action-buttons">
                    <button className="icon-action-btn edit" onClick={() => handleEdit(project)} title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button className="icon-action-btn delete" onClick={() => handleDelete(project._id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;

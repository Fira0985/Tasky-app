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
  Loader2
} from "lucide-react";
import "../styles/ProjectPage.css";

const ProjectPage = ({ email }) => {
  const [projects, setProjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    priority: 'medium',
    deadline: ''
  });
  const [editingProject, setEditingProject] = useState(null);

  const api_url_vercel = process.env.REACT_APP_API_URL_vercel;

  const fetchProjects = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const base_url = api_url_vercel?.endsWith("/") ? api_url_vercel.slice(0, -1) : api_url_vercel;
      const response = await fetch(`${base_url}/get-projects?email=${email}`);
      const result = await response.json();
      if (response.ok) {
        setProjects(result.message || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [email, api_url_vercel]);

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
    setLoading(true); // Assuming 'setSubmitting' from diff is 'setLoading'

    try {
      const base_url = api_url_vercel?.endsWith("/") ? api_url_vercel.slice(0, -1) : api_url_vercel;
      const url = editingProject
        ? `${base_url}/update-project`
        : `${base_url}/create-project`;

      const body = editingProject
        ? { projectId: editingProject._id, ...formData }
        : { email, ...formData };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchProjects();
        closeForm();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
    setLoading(false);
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
      const base_url = api_url_vercel?.endsWith("/") ? api_url_vercel.slice(0, -1) : api_url_vercel;
      const response = await fetch(`${base_url}/delete-project`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      if (response.ok) {
        await fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const priorityBadgeClass = (p) => `priority-badge priority-${p.toLowerCase()}`;
  const statusBadgeClass = (s) => `status-badge status-${s.toLowerCase().replace(' ', '-')}`;

  return (
    <div className="project-overlay">
      <div className="project-container">
        <div className="project-header">
          <h2 className="project-title">My Projects</h2>
          <button
            className="create-project-btn"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        </div>

        {showCreateForm && (
          <div className="project-form-overlay" onClick={(e) => e.target === e.currentTarget && closeForm()}>
            <div className="project-form-container">
              <button className="close-btn" onClick={closeForm} title="Close">
                <X size={20} />
              </button>

              <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="projectName">Project Name</label>
                  <div className="input-wrapper">
                    <Layout size={18} />
                    <input
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

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <div className="input-wrapper">
                    <AlignLeft size={18} style={{ top: '0.85rem' }} />
                    <textarea
                      id="description"
                      name="description"
                      placeholder="What is this project about?"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <div className="input-wrapper">
                      <Flag size={18} />
                      <select
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

                  <div className="form-group">
                    <label htmlFor="deadline">Deadline</label>
                    <div className="input-wrapper">
                      <Calendar size={18} />
                      <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </span>
                  ) : (editingProject ? 'Update Project' : 'Create Project')}
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
            <div className="no-projects" style={{ gridColumn: '1/-1' }}>
              <div className="empty-state-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
              <h3>No projects found</h3>
              <p>Create your first project to start organizing your work better.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project._id} className={`project-card ${project.status === 'Completed' ? 'completed' : ''}`}>
                <div className="project-card-header">
                  <div className="header-main">
                    <h3 className="project-name">{project.projectName}</h3>
                  </div>
                  <div className="project-badges">
                    <span className={priorityBadgeClass(project.priority)}>
                      {project.priority}
                    </span>
                    <span className={statusBadgeClass(project.status)}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="project-card-body">
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}

                  <div className="project-details">
                    {project.deadline && (
                      <div className="detail-item">
                        <Clock size={14} />
                        <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <CheckCircle2 size={14} />
                      <span>Tasks: <strong>{project.tasks?.length || 0}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="project-card-actions">
                  <button className="edit-btn" onClick={() => handleEdit(project)}>
                    <Pencil size={14} style={{ marginRight: '6px' }} />
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(project._id)}>
                    <Trash2 size={14} style={{ marginRight: '6px' }} />
                    Delete
                  </button>
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

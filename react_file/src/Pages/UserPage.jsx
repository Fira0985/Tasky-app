import {
  CheckCircle,
  CircleOff,
  FileText,
  Folder,
  ListChecks,
  Plus,
  Search,
  LogOut,
  Settings,
  HelpCircle,
  Bell,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import image from '../asset/69KTbX-LogoMakr.png';
import ProfileImage from '../asset/profile.png';
import '../styles/UserPage.css';
import AddForm from '../component/addForm';
import Edit from "../component/editForm";
import Project from "../component/Project";
import Report from "../component/report";
import Task from "../component/task";
import ProfilePage from "../component/ProfilePage";
import Calendar from "../component/Calendar";
import SupportModal from "../component/SupportModal";
import { fetchAPI, API_BASE_URL } from "../api";

function User(props) {
  const navigate = useNavigate();
  console.log("Rendering UserPage for email:", props.email);
  const [isExpanded, setIsExpanded] = useState(true);
  const [overlayStyle, setOverStyle] = useState({ display: "none" })
  const [showForm, setShowForm] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [beforeEdit, setBeforeEdit] = useState([])

  const [currentView, setCurrentView] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = props.email
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState("")
  const [activities, setActivities] = useState([])
  const [dashboardStats, setDashboardStats] = useState({ pending: 0, completed: 0, overdue: 0 })
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterTime, setFilterTime] = useState('all')
  const [projects, setProjects] = useState([])

  const handleLogout = () => {
    if (props.onLogout) {
      props.onLogout();
    } else {
      navigate("/");
    }
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  }

  function GetFormData(check) {
    setShowForm(check)
    setShowEdit(check)
    setOverStyle({ display: "none" })
  }

  function ShowForm() {
    setOverStyle({ display: "block" })
    setShowForm(true)
  }

  async function updateTaskStatus(taskName, isCompleted) {
    const status = isCompleted ? "Completed" : "Not Completed";

    const result = await fetchAPI("/set-status", {
      method: "POST",
      body: JSON.stringify({ task_name: taskName, task_status: status })
    });

    if (result.ok) {
      setMessage(prevTasks =>
        prevTasks.map(task =>
          task.taskName === taskName ? { ...task, status } : task
        )
      );
    }

    return result.data;
  }

  useEffect(() => {
    async function fetchUserInfo() {
      if (!email) return;
      const result = await fetchAPI("/get-name", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

       if (result.ok) {
        setName(result.data.name);
        setAvatar(result.data.avatar || "");
      } else {
        console.error("Failed to fetch user info", result.message);
      }
    }
    fetchUserInfo();
  }, [email]);

  async function fetchUserInfo() {
    if (!email) return;
    const result = await fetchAPI("/get-name", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

     if (result.ok) {
      setName(result.data.name);
      setAvatar(result.data.avatar || "");
    } else {
      console.error("Failed to fetch user info", result.message);
    }
  }

  async function fetchTasks() {
    if (!email) return;
    setLoading(true);
    setError(null);

    const [taskRes, projectRes] = await Promise.all([
      fetchAPI(`/get-task?email=${email}`),
      fetchAPI(`/get-projects?email=${email}`)
    ]);

    if (taskRes.ok) {
      setMessage(taskRes.data.message || []);
    } else {
      setError(taskRes.message || "Failed to load tasks.");
    }

    if (projectRes.ok) {
      setProjects(projectRes.data.message || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchTasks();
  }, [email]);

  const refreshTasks = () => {
    fetchTasks();
  };

  const filteredTasks = useMemo(() => {
    if (!message.length) return [];
    let tasks = [...message];

    // Filter by view/status
    if (currentView === 'completed') tasks = tasks.filter(t => t.status === "Completed");
    if (currentView === 'incomplete') tasks = tasks.filter(t => t.status === "Not Completed");

    // Filter by priority
    if (filterPriority !== 'all') {
      tasks = tasks.filter(t => t.priority?.toLowerCase() === filterPriority);
    }

    // Filter by time
    if (filterTime === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() + 7);
      const today = new Date();
      tasks = tasks.filter(t => {
        if (!t.deadline) return false;
        const d = new Date(t.deadline);
        return d >= today && d <= weekAgo;
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      tasks = tasks.filter(t =>
        t.taskName.toLowerCase().includes(term) ||
        (t.detail && t.detail.toLowerCase().includes(term))
      );
    }

    return tasks;
  }, [message, currentView, searchTerm, filterPriority, filterTime]);

  async function fetchDashboardData() {
    if (!email) return;

    // Fetch Activities
    const actResult = await fetchAPI(`/get-activity?email=${email}`);
    if (actResult.ok) setActivities(actResult.data.message || []);

    // Fetch Stats
    const statsResult = await fetchAPI(`/dashboard-stats?email=${email}`);
    if (statsResult.ok) setDashboardStats(statsResult.data);
  }

  useEffect(() => {
    if (email) fetchDashboardData();
  }, [email, message]); // Refresh when tasks change

  const stats = useMemo(() => {
    const total = message.length;
    const completed = message.filter(t => t.status === "Completed").length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [message]);

  return (
    <div className="dashboard-container">
      <div id="overlay" style={overlayStyle}></div>

      {/* Modern Sidebar */}
      <aside className={`sidebar-modern ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="logo-box">
            <CheckCircle className="logo-icon" size={28} />
            {isExpanded && <span className="logo-text">Tasky</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => setCurrentView('all')} className={currentView === 'all' ? 'nav-item active' : 'nav-item'}>
            <ListChecks size={20} />
            {isExpanded && <span>Dashboard</span>}
          </button>
          <button onClick={() => setCurrentView('all-tasks')} className={currentView === 'all-tasks' ? 'nav-item active' : 'nav-item'}>
            <Folder size={20} />
            {isExpanded && <span>All Tasks</span>}
          </button>
          <button onClick={() => setCurrentView('projects')} className={currentView === 'projects' ? 'nav-item active' : 'nav-item'}>
            <Folder size={20} />
            {isExpanded && <span>Projects</span>}
          </button>
          <button onClick={() => setCurrentView('reports')} className={currentView === 'reports' ? 'nav-item active' : 'nav-item'}>
            <FileText size={20} />
            {isExpanded && <span>Reports</span>}
          </button>
          <button onClick={() => setCurrentView('calendar')} className={currentView === 'calendar' ? 'nav-item active' : 'nav-item'}>
            <CalendarIcon size={20} />
            {isExpanded && <span>Calendar</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => setCurrentView('profile')} className={currentView === 'profile' ? 'nav-item active' : 'nav-item'}>
            <Settings size={20} />
            {isExpanded && <span>Settings</span>}
          </button>
          <div className="user-profile-card" onClick={() => setCurrentView('profile')} style={{ cursor: 'pointer' }}>
            <div className="sidebar-avatar-wrapper">
                {avatar ? (
                    <img src={`${API_BASE_URL}${avatar}`} alt="User" className="sidebar-avatar" />
                ) : (
                    <img src={ProfileImage} alt="User" />
                )}
            </div>
            {isExpanded && (
              <div className="user-details">
                <span className="user-name">{name || 'User'}</span>
                <span className="user-role">Free Workspace</span>
              </div>
            )}
            <LogOut size={16} className="profile-settings" onClick={handleLogout} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <h1>{
              currentView === 'reports' ? 'Analytics' :
                currentView === 'projects' ? 'My Projects' :
                  currentView === 'profile' ? 'My Profile' :
                    currentView === 'calendar' ? 'Calendar' : 'Dashboard'
            }</h1>
            <p className="greeting">Welcome back, {name || 'User'}!</p>
          </div>
          <div className="header-right">
            <div className="search-box-modern">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-task-btn-modern" onClick={ShowForm}>
              <Plus size={18} />
              <span>Add New Task</span>
            </button>
          </div>
        </header>

        {(currentView === 'all' || currentView === 'all-tasks' || currentView === 'completed' || currentView === 'incomplete') ? (
          <>
            {/* Stats Section only on main views */}
            {(currentView === 'all' || currentView === 'all-tasks') && (
              <section className="dashboard-stats-grid">
                <div className="stat-card-modern">
                  <span className="stat-card-title">Pending Tasks</span>
                  <span className="stat-card-value">{dashboardStats.pending}</span>
                </div>
                <div className="stat-card-modern">
                  <span className="stat-card-title">Completed Tasks</span>
                  <span className="stat-card-value">{dashboardStats.completed}</span>
                </div>
                <div className="stat-card-modern">
                  <span className="stat-card-title">Overdue</span>
                  <span className="stat-card-value">{dashboardStats.overdue}</span>
                </div>
              </section>
            )}

            {/* Task Board */}
            <div className="board-header">
              <div className="board-title">
                <h3>{currentView === 'all' || currentView === 'all-tasks' ? 'My Tasks' :
                  currentView === 'completed' ? 'Completed' : 'Incomplete'}</h3>
              </div>
              <div className="board-filters">
                <span className="filter-label">Filter:</span>
                <select value={currentView} onChange={(e) => setCurrentView(e.target.value)} className="modern-select">
                  <option value="all">Dashboard</option>
                  <option value="all-tasks">All Tasks</option>
                  <option value="completed">Completed</option>
                  <option value="incomplete">Incomplete</option>
                </select>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="modern-select">
                  <option value="all">All Priority</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <select value={filterTime} onChange={(e) => setFilterTime(e.target.value)} className="modern-select">
                  <option value="all">All Time</option>
                  <option value="week">Due This Week</option>
                </select>
              </div>
            </div>

            <div className="tasks-grid">
              {loading ? (
                <div className="loading-state">Loading your tasks...</div>
              ) : filteredTasks.length === 0 ? (
                <div className="empty-state-modern">
                  <Plus size={48} />
                  <p>No tasks found. Start by creating one!</p>
                </div>
              ) : (
                filteredTasks.map((task, index) => (
                  <Task
                    key={task._id || index}
                    editEvent={(edit, n, d, p, dl, dp, s) => {
                      setOverStyle({ display: "block" });
                      setShowEdit(edit);
                      setBeforeEdit([n, d, p, dl, dp, s]);
                    }}
                    onRefresh={refreshTasks}
                    StatusData={updateTaskStatus}
                    TName={task.taskName}
                    detail={task.detail}
                    priority={task.priority}
                    status={task.status}
                    dependency={task.dependency}
                    deadline={task.deadline}
                    allTasks={message}
                    allProjects={projects}
                  />
                ))
              )}
            </div>
          </>
        ) : currentView === 'reports' ? (
          <Report tasks={message} />
        ) : currentView === 'projects' ? (
          <Project email={email} />
        ) : currentView === 'profile' ? (
          <ProfilePage email={email} onUpdate={fetchUserInfo} />
        ) : currentView === 'calendar' ? (
          <Calendar tasks={message} />
        ) : (
          <div className="empty-view">
            <HelpCircle size={48} />
            <p>Help & Privacy documentation coming soon!</p>
            <button className="support-trigger" onClick={() => setShowSupport(true)}>Contact Support</button>
          </div>
        )}

        {showForm && <AddForm email={email} GetData={GetFormData} onRefresh={refreshTasks} />}
        {showEdit && (
          <Edit
            name={beforeEdit[0]}
            detail={beforeEdit[1]}
            priority={beforeEdit[2]}
            deadline={beforeEdit[3]}
            dependency={beforeEdit[4]}
            status={beforeEdit[5]}
            GetData={GetFormData}
            onRefresh={refreshTasks}
          />
        )}
        {showSupport && (
          <div className="modal-overlay" onClick={() => setShowSupport(false)}>
            <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal-btn" onClick={() => setShowSupport(false)}>×</button>
              <SupportModal onClose={() => setShowSupport(false)} />
            </div>
          </div>
        )}
      </main>

      {/* Right Side Panel */}
      <aside className="right-panel">
        <div className="panel-section">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {activities.length === 0 ? (
              <p className="empty-panel-text">No recent activity</p>
            ) : (
              activities.slice(0, 6).map((act, i) => (
                <div key={i} className="activity-item">
                  <div className="user-avatar-small">
                    {avatar ? (
                      <img src={`${API_BASE_URL}${avatar}`} alt="User" className="sidebar-avatar" />
                    ) : (
                      <img src={ProfileImage} alt="User" />
                    )}
                  </div>
                  <div className="activity-info">
                    <p><strong>You</strong> {act.action.toLowerCase()}: {act.target}</p>
                    <span className="time">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel-section">
          <h3>Upcoming Deadlines</h3>
          <div className="deadline-list">
            {message.filter(t => t.status !== "Completed").slice(0, 3).map((task, i) => (
              <div key={i} className="deadline-item">
                <div className={`deadline-tag ${task.priority?.toLowerCase() || 'low'}`}></div>
                <div className="deadline-info">
                  <p>{task.taskName}</p>
                  <span>{task.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default User;

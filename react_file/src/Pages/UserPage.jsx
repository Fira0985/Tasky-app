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
import SupportModal from "../component/SupportModal";
import { fetchAPI } from "../api";

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

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/");
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
        setName(result.data.message);
      } else {
        console.error("Failed to fetch user info", result.message);
      }
    }
    fetchUserInfo();
  }, [email]);

  async function fetchTasks() {
    if (!email) return;
    setLoading(true);
    setError(null);

    const result = await fetchAPI(`/get-task?email=${email}`);

    if (result.ok) {
      setMessage(result.data.message || []);
    } else {
      setError(result.message || "Failed to load tasks. Please try again.");
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

    // Filter by view
    if (currentView === 'completed') tasks = tasks.filter(t => t.status === "Completed");
    if (currentView === 'incomplete') tasks = tasks.filter(t => t.status === "Not Completed");

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      tasks = tasks.filter(t =>
        t.taskName.toLowerCase().includes(term) ||
        (t.detail && t.detail.toLowerCase().includes(term))
      );
    }

    return tasks;
  }, [message, currentView, searchTerm]);

  const stats = useMemo(() => {
    const total = message.length;
    const completed = message.filter(t => t.status === "Completed").length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [message]);

  return (
    <div className="container">
      <div id="overlay" style={overlayStyle}></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="logo">
          <img src={image} alt="Tasky" />
        </div>

        <ul>
          <li>
            <button onClick={() => setCurrentView('all')} className={currentView === 'all' ? 'active' : ''}>
              <ListChecks size={20} />
              <span>All Tasks</span>
            </button>
          </li>
          <li>
            <button onClick={() => setCurrentView('completed')} className={currentView === 'completed' ? 'active' : ''}>
              <CheckCircle size={20} />
              <span>Completed</span>
            </button>
          </li>
          <li>
            <button onClick={() => setCurrentView('incomplete')} className={currentView === 'incomplete' ? 'active' : ''}>
              <CircleOff size={20} />
              <span>Incomplete</span>
            </button>
          </li>
          <li>
            <button onClick={() => setCurrentView('projects')} className={currentView === 'projects' ? 'active' : ''}>
              <Folder size={20} />
              <span>Projects</span>
            </button>
          </li>
          <li>
            <button onClick={() => setCurrentView('reports')} className={currentView === 'reports' ? 'active' : ''}>
              <FileText size={20} />
              <span>Reports</span>
            </button>
          </li>
          <li>
            <button onClick={() => setShowSupport(true)}>
              <HelpCircle size={20} />
              <span>Support</span>
            </button>
          </li>
        </ul>

        <button className="add-task-sidebar-btn" onClick={ShowForm}>
          <Plus size={20} />
          {isExpanded && <span>New Task</span>}
        </button>

        <div className="sidebar-account">
          <div className="account-profile" onClick={() => setCurrentView('profile')}>
            <img src={ProfileImage} alt="Profile" className="profile-img" />
            <div className="profile-info">
              <span className="username">{name || 'User'}</span>
              <span className="user-email">{email}</span>
            </div>
            <Settings size={18} className="settings-icon" />
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            {isExpanded && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <button className="toggle-btn" onClick={toggleSidebar}>
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Main Content */}
      <main className="dashboard">
        <header className="dashboard-header">
          <div className="header-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search tasks or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="header-actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="header-profile" onClick={() => setCurrentView('profile')}>
              <img src={ProfileImage} alt="User" />
            </div>
          </div>
        </header>

        {currentView === 'reports' ? (
          <Report tasks={message} />
        ) : currentView === 'projects' ? (
          <Project />
        ) : currentView === 'profile' ? (
          <ProfilePage email={email} />
        ) : (
          <section>
            <div className="view-header">
              <div className="view-title">
                <h2>
                  {currentView === 'all' ? 'All Tasks' :
                    currentView === 'completed' ? 'Completed Tasks' : 'Incomplete Tasks'}
                </h2>
                <div className="task-count">{filteredTasks.length} tasks</div>
              </div>

              <div className="stats-summary">
                <div className="stat-item">
                  <span className="stat-value">{stats.total}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value text-success">{stats.completed}</span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value text-warning">{stats.pending}</span>
                  <span className="stat-label">Pending</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
              </div>
            )}

            <div className="task-container">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="task-skeleton animate-pulse">
                    <div className="skeleton-header"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                ))
              ) : filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <p>
                    {currentView === 'completed' ? "No completed tasks yet!" :
                      currentView === 'incomplete' ? "No incomplete tasks!" :
                        "No tasks found. Create your first task!"}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task, index) => (
                  <Task
                    key={task._id || index}
                    editEvent={(edit, n, d, p, dl, dp) => {
                      setOverStyle({ display: "block" });
                      setShowEdit(edit);
                      setBeforeEdit([n, d, p, dl, dp]);
                    }}
                    onRefresh={refreshTasks}
                    StatusData={updateTaskStatus}
                    TName={task.taskName}
                    detail={task.detail}
                    priority={task.priority}
                    status={task.status}
                    dependency={task.dependency}
                    deadline={task.deadline}
                  />
                ))
              )}
            </div>
          </section>
        )}

        {showForm && <AddForm email={email} GetData={GetFormData} onRefresh={refreshTasks} />}
        {showEdit && (
          <Edit
            name={beforeEdit[0]}
            detail={beforeEdit[1]}
            priority={beforeEdit[2]}
            deadline={beforeEdit[3]}
            dependency={beforeEdit[4]}
            GetData={GetFormData}
            onRefresh={refreshTasks}
          />
        )}
        {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
      </main>
    </div>
  );
}

export default User;
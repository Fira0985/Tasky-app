import React, { useMemo } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Zap,
  Activity
} from "lucide-react";
import '../styles/report.css';

const ReportInterface = (props) => {
  const stats = useMemo(() => {
    const tasks = props.tasks || [];
    const completedTasks = tasks.filter((task) => task.status === "Completed").length;
    const incompleteTasks = tasks.length - completedTasks;
    const totalTasks = tasks.length;
    const completionPercentage = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    const priorityStats = tasks.reduce((acc, task) => {
      const p = task.priority?.toLowerCase() || 'medium';
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, { high: 0, medium: 0, low: 0 });

    const recentTasks = tasks.slice(-3).reverse();

    return {
      totalTasks,
      completedTasks,
      incompleteTasks,
      completionPercentage,
      priorityStats,
      recentTasks
    };
  }, [props.tasks]);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--secondary-400)';
    }
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Analytics Dashboard</h2>
        <p className="subtitle">Real-time overview of your productivity and task distribution</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon"><BarChart3 size={24} /></div>
          <div className="stat-content">
            <h3>{stats.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon"><CheckCircle2 size={24} /></div>
          <div className="stat-content">
            <h3>{stats.completedTasks}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card incomplete">
          <div className="stat-icon"><Clock size={24} /></div>
          <div className="stat-content">
            <h3>{stats.incompleteTasks}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card percentage">
          <div className="stat-icon"><TrendingUp size={24} /></div>
          <div className="stat-content">
            <h3>{stats.completionPercentage}%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </div>

      <div className="report-grid">
        <div className="chart-section">
          <h3>Priority Distribution</h3>
          <div className="priority-chart">
            {Object.entries(stats.priorityStats).map(([priority, count]) => (
              <div key={priority} className="priority-bar">
                <div className="priority-label">
                  <span>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                  <span>{count} Tasks</span>
                </div>
                <div className="priority-progress">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0}%`,
                      backgroundColor: getPriorityColor(priority)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-tasks-section">
          <h3>Recent Activity</h3>
          <div className="recent-tasks-list">
            {stats.recentTasks.length > 0 ? (
              stats.recentTasks.map((task, index) => (
                <div key={task._id || index} className="recent-task-item">
                  <div className="task-info">
                    <h4>{task.taskName}</h4>
                    <p>{task.detail?.substring(0, 40)}...</p>
                  </div>
                  <div className={`status-tag ${task.status === 'Completed' ? 'completed' : 'pending'}`}>
                    <Activity size={12} />
                    {task.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-tasks">
                <p>No recent activity recorded.</p>
              </div>
            )}
          </div>
        </div>

        <div className="insights-section">
          <h3>Smart Insights</h3>
          <div className="insights-list">
            {stats.completionPercentage < 50 && stats.totalTasks > 0 && (
              <div className="insight-item warning">
                <AlertTriangle size={20} />
                <p>Output Alert: Your completion rate is currently low. Focus on high-priority tasks to regain momentum.</p>
              </div>
            )}

            {stats.completedTasks > stats.incompleteTasks && (
              <div className="insight-item success">
                <CheckCircle size={20} />
                <p>Peak Performance: You're crushing it! Most of your tasks are completed. Keep this pace up.</p>
              </div>
            )}

            <div className="insight-item tip">
              <Zap size={20} />
              <p>Pro Tip: Break down complex "High Priority" tasks into smaller sub-tasks for faster completion.</p>
            </div>

            <div className="insight-item info">
              <Lightbulb size={20} />
              <p>Productivity Insight: You are most active in the {Object.keys(stats.priorityStats).reduce((a, b) => stats.priorityStats[a] > stats.priorityStats[b] ? a : b)} priority segment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportInterface;

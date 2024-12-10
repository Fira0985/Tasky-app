import React from "react";
import '../styles/report.css';

const ReportInterface = (props) => {
  // Calculate the number of completed and incomplete tasks
  const completedTasks = props.tasks.filter((task) => task.status === "Completed").length;
  const incompleteTasks = props.tasks.length - completedTasks;
  const totalTasks = props.tasks.length;

  // Calculate the percentage of completed tasks
  const completionPercentage = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

  return (
    <div className="overlay">
      <div className="report-container">
        <h2 className="title">Task Report</h2>
        <ul className="report-list">
          <li className="report-item">
            <strong>Total Tasks:</strong> {totalTasks}
          </li>
          <li className="report-item">
            <strong>Completed Tasks:</strong> {completedTasks}
          </li>
          <li className="report-item">
            <strong>Incomplete Tasks:</strong> {incompleteTasks}
          </li>
          <li className="report-item">
            <strong>Completion Percentage:</strong> {completionPercentage}%
          </li>
        </ul>
        <p className="coming-soon">More features coming soon...</p>
      </div>
    </div>
  );
};

export default ReportInterface;

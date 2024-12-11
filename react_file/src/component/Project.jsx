import React from "react";
import "../styles/ProjectPage.css";

const ProjectPage = () => {
  return (
    <div className="project-overlay">
      <div className="project-container">
        <h2 className="project-title">Project Management</h2>
        <p className="project-description">
          This feature is under development! Soon, you'll be able to cluster tasks and create projects with ease.
        </p>
        <div className="coming-soon">
          <p>More features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;

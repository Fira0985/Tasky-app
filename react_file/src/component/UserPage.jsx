import React, { useEffect, useState } from "react";
import image from '../asset/69KTbX-LogoMakr.png';
import ProfileImage from '../asset/profile.png';
import '../styles/UserPage.css';
import Add from './addPop';
import Edit from "./editForm";
import Project from "./Project";
import Report from "./report";
import Task from "./task";

function User(props){

    const [isExpanded, setIsExpanded] = useState(true); // decide if the sidebar is expanded or not
    const [toggleStyle, setToggleStyle] = useState({left: 10})
    const [overlayStyle, setOverStyle] = useState({display: "none"}) // decide visibility of overlay
    const [showForm, setShowForm] = useState(false) // decide visibility of Add form
    const [showEdit, setShowEdit] = useState(false) // decide visibility of edit form
    const [beforeEdit, setBeforeEdit] = useState([])  // Array holding task name,detail,priority,deadline and dependency of the target task to be edited

    const [completedTap, setCompletedTap] = useState(false) // Boolean that tells us if completed link is clicked or not
    const [IncompletedTap, setInCompletedTap] = useState(false) // Boolean that tells us if Incompleted link is clicked or not
    const [reportTap, setReportTap] = useState(false) // Boolean that tells us if report link is clicked or not
    const [projectTap, setProjectTap] = useState(false) // Boolean that tells us if project link is clicked or not
    const [message, setMessage] = useState([])  // Used to hold the request message
    const [filteredTasks, setFilteredTasks] = useState([]); // Filtered tasks
    const email = props.email // Email of the current user
    const [name, setName] = useState("")  // used to holds the name of the current user


    // Function to toggle the sidebar's state
    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    }

    // Function used to get data from child component
    function GetFormData(check){
        setShowForm(check)
        setShowEdit(check)
        setOverStyle({display: "none"})
    }

    function ShowForm(){
        setOverStyle({display: "block"})
        setShowForm(true)
    }

    async function GetStatus(TaskName, status) {
      var data = ""

      if (status){
        data = "Completed"
      } else {
        data = "Not Completed"
      }
      const url = "http://localhost:3002/set-status"
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({task_name: TaskName, task_status:data})
      }

      try {
        const response = await fetch(url,option)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json()
      } catch (error) {
        return { message: error};
      }
    }

    async function GetUserInfo(email) {

      const url = "http://localhost:3002/get-name";
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      };
    
      try {
        const response = await fetch(url, option);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        return { message: "Failed to retrieve user information" };
      }
    }
    

    useEffect(() => {
      async function fetchUserInfo() {
        const result = await GetUserInfo(email);
        setName(result.message);
      }
      fetchUserInfo();
    });

    async function GetTask() {

        const url = "http://localhost:3002/get-task?email=" + email
        const option = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
  
        try{
            const response = await fetch(url, option)
            return await response.json();

        } catch(error){
            const response = await fetch(url, option)
            console.error("There was an error during the request:", error.message);
            return await response.json();
        }
    }

    useEffect(() => {
      async function fetchTask() {
        const result = await GetTask();
        setMessage(result.message);
        setFilteredTasks(result.message); // Initialize with all tasks
      }

      // Filter completed tasks
      async function GetCompleted(message) {
        const result = await GetTask();
        setMessage(result.message);
        const completedTasks = message.filter((task) => task.status === "Completed");
        setFilteredTasks(completedTasks);
      }

      // Filter completed tasks
      async function GetInCompleted(message) {
        const result = await GetTask();
        setMessage(result.message);
        const IncompletedTasks = message.filter((task) => task.status === "Not Completed");
        setFilteredTasks(IncompletedTasks);
      }


      if (completedTap == false){
        if (IncompletedTap == false){
          fetchTask();
        } else{
          GetInCompleted(message)
        }
      } else {
        GetCompleted(message);
      }
    });

    function ChangeTap(event){
      // Get the element that triggered the event
      const clickedElement = event.target;

      if (clickedElement.textContent == "All Tasks"){
        setCompletedTap(false)
        setInCompletedTap(false)
        setReportTap(false)
        setProjectTap(false)
      } else if (clickedElement.textContent == "Completed Tasks"){
        setCompletedTap(true)
        setInCompletedTap(false)
        setReportTap(false)
        setProjectTap(false)
      } else if(clickedElement.textContent == "Incomplete Tasks") {
        setCompletedTap(false)
        setInCompletedTap(true)
        setReportTap(false)
        setProjectTap(false)
      } else if (clickedElement.textContent == "Reports"){
        setReportTap(true)
        setProjectTap(false)
      } else {
        setProjectTap(true)
        setReportTap(false)
      }
    }

    function GetEvent(edit,name,detail,priority,deadline,dependency){
      setOverStyle({display: "block"})
      setShowEdit(edit)
      setBeforeEdit([name,detail,priority,deadline,dependency])
    }

    return(
    <div className="container">
    <div id="overlay" style={overlayStyle}></div>
    {/* <!-- Navigation Bar --> */}
    <header class="navbar">
        <div className="logo"><img src={image} alt="company-log" /></div>
        <div className="navbar-links">
        <a href="#" className="project-link" onClick={ChangeTap}>Projects</a>
        <a href="#" className="report-link" onClick={ChangeTap}>Reports</a>
        <a href="#" className="contact-link">Contact Us</a>
        </div>
        <div className="profile">
            <img src={ProfileImage} alt="Profile" class="profile-img"/>
            <span className="username">{name}</span>
        </div>
    </header>

    {/* <!-- Sidebar --> */}
    <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {isExpanded?(
        <div>
        <ul>
            <li><a href="#" onClick={ChangeTap} className={`All ${(!completedTap&& !IncompletedTap) ? 'active' : 'inactive'}`}>All Tasks</a></li>
            <li><a href="#" onClick={ChangeTap} className={`completed ${completedTap ? 'active' : 'inactive'}`}>Completed Tasks</a></li>
            <li><a href="#" onClick={ChangeTap}className={`incompleted ${IncompletedTap ? 'active' : 'inactive'}`}>Incomplete Tasks</a></li>
        </ul>
        <div className="add-task-btn" onClick={ShowForm}>+</div>
        <h3>Add Task</h3>
        </div>):(
        <div></div>)}
    </aside>

    {/* Changing the icon */}
    {isExpanded?( <button className="toggle-btn" onClick={toggleSidebar}>
        {isExpanded ? '<' : '>'}
    </button>):( <button className="toggle-btn" onClick={toggleSidebar} style={toggleStyle}>
        {isExpanded ? '<' : '>'}
    </button>)}

    {/* <!-- Dashboard Section --> */}
    {isExpanded?(reportTap? (<Report tasks = {message} />):( projectTap? (<Project />): <main className="dashboard">
        <h2>Dashboard</h2>
        <div className="task-container">
        {filteredTasks.map((task, index) => (
      <Task
        editEvent = {GetEvent}
        key={index}
        StatusData={GetStatus}
        TName={task.taskName}
        detail={task.detail}
        priority={task.priority}
        status={task.status}
        dependency={task.dependency}
        deadline={task.deadline}
      />
    ))}
        </div>

        {showForm?(<Add email = {email} GetData = {GetFormData} />):(<dvi></dvi>)}
        {showEdit?(<Edit name = {beforeEdit[0]} detail = {beforeEdit[1]} priority = {beforeEdit[2]} deadline={beforeEdit[3]} dependency={beforeEdit[4]} GetData = {GetFormData} />):(<div></div>)}
    </main>) ):(reportTap? (<Report tasks = {message} />):(projectTap? (<Project />):<main className="dashboard-shrink">
        <h2>Dashboard</h2>
        <div className="task-container">
        {filteredTasks.map((task, index) => (
      <Task
        key={index}
        editEvent = {GetEvent}
        StatusData={GetStatus}
        TName={task.taskName}
        detail={task.detail}
        priority={task.priority}
        status={task.status}
        dependency={task.dependency}
        deadline={task.deadline}
      />
    ))}
        </div>

        {showForm?(<Add email = {email} GetData = {GetFormData} />):(<dvi></dvi>)}
        {showEdit?(<Edit name = {beforeEdit[0]} detail = {beforeEdit[1]} priority = {beforeEdit[2]} deadline={beforeEdit[3]} dependency={beforeEdit[4]} GetData = {GetFormData} />):(<div></div>)}
    </main>) )}
</div>

    )
}

export default User
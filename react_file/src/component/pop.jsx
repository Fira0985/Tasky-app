import React, { useState } from "react";
import '../styles/pop.css';

function Pop(props){

    const [name,setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [success, setSuccess] = useState(false)
    const color = {color: "red"}
    const [message, setMessage] = useState("This email already exists")
    const api_url = process.env.REACT_APP_API_URL
    const api_url_vercel = process.env.REACT_APP_API_URL_vercel

    const data = {
    name,
    email,
    password
    }

    function GetMessage(data){
        props.GetMessage(data)
    }

    function nameValue(event){
        setName(event.target.value)
    }

    function passwordValue(event){
        setPassword(event.target.value)
    }

    function emailValue(event){
        setEmail(event.target.value)
    }
  
    async function registerRequest(event) {
        setSuccess(true)
        event.preventDefault()
        const url = api_url + "signup"
        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
  
        try{
            const response = await fetch(url, option)
            const result = await response.json();
            if (result.message == "User registered successfully"){
                setMessage(result.message)
            } else {
                setMessage(result.message)
            }

            GetMessage(success)
        } catch(error){
            const response = await fetch(url, option)
            const result = await response.json();
            console.error("There was an error during the request:", error.message);
        }
    }

    return(
        <div id="register-box" style={props.style} >
        <h2>Register</h2>
        <form action="#" onSubmit={registerRequest}>
            <div className="textbox">
                <input type="text" placeholder="Full Name" required onChange={nameValue}/>
            </div>
            <div className="textbox">
                <input type="email" placeholder="Email" required onChange={emailValue}/>
            </div>
            <div className="textbox">
                <input type="password" placeholder="Password" required onChange={passwordValue}/>
            </div>
            {success?(<div className="message">
                <label htmlFor="message" style={color}>{message}</label>
            </div>):(<div className="message">
                <label htmlFor="message" style={color}></label>
            </div>)}
            <button type="submit" className="btn">Register</button>
        </form>
        </div>
    )
}

export default Pop
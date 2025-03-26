import dotenv from "dotenv";
import React, { useState } from "react";
import '../styles/loginPop.css';

dotenv.config()

function LoginPop(props){

    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [success, setSuccess] = useState(false)
    const color = {color: "red"}

    function GetData(data){  // sending the status and the email to parent component
        props.SendDataToParent(data)
        console.log(email)
        props.getEmail(email)
    }

    // The data that gone be send to the server
    const data = {
    email,
    password
    }

    // Function that update the password value entered by the user
    function passwordValue(event){
        setPassword(event.target.value)
    }

    // Function that update the email value entered by the user
    function emailValue(event){
        setEmail(event.target.value)
    }


    // The function that make the request
    async function loginRequest(event) {
        event.preventDefault()
        const url = "login"
        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
  
        try{
            const response = await fetch(url, option)
            const answer = await response.json();
            GetData(answer)

            console.log(answer.message)
            if (answer.message == "User loged in successfully"){
                setSuccess(true)
            } else {
                setSuccess(false)
            }

            props.GetMessage(success)

        } catch(error){
            console.error("Internal error " + error)
        }
    }

    return(
        <div id="login-box" className="login-box" style={props.style}>
            <h2>Login</h2>
            <form action="#" onSubmit={loginRequest}>
                <div className="textbox">
                    <input type="email" placeholder="Email" required onChange={emailValue}/>
                </div>
                <div className="textbox">
                    <input type="password" placeholder="Password" required onChange={passwordValue} />
                </div>
                <div className={`message ${success ? 'hidden' : 'show'}`}>
                    <label htmlFor="message" style={color}>Incorrect Password or email</label>
                </div>
                <button type="submit" className="login-btn">Login</button>
            </form>
        </div>
    )
}

export default LoginPop
import React from "react";
import "../Dustin.css";
import "../Responsive_CSS/SignUpPageR.css";
import { Link } from "react-router-dom";
import DreamWorkLogo from "../assets/DreamWorkLogo.png";

export default class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: "",
      error: false,
    };
  }

  // When user submits information sends fetch call with information
  submitHandler = (event) => {
    event.preventDefault();
    fetch("https://webdev.cse.buffalo.edu/hci/api/api/fabuloso/auth/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        attributes: {
          username: this.state.username,
        }
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        //Sends userID then return them back to login page
        if (result.userID) {
          this.setState({
            error: false,
          });
          window.location.assign("https://webdev.cse.buffalo.edu/hci/teams/fabuloso");
        }
        //Puts up error mess on field that is incorrect
        else {
          this.setState({
            error: true,
          });
        }
      });
  };

  //Sets the state email to the email the user inputed in email field
  setEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  setUsername = (event) => {
    this.setState({
      username: event.target.value,
    });
  };

  //Sets the state password to the password the user inputed in password field
  setPassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };
  render() {
    return (
      <div className="LoginDiv">
        <div className="leftleft">
          <h5 className="Description">
            Sign up to find team members <br></br>that are compatible best match
            with you.
          </h5>
          <p className="textforDescription">
            Find your ideal projects
            <br></br>Give or receive feedback to your teammates<br></br>

          </p>
          <br></br>
          <br></br>
          <img src={DreamWorkLogo} className="ourLogo"></img>
        </div>
        <div className="rightright"></div>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>{" "}
        <div className="h1">
          <form className="LoginForm" onSubmit={this.submitHandler}>
            <div className="welcome">Welcome!</div>
            <div className="login" alt="Sign Up Page">Sign Up</div>
            <br />


            <div class="input-icons">
              <label>
                Username
                <br />
                <i class="fa fa-user-o icon"></i>
                <input
                  className="LoginInput"
                  id="lock"
                  type="text"
                  placeholder="Enter your username"
                  onChange={this.setUsername}
                />
              </label>
              <label>
                Email
                <br />
                <i class="fa fa-envelope icon"></i>
                <input
                  alt="Email Input"
                  class="input-field"
                  className="LoginInput"
                  type="text"
                  placeholder="e.g example@gmail.com"
                  onChange={this.setEmail}
                />
              </label>
              {this.state.error ? (
                <p class="error-message">
                  <br />
                  Email invaild example example@gmail.com
                </p>
              ) : (
                <p class="error-message" style={{ display: "none" }}>
                  <br />
                  invalid email
                </p>
              )}
              <br />
              <label>
                Password
                <br />
                <i class="fa fa-lock icon"></i>
                <input
                  alt="Password Input"
                  className="LoginInput"
                  id="lock"
                  type="password"
                  placeholder="Enter your password"
                  onChange={this.setPassword}
                />
              </label>
            </div>
            <br />
            <input className="LoginButton" type="submit" value="Sign Up" alt="Submit" />
            <span>
              <p>
                Already a member?
                <Link to="/">
                  <a alt="Already a member" href="" style={{ marginLeft: 5 }}>
                    Sign In
                  </a>{" "}
                </Link>
              </p>
            </span>
          </form>
        </div>
      </div>
    );
  }
}

// import React from "react";
import "../pika.css";
import { Link } from "react-router-dom";
import React, { memo } from "react";
import backIcon from "../assets/BackArrow.png"

export default class ForgetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: false,
    };
  }

  // When user submits information sends fetch call with information
  submitHandler = (event) => {
    event.preventDefault();

    fetch(
      "https://webdev.cse.buffalo.edu/hci/api/api/fabuloso/auth/request-reset",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.state.email,
          // password: this.state.password,
        }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        //Sends userID then return them back to login page
        if (result.userID) {
          this.setState({
            error: false,
          });
          window.location.href = "https://webdev.cse.buffalo.edu/hci/teams/fabuloso/resetpassword";
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

  //Sets the state password to the password the user inputed in password field
  setPassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  render() {
    return (
      <div className="LoginDiv">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>{" "}
        <div className="h1">
          <form className="LoginForm" onSubmit={this.submitHandler}>
            <Link to="/">
              <img src={backIcon} className="backArrow" />
            </Link>
            <div className="login">Forget Password</div>
            <br />
            <div class="input-icons">
              <label>
                Email
                <br />
                <i class="fa fa-envelope icon"></i>
                <input
                  class="input-field"
                  className="LoginInput"
                  type="text"
                  placeholder="e.g example@gmail.com"
                  onChange={this.setEmail}
                />
              </label>
              {this.state.error ? (
                <h5 class="error-message">
                  <br />
                  *invalid email
                </h5>
              ) : (
                <h5 class="error-message" style={{ display: "none" }}>
                  <br />
                  invalid email
                </h5>
              )}

              <br />
            </div>
            <br />
            <p>
              Enter your email, we will send a code to your email for reset
              password
            </p>
            <div>
              {/* <Link to="/resetpassword" onSubmit={this.submitHandler}> */}
              <input
                className="LoginButton"
                type="submit"
                value="Send The Code"
              ></input>
              {/* </Link> */}
              <Link to="/resetpassword" onSubmit={this.submitHandler}>
                <input
                  className="CodeButton"
                  type="submit"
                  value="I received the Code"
                ></input>
              </Link>
            </div>
            <span></span>
          </form>
        </div>
      </div>
    );
  }
}

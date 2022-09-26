// import React from "react";
import "../pika.css";
import { Link } from "react-router-dom";
import React, { memo } from "react";

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
    };
  }

  changeHandler = (event) => {
    this.setState({
      token: event.target.value,
    });
  };

  passwordChangeHandler = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  confirmPasswordChangeHandler = (event) => {
    this.setState({
      confirmPassword: event.target.value,
    });
  };

  // When user submits information sends fetch call with information
  submitHandler = (event) => {
    event.preventDefault();

    if (this.state.password !== this.state.confirmPassword) {
      alert("Reenter password does not match new password");
      // console.log(this.state.password);
      // console.log(this.state.confirmPassword);
    } else {
      alert("You successfully change your password");
      fetch(
        "https://webdev.cse.buffalo.edu/hci/api/api/fabuloso/auth/reset-password",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: this.state.token,
            password: this.state.password,
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
            window.location.href = "https://webdev.cse.buffalo.edu/hci/teams/fabuloso";
          }
          //Puts up error mess on field that is incorrect
          else {
            this.setState({
              error: true,
            });
          }
        });
    }
  };

  // //Sets the state email to the email the user inputed in email field
  // setEmail = (event) => {
  //   this.setState({
  //     email: event.target.value,
  //   });
  // };

  // //Sets the state password to the password the user inputed in password field
  // setPassword = (event) => {
  //   this.setState({
  //     password: event.target.value,
  //   });
  // };

  render() {
    return (
      <div className="LoginDiv">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>{" "}
        <div className="h1">
          <form className="LoginForm" onSubmit={this.submitHandler}>
            <div className="welcome">ForgetPassword</div>
            <div className="login">Reset Password</div>
            <br />

            <div class="input-icons">
              <label>
                Enter Code
                <br />
                <i class="fa fa-barcode icon"></i>
                <input
                  class="input-field"
                  className="LoginInput"
                  type="text"
                  placeholder="Enter token in Email"
                  onChange={this.changeHandler}
                />
              </label>
              <br />
              <label>
                Password
                <br />
                <i class="fa fa-lock icon"></i>
                <input
                  className="LoginInput"
                  id="lock"
                  type="password"
                  placeholder="Enter your password"
                  onChange={this.passwordChangeHandler}
                />
              </label>
              <label>
                Reenter Password
                <br />
                <i class="fa fa-lock icon"></i>
                <input
                  className="LoginInput"
                  id="lock"
                  type="password"
                  placeholder="Reenter your password"
                  onChange={this.confirmPasswordChangeHandler}
                />
              </label>
            </div>
            <br />
            <input
              className="LoginButton"
              type="submit"
              value="ResetPassword"
            />
            <span>
              <p>
                Sign In
                <Link to="/">
                  <a href="#" style={{ marginLeft: 5 }}>
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

import React from "react";
import { Link } from "react-router-dom";
// import "./login.scss";
import "../pika.css";

// the login form will display if there is no session token stored.  This will display
// the login form, and call the API to authenticate the user and store the token in
// the session.

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      alanmessage: "",
      sessiontoken: "",
      invalidPassword: false,
      invaildUsername: false,
    };
    this.refreshPostsFromLogin = this.refreshPostsFromLogin.bind(this);
  }

  // once a user has successfully logged in, we want to refresh the post
  // listing that is displayed.  To do that, we'll call the callback passed in
  // from the parent.
  refreshPostsFromLogin() {
    console.log("CALLING LOGIN IN LOGINFORM");
    this.props.login();
  }

  // change handlers keep the state current with the values as you type them, so
  // the submit handler can read from the state to hit the API layer
  myChangeHandler = (event) => {
    this.setState({
      username: event.target.value,
    });
  };

  passwordChangeHandler = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  // when the user hits submit, process the login through the API
  submitHandler = (event) => {
    //keep the form from actually submitting
    event.preventDefault();

    //make the api call to the authentication page
    fetch(process.env.REACT_APP_API_PATH + "/auth/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.username,
        password: this.state.password,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("Testing");
          console.log(result)
          if (result.userID) {
            // set the auth token and user ID in the session state
            sessionStorage.setItem("token", result.token);
            sessionStorage.setItem("user", result.userID);
            sessionStorage.setItem("password", this.state.password)

            this.setState({
              sessiontoken: result.token,
              alanmessage: result.token,
            });

            // call refresh on the posting list
            this.refreshPostsFromLogin();
          } else {
            // if the login failed, remove any infomation from the session state
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            this.setState({
              sessiontoken: "",
              alanmessage: result.message,
              invaildUsername: true,
            });
          }
        },
        (error) => {
          this.setState({
            invalidPassword: true,
          })
        }
      );
  };

  showInvaildPassword(passwordState) {
    if (passwordState) {
      return (
        <span className="error-message">Password does not match password associated to that account</span>
      )
    }
    else {
      return
    }
  }

  showInvaildUsername(usernameState) {
    if (usernameState) {
      return (
        <span className="error-message">No users found with that email</span>
      )
    }
  }

  render() {
    // console.log("Rendering login, token is " + sessionStorage.getItem("token"));

    if (!sessionStorage.getItem("token")) {
      return (
        <div className="LoginDiv">
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          ></link>{" "}
          <div className="h1">
            <form className="LoginForm" onSubmit={this.submitHandler}>
              <div
                className="
              welcome"
              >
                Welcome!
              </div>
              <div className="login" alt="Login In Page">Login</div>
              <br />

              <div class="input-icons">
                <label>
                  Email
                  <br />
                  <i class="fa fa-envelope icon"></i>
                  <input
                    // class="input-field"
                    alt="Email Input"
                    className="LoginInput"
                    type="text"
                    placeholder="e.g example@gmail.com"
                    onChange={this.myChangeHandler}
                  />
                </label>
                {this.showInvaildUsername(this.state.invaildUsername)}
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
                    onChange={this.passwordChangeHandler}
                  />
                </label>
                {this.showInvaildPassword(this.state.invalidPassword)}
              </div>
              <br />
              <input className="LoginButton" type="submit" value="Login" alt="Submit" />
              <p>{this.state.alanmessage}</p>
              <span>
                <p>
                  Don't have an account?  <Link to="/register"><a href="">Sign Up</a></Link>
                </p>
              </span>
              <span>
                <p>
                  Do not remember your password?
                  <Link to="/forgetpassword">
                    <a href="#" alt="Forgot Password">Forget Password</a>{" "}
                  </Link>
                </p>
              </span>
            </form>
          </div>
        </div >
      );
    } else {
      console.log("Returning welcome message");
      if (this.state.username) {
        return <p>Welcome, {this.state.username}</p>;
      } else {
        return <p>{this.state.alanmessage}</p>;
      }
    }
  }
}

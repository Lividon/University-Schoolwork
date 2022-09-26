import React from "react";
import "../pika.css";
import "../App.css";
import "../Dustin.css";

// The Profile component shows data from the user table.  This is set up fairly generically to allow for you to customize
// user data by adding it to the attributes for each user, which is just a set of name value pairs that you can add things to
// in order to support your group specific functionality.  In this example, we store basic profile information for the user

export default class Profile extends React.Component {

  // The constructor will hold the default values for the state.  This is also where any props that are passed
  // in when the component is instantiated will be read and managed.  
  constructor(props) {
    super(props);
    this.state = {
      deleteFormShow: false,
      deleteButton: "Delete Account",
      password: "",
      re_password: "",
      responseMsg: false,
      feedback: "",
      // NOTE : if you wanted to add another user attribute to the profile, you would add a corresponding state element here
    };
    this.fieldChangeHandler.bind(this);
  }

  // This is the function that will get called every time we change one of the fields tied to the user data source.
  // it keeps the state current so that when we submit the form, we can pull the value to update from the state.  Note that
  // we manage multiple fields with one function and no conditional logic, because we are passing in the name of the state
  // object as an argument to this method.  
  fieldChangeHandler(field, e) {
    console.log("field change");
    this.setState({
      [field]: e.target.value
    });
  }


  // This is the function that will get called the first time that the component gets rendered.  This is where we load the current
  // values from the database via the API, and put them in the state so that they can be rendered to the screen.  
  componentDidMount() {
    console.log("In profile");
    console.log(this.props);

    // fetch the user data, and extract out the attributes to load and display
    fetch(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem("user"), {
      method: "get",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(
        result => {
          if (result) {
            console.log(result);
            if (result.attributes) {
              this.setState({
                // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
                // try and make the form component uncontrolled, which plays havoc with react
                username: result.attributes.username || "",
                firstname: result.attributes.firstName || "",
                lastname: result.attributes.lastName || "",
                favoritecolor: result.attributes.favoritecolor || ""

              });
            }
          }
        },
        error => {
          alert("error!");
        }
      );
  }

  // This is the function that will get called when the submit button is clicked, and it stores
  // the current values to the database via the api calls to the user and user_preferences endpoints
  submitHandler = event => {

    //keep the form from actually submitting, since we are handling the action ourselves via
    //the fetch calls to the API
    event.preventDefault();

    //make the api call to the user controller, and update the user fields (username, firstname, lastname)
    fetch(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem("user"), {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        attributes: {
          username: this.state.username,
          firstName: this.state.firstname,
          lastName: this.state.lastname,
          favoritecolor: this.state.favoritecolor
        }
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            responseMessage: result.Status
          });
        },
        error => {
          alert("error!");
        }
      );
  };

  deleteHandler = event => {
    event.preventDefault();
    console.log(sessionStorage.getItem("password"))
    this.deleteAccount()
  }

  async deleteAccount() {
    try {
      if (this.state.password != "") {
        if (this.state.password == this.state.re_password) {
          if (this.state.password == sessionStorage.getItem("password")) {
            const deleteResponse = await fetch(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem("user") + "/?relatedObjectsAction=delete", {
              method: "DELETE",
              headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
              }
            })
            this.props.logout()

          }
          else {
            this.setState({
              responseMsg: true,
              feedback:"Password did not match current password"
            })
          }
        }
        else {
          this.setState({
            responseMsg: true,
            feedback:"Passwords did not match"
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  showFeedback(){
    if (this.state.responseMsg){
      return (
          <span className="error-message">
          <br />
          {this.state.feedback}
          </span>
      )
    }
  }
  

  showDeleteForm = event => {
    event.preventDefault()
    if (!this.state.deleteFormShow) {
      this.setState({
        deleteFormShow: true,
        deleteButton: "Cancel"
      })
    }
    else {
      this.setState({
        deleteFormShow: false,
        deleteButton: "Delete Account"
      })
    }
  }

  // This is the function that draws the component to the screen.  It will get called every time the
  // state changes, automatically.  This is why you see the username and firstname change on the screen
  // as you type them.
  render(){
    return (
      <div id="settingPage" style={{ marginTop: "120px" }}>
        <div className="settings-container">
          <h1>Settings</h1>
          <div className="rowContainer">
            <button
              className="button"
              id="deleteAccountButton"
              onClick={this.showDeleteForm}
            >
              {this.state.deleteButton}
            </button>
          </div>

          {this.state.deleteFormShow ? (
          <form onSubmit={this.deleteHandler.bind(this)} className="deletePasswordForm">
            {this.showFeedback()}
            <div className="rowContainer" id="passwordReset">
              <label>
                Password:
                </label>
                <input
                  className="inputdelete"
                  type="password"
                  onChange={e => this.fieldChangeHandler("password", e)}
                />
              
              <label>
                Re-Password:
              </label>
                <input
                  type="password"
                  onChange={e => this.fieldChangeHandler("re_password", e)}
                />
              
            </div>
            <input type="submit" value="Delete" className="button" id="delete"/>
          </form>
        )
          : (<div />)}
        </div>

      </div>
    );
  }
}

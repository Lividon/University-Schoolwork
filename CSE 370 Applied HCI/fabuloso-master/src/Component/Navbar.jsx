import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "../pika.css";
import "../Responsive_CSS/NavbarR.css";
import Autocomplete from "./Autocomplete";
import messageIcon from "../assets/messages.svg";

// import { Link } from "react-router-dom";
// pull in the images for the menu items
// import postIcon from "../assets/post.svg";
// import friendIcon from "../assets/friends.svg";
// import settingIcon from "../assets/settings.svg";
// import helpIcon from "../assets/help.svg";
// import exitIcon from "../assets/exit.png";
// import groupIcon from "../assets/group.png";

/* The Navbar class provides navigation through react router links.  Note the callback
   to the parent app class in the last entry... this is an example of calling a function
   passed in via props from a parent component */

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      inputValue: "",
      responseMsg: false,
      feedback: "",
    };
  }

  componentDidMount() {
    this.getUsers()
  }

  async getUsers(){
    try {
      const usersResponse = await fetch(process.env.REACT_APP_API_PATH + "/users/", {
          method: "GET",
          headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
      })
      const usersJson = await usersResponse.json();
      this.setState({
          users: usersJson[0],
      });
    }catch (error){
        console.log(error)
    }
  }

  changeInputHandler(input){
    this.setState({
      inputValue: input,
      responseMsg: false,
    });
  };

  selectAutocomplete(){
    //passes to autocomplete dont do anything
  }

  viewUserProfile = (e) =>{
    e.preventDefault()
    const userArr = this.state.users.filter(user=> user.attributes.username === this.state.inputValue)
    if (userArr.length != 0){
      window.location.assign("https://webdev.cse.buffalo.edu/hci/teams/fabuloso/profile/" + userArr[0].id)
    }else{
      this.setState({
        responseMsg: true,
        feedback: "User not found",
      })
    }
  }

  showFeedback(){
    if(this.state.responseMsg){
      return (
        <span className="error-message">{this.state.feedback}</span>
      )
    }
  }

  render() {
    return (
      <div className="Navbar">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>{" "}
        <div className="leftSide">
          <Link to="/posts" style={{ textDecoration: "none" }}>
            <div className="dreamworktitle">
              Dream <br></br>Team
            </div>
          </Link>
          <form className="search-box-container" onSubmit={this.viewUserProfile.bind(this)}>
            <div className="search-box">
              <Autocomplete
                inputClass="search-users-input"
                placeholder="Find a user's profile . . ."
                suggestions={this.state.users}
                changeInputHandler={this.changeInputHandler.bind(this)}
                selectAutocomplete={(e) => this.selectAutocomplete(e)}
              />
              {this.showFeedback()}
            </div>
            <button className="fa fa-search"></button>
          </form>
        </div>
        <div className="rightSide">
          <Link to="/messages">
            <img src={messageIcon} className="fa fa-comments-o" id="message" />
          </Link>
          <div className="dropdown">
            <button className="dropbtn">≡</button>
            <div className="dropdown-content">
              <Link to="/profile">View My Profile</Link>
              <Link to="/following">Followers</Link>
              <Link to="/followSearch">Follow Search</Link>
              <Link to="/block">Block Users</Link>
              <Link to="/settings">Setting</Link>
              <Link to="/" onClick={this.props.logout}>
                Log out
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Navbar;

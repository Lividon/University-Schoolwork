import React, { Fragment } from "react";
import "../App.css";
import Autocomplete from "./Autocomplete";


export default class MessagesSearchUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          //user currently only identified by email
          searchUser: "",
          responseMsg: false,
          feedback: "",
        };
      }

    
    selectAutocomplete(){

    }

    async componentDidMount(){
      await this.getUsers()
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
        //let users = result[0];
        let users = [];
        let messageUsernames = this.props.messageUsers.map(user=> user.attributes.username)
        usersJson[0].forEach((user) => {
            if ((user.attributes?.username && user.id != sessionStorage.getItem("user")) && !messageUsernames.includes(user.attributes.username) ) {
                users.push(user);
            }
        });
        this.setState({
            users: users,
        });
      }catch (error){
          console.log(error)
      }
    }

    // keeps the search state as it is typed
    searchUserChangeHandler = (input) => {
        this.setState({
          searchUser: input,
        });
      };


    async findUserHandler(e){
        e.preventDefault();
        try {
            const userSearched = await fetch(`https://webdev.cse.buffalo.edu/hci/api/api/fabuloso/users?attributes=%7B%0A%20%20%22path%22%3A%20%22username%22%2C%0A%20%20%22equals%22%3A%20%22${this.state.searchUser}%22%0A%7D`);
            const userJson = await userSearched.json();
            const userID = userJson[1] == 0 ? -1 : userJson[0][0].id
            if (userID == -1){
              this.setState({
                responseMsg: true,
                feedback: "User not found"
              })
            }else if (this.props.messageUsers.some(person => person.id === userID)){
              this.setState({
                responseMsg: true,
                feedback: "User already messaged"
              })
            }else if (sessionStorage.getItem("user") == userID){
              this.setState({
                responseMsg: true,
                feedback: "Sorry can't message yourself"
              })
            }else{
              this.setState({
                responseMsg: true,
                feedback: "User ready to message"
              })
                this.props.onAddUser(userJson[0][0]);
            }
        } catch (error) {
            // TODO: display inline error user doesn't exist
            this.setState({
              responseMsg: true,
              feedback: "Sorry, something failed on our end."
            })
            console.log(error)
        }
    };

    showFeedback(){
      if (this.state.responseMsg == true){
        return(
          <Fragment>
          <span className="error-message" style={{marginLeft:"15px"}}>{this.state.feedback}</span>
          </Fragment>
        )
      }else{
        return (
          <Fragment>
          <span className="error-message"> {" "}</span>
          </Fragment>
        )
      }
    }

    render(){
        return(
            <form className="messages-sidebar-search-container" onSubmit={this.findUserHandler.bind(this)}>
                <div className="messages-error-search-container">
                  <label style={{marginLeft:"15px"}}>Search Users to Message</label>
                  <br/>
                  {this.showFeedback()}
                  <div className="messages-sidebar-search">
                  <Autocomplete inputClass="search-users-input" 
                          placeholder="Add new user to message..."
                          form="messages"
                          suggestions = {this.state.users} 
                          changeInputHandler={this.searchUserChangeHandler.bind(this)} 
                          selectAutocomplete = {(e) => this.selectAutocomplete(e)}
                          />
                  </div>
                </div>
                <button id="messages-sidebar-search-button" className="messages-button">
                  <span className="messages-siderbar-search-button-text">+</span>
                </button>
                
            </form>
        );
    }
}

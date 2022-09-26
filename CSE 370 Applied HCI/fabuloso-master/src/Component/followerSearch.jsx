import React, { useState } from "react";
import "../App.css";
import "../follower.css";
import Card from "./follower_card";
import "../follower_card.css";
import Autocomplete from "./Autocomplete";
import { element } from "prop-types";
import { Link } from "react-router-dom";

export default class FollowerSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendname: "",
      friendid: "",
      responseMsg: false,
      feedback : "",
      users: [],
      followedUserConnections: [],
      followedUsernames: [],
      loadingFollowedUsers: true,
      isLoading: true,
      followInput: "",
      username: "",
    };
  }
  //this will update the field from empty string
  changeInputHandler(input) {
      this.setState({
        followInput: input,
      });
  }

  //utilize the autocomplete feature
  selectAutocomplete(friendID) {
    this.setState({
      // friendid: this.state.users.find(x => x.email === emails).id
      friendid: friendID,
    });
    console.log("set friend ID to" + friendID);
  }

  async getUsername(){
    try{
        const userResponse = await fetch(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem("user"),{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
        });
        const userJson = await userResponse.json()
        this.setState({
            username: userJson.attributes.username || ""
        })
    }catch(e) {
        console.log(e)
    }
}

  //find available users ; useful for cases like Modals when u need to measure a DOM Node bfre rendering smething dependent on its size
  async componentDidMount() {
    console.log(process.env.REACT_APP_API_PATH)
    await this.getUsername()
    const followedConnections = await this.getFollowedUsers()
    const followedUsernames = followedConnections.map(user=> user.toUser.attributes.username)
    fetch(process.env.REACT_APP_API_PATH + "/users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result) {
            //let names = result[0];
            let names = [];
              result[0].forEach((element) => {
                if ((element.attributes?.username && element.id != sessionStorage.getItem("user")) && !followedUsernames.includes(element.attributes.username) ) {
                    names.push(element);
                }
            });

            this.setState({
              users: names,
              // responseMsg: true,
            });
            console.log(names);
          }
        },
        (error) => {
          alert("error!");
        }
        ///CHANGE TO SOMETHING MORE USER FRIENDLY
      );
      this.getFollowedUsers()
  }


  async getUserID(username){
    try{
        const url = process.env.REACT_APP_API_PATH + "/users?" + `attributes=%7B%0A%20%20%22path%22%3A%20%22username%22%2C%0A%20%20%22equals%22%3A%20%22${username}%22%0A%7D`
        console.log(url)
        const userResponse = await fetch(url,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
        });
        const userJson = await userResponse.json()
        if(userJson[1]){
            return userJson[0][0].id
        }else{
            return -1
        }
    }catch(e) {
        console.log(e)
    }
}

async checkAlreadyFollowed(toUserID){
  try{
      const url = process.env.REACT_APP_API_PATH + "/connections?fromUserID=" + sessionStorage.getItem("user") + "&toUserID=" + toUserID + "&attributes=%7B%0A%20%20%22path%22%3A%20%22type%22%2C%0A%20%20%22equals%22%3A%20%22friend%22%0A%7D"
      const userResponse = await fetch(url,{
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              'Authorization': 'Bearer ' + sessionStorage.getItem("token")
          }
      });
      const userJson = await userResponse.json()
      console.log(userJson)
      if (userJson[1] == 0){
          return false
      }else{
          return true
      }
  }catch(e) {
      console.log(e)
  }
}

  // submitHandler = (event) => {
  //   //stops the form from submitting .....but it can also stop it from doing a page reload
  //   event.preventDefault();
  //   console.log("Friend is");
  //   console.log(this.state.friendid);
  //   //make friends between two persons
  //   fetch(process.env.REACT_APP_API_PATH + "connections", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + sessionStorage.getItem("token"),
  //     },
  //     body: JSON.stringify({
  //       toUserID: parseInt(this.state.friendid),
  //       fromUserID: sessionStorage.getItem("user"),
  //       attributes: { type: "friend", status: "active" },
  //     }),
  //   })
  //     //I WANT TO STORE THE LIST RETURNED

  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         console.log(result);
  //         //SAVE THIS result IN DATA STRUCTURE TO PASS ON
  //         this.setState({ responseMsg: true , feedback : "user is now followed"});
  //         // alert("user added");
  //         // window.location.reload();
  //       },
  //       (error) => {
  //         // alert("whoops! User doesn't exist");
  //         this.setState({ responseMsg: true , feedback : "user is not found"});
  //       }
  //     );
  // };

  async getFollowedUsers(){
    try{
      const userResponse = await fetch(process.env.REACT_APP_API_PATH + "/connections?fromUserID=" + sessionStorage.getItem("user") + "&attributes=%7B%0A%20%20%22path%22%3A%20%22type%22%2C%0A%20%20%22equals%22%3A%20%22friend%22%0A%7D",{
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              'Authorization': 'Bearer ' + sessionStorage.getItem("token")
          }
      });
      const userJson = await userResponse.json()
      const following = userJson[0]
      this.setState({
          followedUserConnections: following,
          followedUsernames: following.map(user => user.toUser.attributes.username),
          loadingFollowedUsers: false,
          isLoading: false,
      })
      return following
  }catch(e) {
      console.log(e)
  }
}

async followUserHandler(e) {
  e.preventDefault();
  this.getFollowedUsers()
  const toUserID = await this.getUserID(this.state.followInput)
  const alreadyFollowed = await this.checkAlreadyFollowed(toUserID)
  console.log(this.state.users)
  if (alreadyFollowed) {
      this.setState({
          responseMsg: true,
          feedback: this.state.followInput + " is already followed"
      })
  }else if (this.state.username === this.state.followInput){
      this.setState({
          responseMsg: true,
          feedback: "You can't follow yourself dummy"
      })
  }else if (this.state.users.filter(user => user.attributes.username == this.state.followInput).length == 0){
      this.setState({
          responseMsg: true,
          feedback: this.state.followInput +" is not found"
      })
  }else{
      try{
          await fetch(process.env.REACT_APP_API_PATH + "/connections", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  'Authorization': 'Bearer ' + sessionStorage.getItem("token")
              },
              body: JSON.stringify({
                  toUserID: toUserID,
                  fromUserID: sessionStorage.getItem("user"),
                  attributes: { type: "friend", status: "active" },
              })
          });
          this.setState({
            responseMsg: true,
            feedback: this.state.followInput + " is successfully followed"
          })
          this.getFollowedUsers()

      }catch(e){
          this.setState({
              responseMsg: true,
              feedback: "Sorry, something went wrong on our end."
          })
      }
  }
}


  update(){
    if (this.state.responseMsg == true){
      return (<span className="error-message"> {this.state.feedback} </span>)
    }
  }
  // to avaoid refresh
  // handleClick = (event) => {
  //   event.preventDefault();
  // };
  render() {
    return (
      <div className="searchFollowersPage">
        <Link className="findFollowerBtn" id="back" to="/following"> View Following Users </Link>
        <div className="SearchForm ">
          <form onSubmit={this.followUserHandler.bind(this)} className="submitButtn">
          
            <h1>Find A User to Follow</h1>
            <p> To find another user, start typing their username below </p>
            <label> Search here:  </label>
            <div className="reverseRow" style={{height:"50px", width:"70%"}}>
              <Autocomplete 
              inputClass="followInput" 
              placeholder="Follow a user . . ." 
              suggestions={this.state.users} 
              selectAutocomplete={(e) => this.selectAutocomplete(e)} 
              changeInputHandler={this.changeInputHandler.bind(this)}
              />
            </div>
            <br/> <br/>
            <input type="submit" value="Follow" className="button" id="submitButton" />
            {this.update()}
          </form>
        </div>
      </div>
    )
  }
}
import React, { useState } from "react";
import '../follower_card.css';
import maya from "../assets/maya-profile-round.jpeg";

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      email: this.props.email,
      username: this.props.username,
      // connections : this.loadFriends,
      sessiontoken: ""
    };
  }

  // changeConnection(id,status){
  //   fetch(process.env.REACT_APP_API_PATH+"/connections/"+id,{
  //     method: "PATCH", 
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization' : 'Bearer '+sessionStorage.getItem("token")
  //     },
  //     body: JSON.stringify({
  //       attributes: {status: status, type: "friend"}
  //     })
  //   })
  //   .then(res => res.json())
  //   .then(
  //     result => {
  //       this.setState({
  //         responseMessage: result.Status
  //       });
  //       this.loadFriends();
  //     },
  //     error => {
  //       alert("error!");
  //     }
  //   );
  // }

  // //NEED TO FIX 
  // handleClickA = () => {
  //   this.changeConnection(this.state.connectionId,"unfollow")
  //   console.log("test if this works ");
  // }
  // Try with delete
  async deleteFollower() {
    await fetch(process.env.REACT_APP_API_PATH + "/connections/" + this.props.id, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }
    })
      .then(result => { this.props.loadFollowing()} ,
       error => {console.log("error")});
  }

  // handleClickA =() =>{
  //   this.deleteFollower()
  // }

  render() {
    return (
      <div className="Card" >
        <div className=" upper-container">

        </div>
        <div className="lower-container">
          {/* <p style={{color : "Black" }}>FirstName LastName</p> */}
          <p style={{ color: "Black" }}>{this.state.firstName} {this.state.lastName}</p>
          {/* <p style={{ color: "Black" }}>{this.state.lastName}</p> */}
          <p style={{ color: "Black" }}>{this.state.username}</p>
          <p style={{ color: "Black" }}>Contact me: {this.state.email}</p>
          <p style={{ color: "Black" }}>About me : Student</p>
        </div>
        <div> <button onClick={this.deleteFollower.bind(this) } className="button" id="unfollowButton" > Unfollow </button> 
        {/* <button onClick={window.location.reload()}></button>  */}
        {/* {window.location.reload()} */}
        </div>
      </div>
    )
  }

}

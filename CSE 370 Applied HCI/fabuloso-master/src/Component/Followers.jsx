import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import "../follower.css";
import Card from "./follower_card";
import "../follower_card.css";


export default class Followers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: props.userid,
      connections: [],
      otherconnection: []
    };
    this.loadFollowing = this.loadFollowing.bind(this)
    this.loadFollower = this.loadFollower.bind(this)
  }


  componentDidMount() {
    this.loadFollowing();
    this.loadFollower();
  }

  loadFollowing() {
    fetch(
      process.env.REACT_APP_API_PATH +
      "/connections?fromUserID=" +
      sessionStorage.getItem("user") +
      "&attributes=%7B%0A%20%20%22path%22%3A%20%22type%22%2C%0A%20%20%22equals%22%3A%20%22friend%22%0A%7D",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result) {
            this.setState({
              isLoaded: true,
              connections: result[0],
            });
            // console.log("this is connections ", connections)
            console.log("this is the result ", result)
            // console.log("get me the connection id", result[id] )
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }
  //who is following you only 
  loadFollower() {
    fetch(
      process.env.REACT_APP_API_PATH +
      "/connections?toUserID=" +
      sessionStorage.getItem("user") +
      "&attributes=%7B%0A%20%20%22path%22%3A%20%22type%22%2C%0A%20%20%22equals%22%3A%20%22friend%22%0A%7D",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result) {
            this.setState({
              isLoaded: true,
              otherconnection: result[0],
            });
            // console.log("this is connections ", connections)
            console.log("this is the result ", result)
            // console.log("get me the connection id", result[id] )
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }
  //to avoid refresh
  handleClick = (event) => {
    event.preventDefault();
  };


  render() {

    return (
      <div className="followPage">
        <div className="rowContainer">
          <h1>Following</h1>
          {/*<button className="topButtons"> Followers </button>*/}
          {/* <button className="topButtons"> Following </button>
            <button className="topButtons"> Matching </button> */}
        </div>
        <div className="follow_under">
          {this.state.connections.map(connection => (
            <Card key={connection.id} id={connection.id} username={connection.toUser.username} firstName={connection.toUser.attributes.firstName} lastName={connection.toUser.attributes.lastName} email={connection.toUser.email} loadFollowing={this.loadFollowing} />
          ))}
        </div>
        <h1> Followers</h1>
        <div className="follow_under">
          {this.state.otherconnection.map(connection => (
            <Card key={connection.id} id={connection.id} username={connection.fromUser.username} firstName={connection.fromUser.attributes.firstName} lastName={connection.fromUser.attributes.lastName} email={connection.fromUser.email} loadFollower={this.loadFollower} />
          ))}
        </div>


      </div>
    );
  }
}

import React from "react";
import "../App.css";
import PostingList from "./PostingList.jsx";
import "../Dustin.css"

export default class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postUserImg: "",
      post_text: "",
      postmessage: ""
    };
    this.postListing = React.createRef();
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem("user"), {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ sessionStorage.getItem("token")
      }
    })
    .then(res => res.json())
    .then(result => {
        if (result) {
            if (result.attributes){
              this.setState({
                postUserImg: result.attributes.image
              })
            }
        }
    })
    .catch(error => alert(error));
  }

  submitHandler = event => {
    //keep the form from actually submitting
    event.preventDefault();

    //empty input
    this.setState({
      post_text: ""
    })

    //make the api call to the authentication page

    fetch(process.env.REACT_APP_API_PATH + "/posts", {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        profileImg: this.state.postUserImg,
        authorID: sessionStorage.getItem("user"),
        content: this.state.post_text,
        parentID: this.props.parent,
        thumbnailURL: "",
        type: "post"
      })
    })
      .then(res => res.json())
      .then(
        result => {
          // update the count in the UI manually, to avoid a database hit
          this.props.onAddComment(this.props.commentCount + 1);
          this.postListing.current.loadPosts();
        },
        error => {
          alert("error!");
        }
      );
  };


  myChangeHandler = event => {
    this.setState({
      post_text: event.target.value
    });
  };

  render() {
    if (this.props.testing == "A") {
      return (
        <div style={{display: "flex"}}>
          <PostingList
            ref={this.postListing}
            parentid={this.props.parent}
            type="commentlist"
          />
          <form className="comment-form" onSubmit={this.submitHandler}>
            <div className="rowContainer">
              <input onChange={this.myChangeHandler} placeholder="Write a comment..." value={this.state.post_text} className="commentInput"></input>
              <br />
            </div>
            {this.state.postmessage}
          </form>
        </div>
      );
    } else if (this.props.testing == "B") {
      return (
        <div>
          <form className="comment-form" onSubmit={this.submitHandler}>
            <div className="rowContainer">
              <input onChange={this.myChangeHandler} placeholder="Write a comment..." value={this.state.post_text} className="commentInput"></input>
              <br />
            </div>
            {this.state.postmessage}
          </form>
          <PostingList
            ref={this.postListing}
            parentid={this.props.parent}
            type="commentlist"
          />
        </div>
      );
    } else {
      return (
        <div>
          <form className="comment-form" onSubmit={this.submitHandler}>
            <div className="rowContainer">
              <input onChange={this.myChangeHandler} placeholder="Write a comment..." value={this.state.post_text} className="commentInput"></input>
            </div>
            {this.state.postmessage}
          </form>
          <PostingList
            ref={this.postListing}
            parentid={this.props.parent}
            type="commentlist"
          />

        </div>
      );
    }
  }
}

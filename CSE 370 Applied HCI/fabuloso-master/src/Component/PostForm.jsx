import React from "react";
import "../App.css";
import "../Dustin.css";
import PostingList from "./PostingList.jsx";

// The post form component holds both a form for posting, and also the list of current posts in your feed.  This is primarily to
// make updating the list simpler.  If the post form was contained entirely in a separate component, you would have to do a lot of calling around
// in order to have the list update.  Communication between components in react is ... fun.
export default class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postUserImg: "",
      post_text: "",
      postmessage: "",
    };
    this.postListing = React.createRef();
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_API_PATH + "/users/" + sessionStorage.getItem("user"), {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result) {
          if (result.attributes) {
            this.setState({
              postUserImg: result.attributes.image
            })
          }
        }
      })
      .catch(error => alert(error));
  }

  // the handler for submitting a new post.  This will call the API to create a new post.
  // while the test harness does not use images, if you had an image URL you would pass it
  // in the attributes field.  Posts also does double duty as a message; if you want in-app messaging
  // you would add a recipientUserID for a direct message, or a recipientGroupID for a group chat message.
  // if the post is a comment on another post (or comment) you would pass in a parentID of the thing
  // being commented on.  Attributes is an open ended name/value segment that you can use to add
  // whatever custom tuning you need, like category, type, rating, etc.
  submitHandler = (event) => {
    //keep the form from actually submitting via HTML - we want to handle it in react
    event.preventDefault();

    let imageUrl = "";
    const imageData = document.getElementById("postFileUpload").files[0];

    const formData = new FormData();
    formData.append("uploaderID", sessionStorage.getItem("user"));
    formData.append("attributes", JSON.stringify({}));
    formData.append("file", imageData);

    fetch(process.env.REACT_APP_API_PATH + "/file-uploads", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        imageUrl = result.path;
        fetch(process.env.REACT_APP_API_PATH + "/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            authorID: sessionStorage.getItem("user"),
            content: this.state.post_text,
            attributes: {
              profileImg: this.state.postUserImg,
              image: "https://webdev.cse.buffalo.edu" + imageUrl,
              isDirectMessage: false,
            },
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            this.setState({
              postmessage: result.Status,
              post_text: ""
            });
            // once a post is complete, reload the feed
            this.postListing.current.loadPosts();
          })
          .catch((error) => alert(error));
      });
  };

  // this method will keep the current post up to date as you type it,
  // so that the submit handler can read the information from the state.
  myChangeHandler = (event) => {
    this.setState({
      post_text: event.target.value,
    });
  };

  // the login check here is redundant, since the top level routing also is checking,
  // but this could catch tokens that were removed while still on this page, perhaps due to a timeout?
  render() {
    /*if (!sessionStorage.getItem("token")) {
      console.log("NO TOKEN");
      return ("Please log in to make and view posts");

    }else{
      console.log("Rendering postings ",this.props.refresh);
    }*/
    return (
      <div className="mainContainer">
        <div className="feedContainer">
          <form className="post-form" onSubmit={this.submitHandler}>
            <div className="rowContainer" id="postRowContainer">
              <input
                placeholder="Post Something!"
                className="post-input"
                value={this.state.post_text}
                onChange={this.myChangeHandler}
              />
              <input
                className="button"
                id="postSubmit"
                type="submit"
                value="Post"
              />
            </div>
            <input id="postFileUpload" type="file" width="100%" />
          </form>
          <PostingList
            testing={this.props.testing}
            ref={this.postListing}
            refresh={this.props.refresh}
            type="postlist"
          />

          {this.state.postmessage}
        </div>

        <div className="sideContainer">
          <div className="columnContainer">
            <h1>Friends</h1>
          </div>

          <div className="columnContainer">
            <h1>Groups</h1>
          </div>
        </div>
      </div>
    );
  }
}

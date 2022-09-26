import React from "react";
import "../App.css";
import CommentForm from "./CommentForm.jsx";
import trashIcon from "../assets/TrashCan.svg";
import commentIcon from "../assets/comment.svg";
import likeIcon from "../assets/thumbsup.png";
import editIcon from "../assets/pencil.svg";
import messageIcon from "../assets/messages.svg";
import heartIcon from "../assets/icons8-heart-32.png";
import "../Dustin.css";
import "../Responsive_CSS/PostR.css";
import { Link } from "react-router-dom";
//import { Email } from "@mui/icons-material";

/* This will render a single post, with all of the options like comments, delete, tags, etc.  In the harness, it's only called from PostingList, but you could
  also have it appear in a popup where they edit a post, etc. */
export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: this.props.type == "commentlist" ? false : true,
      comments: this.props.commentCount,
      showTags: this.props.post.reactions.length > 0,
      content: this.props.post.content,
      showEdit: false,
      username: "No username",
      postLikes: "",
    };
    this.getLikeCount();
    this.post = React.createRef();
    this.fieldChangeHandler.bind(this);
    this.getUsername(this.props.post.author.id)
  }

  showModal = (e) => {
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  getUsername(authorID) {
    fetch(process.env.REACT_APP_API_PATH + "/users/" + authorID.toString(), {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
    })
      .then(res => res.json())
      .then(
        result => {
          if (result) {
            if ('username' in result.attributes) {
              this.setState({
                username: result.attributes.username
              })
            }
          }
        },
        error => {
          alert("error!" + error);
        }
      );
  }

  getLikeCount() {
    fetch(process.env.REACT_APP_API_PATH + "/post-reactions/?postID=" + this.props.post.id, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      },
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            postLikes: result[1]
          })
        },
      );
  }

  setCommentCount = (newcount) => {
    this.setState({
      comments: newcount,
    });
  };

  getCommentCount() {
    if (!this.state.comments || this.state.comments === "0") {
      return 0;
    }
    return parseInt(this.state.comments);
  }

  // this is the simplest version of reactions; it's only mananging one reaction, liking a post.  If you unlike the post,
  // it deletes the reaction.  If you like it, it posts the reaction.  This will almost certainly be made more complex
  // by you, where you will account for multiple different reactions.  Note that in both cases, we reload the post afterwards to
  // show the updated reactions.

  likePost(tag, thisPostID) {
    //console.log(thisPostID)
    if (this.props.post.reactions.length > 0) {
      //make the api call to post
      fetch(
        process.env.REACT_APP_API_PATH +
        "/post-reactions/" +
        this.props.post.reactions[0].id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      ).then(
        (result) => {
          this.getLikeCount()
          this.props.loadPosts();
        },
        (error) => {
          alert("error!" + error);
        }
      );
    } else {
      //make the api call to post
      fetch(process.env.REACT_APP_API_PATH + "/post-reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          reactorID: sessionStorage.getItem("user"),
          postID: thisPostID,
          name: "like",
        }),
      }).then(
        (result) => {
          this.getLikeCount()
          this.props.loadPosts();
        },
        (error) => {
          alert("error!" + error);
        }
      );
    }

  }

  // this will toggle the CSS classnames that will either show or hide the comment block
  showHideComments() {
    if (this.state.showModal) {
      return "comments show";
    }
    return "comments hide";
  }

  // this will toggle the CSS classnames that will either show or hide the comment block
  showHideTags() {
    if (this.state.showTags) {
      if (this.props.post.reactions.length > 0) {
        //console.log("Had a reaaction");
        return "tags show tag-active";
      }
      return "tags show";
    }
    return "tags hide";
  }

  deletePost(postID) {
    //make the api call to post
    fetch(process.env.REACT_APP_API_PATH + "/posts/" + postID, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    }).then(
      (result) => {
        this.props.loadPosts();
      },
      (error) => {
        alert("error!" + error);
      }
    );
  }

  // this is showing both tags and comments... but used to show only comments.  That's a
  // frequent cause of names being out of sync with the way things work; do you really want to
  // risk breaking stuff by changing the name and not knowing everywhere it is called?
  commentDisplay() {
    //console.log("Comment count is " + this.props.post.commentCount);

    // if comment, dont show comments and dont allow comments on comments
    if (this.props.type == "commentlist") {
      return (
        <div className="comment-comment-block">
          <div className="tag-block">
            <button value="tag post" onClick={(e) => this.showTags()}>
              tag post
            </button>
          </div>
          <div name="tagDiv" className={this.showHideTags()}>
            <img
              src={likeIcon}
              className="comment-icon"
              onClick={(e) => this.tagPost("like", this.props.post.id)}
              alt="Like Post"
            />
          </div>
        </div>
      );
    }

    //else {
    return (
      <div>
        <div className="comment-block">
          {/*
          <div className="tag-block">
            <button value="tag post" onClick={e => this.showTags()}>
              tag post
            </button>
          </div>
          <div name="tagDiv" className={this.showHideTags()}>
            <img
              src={likeIcon}
              className="comment-icon"
              onClick={e => this.tagPost("like", this.props.post.id)}
              alt="Like Post"
    />
        </div>
        */}
          <div className="comment-indicator">
            {/*<img
              src={commentIcon}
              className="comment-icon"
              onClick={e => this.showModal()}
              alt="View Comments"
      />*/}
          </div>
          <div className={this.showHideComments()}>
            <CommentForm
              testing={this.props.testing}
              onAddComment={this.setCommentCount}
              parent={this.props.post.id}
              commentCount={this.getCommentCount()}
            />
          </div>
        </div>
      </div>
    );
    //}
  }

  // we only want to expose the delete post functionality if the user is
  // author of the post
  showDelete() {
    if (this.props.post.author.id == sessionStorage.getItem("user")) {
      return (
        <img
          src={trashIcon}
          className="deleteIcon"
          alt="Delete Post"
          title="Delete Post"
          onClick={(e) => this.deletePost(this.props.post.id)}
        />
      );
    }
    return "";
  }

  UpdatePost(postID) {
    //console.log("This is the content:" + this.state.content);
    fetch(process.env.REACT_APP_API_PATH + "/posts/" + postID, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        authorID: this.props.post.author.id,
        created: this.props.post.created,
        updated: this.props.post.updated,
        content: document.getElementById(this.props.post.id).innerHTML,
      }),
    }).then(
      (result) => {
        this.props.loadPosts();
      },
      (error) => {
        alert("error!" + error);
      }
    );
  }

  editPost() {
    if (!this.state.showEdit) {
      document.getElementById(this.props.post.id).setAttribute("contentEditable", true);
      document.getElementById(this.props.post.id).style.backgroundColor = "rgba(0,0,0,.05)"
      this.setState({
        showEdit: true
      })
    }
    else {
      document.getElementById(this.props.post.id).setAttribute("contentEditable", false);
      document.getElementById(this.props.post.id).style.backgroundColor = "white"
      this.UpdatePost(this.props.post.id)
      this.setState({
        showEdit: false,
      });
    }
  }

  fieldChangeHandler(field, e) {
    this.setState({
      content: document.getElementById(this.props.post.id).innerHTML,
    });
  }

  showEdit() {
    if (this.props.post.author.id == sessionStorage.getItem("user")) {
      return (
        <img
          src={editIcon}
          className="editButton"
          onClick={(e) => this.editPost(this.props.post.id)}
        />
      );
    }
    return "";
  }

  showTime() {
    const lastUpdated = this.props.post.updated
    return (
      <span>{String(new Date(lastUpdated)).split("GMT")[0]}</span>
    )
  }

  showPost() {
    //console.log(this.props.post)
    if (this.props.type == "commentlist") {
      return (
        <div className="commentPost">
          <div className="rowContainer" id="postIcons">
            {this.showEdit()}
            {this.showDelete()}
          </div>
          {this.showTime()}
          <div className="postUser">
            <Link  
            to={"/profile/" + this.props.post.author.attributes.id}
            style={{textDecoration: "none"}}
            >
            <img className="profilePicturePost" id="commentPicture" alt={this.props.post.author.attributes.username + " Profile Picture"} src={this.props.post.author.attributes.profileImg ? this.props.post.author.attributes.profileImg : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" }></img>
            </Link>
            <div className="columnContainer" id="commentBox">
            <Link  
            to={"/profile/" + this.props.post.author.attributes.id}
            style={{textDecoration: "none", color:"black"}}
            >
            <h3 className="usernameComment">{this.state.username}</h3>
            </Link>
              <span
                key={this.props.post.id}
                role="textbox"
                contentEditable="false"
                className="commentDescription"
                id={this.props.post.id}
              >
                {this.state.content}
              </span>
            </div>
          </div>
          <div className="rowContainer" id="commentButtonDiv">
            <div className="buttonComment" onClick={(e) => this.likePost('like', this.props.post.id)}>{this.state.postLikes}  Like</div>
            <div className="buttonComment">Message</div>
          </div>
        </div>
      );
    }
    return (
      <div className="post">
        <div className="rowContainer" id="PostIcons">
          {this.showEdit()}
          {this.showDelete()}
        </div>
        <div className="rowContainer">
          <div className="postUser">

            <Link  
              to={"/profile/" + this.props.post.author.id}
              style={{textDecoration: "none"}}
              >
              <img className="profilePicturePost" alt={this.props.post.author.attributes.username + " Profile Picture"} src={this.props.post.author.attributes.profileImg ? this.props.post.author.attributes.profileImg : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" }></img> 
            </Link>

            <Link  
            to={"/profile/" + this.props.post.author.id}
            style={{textDecoration: "none", color:"black"}}
            >           
            <h3 className="usernamePost">{this.state.username}</h3>
            </Link>
          </div>
          
          <div>
            {this.showTime()}
          </div>
        </div>
        <div className="postDescriptionContainer">
          <span
            key={this.props.post.id}
            role="textbox"
            contentEditable="false"
            className="postDescription"
            id={this.props.post.id}
          >
            {this.state.content}
          </span>
          <br />
          <div style={{ textAlign: "center" }}>
            {this.props.post.attributes["image"] !==
              "https://webdev.cse.buffalo.eduundefined" ? (
              <img
                src={this.props.post.attributes["image"]}
                style={{
                  aspectRatio: 1 / 1,
                  width: 400,
                  objectFit: "contain",
                }}
              ></img>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="columnContainer">
          <div
            className="comment-indicator-text"
            onClick={(e) => this.showModal()}
            alt="View Comments"
          >
            {this.getCommentCount()} Comments
          </div>
          <hr />
          <div className="rowContainer" id="postButton">
            <div className="button" id="likeButton" onClick={(e) => this.likePost('like', this.props.post.id)}>
              {this.state.postLikes} <img src={heartIcon} className="messagesIcon" />
              Like
            </div>
            
            <Link style={{textDecoration:"none", color:"black"}} to="/messages" className="button" id="shareButton">
              <img src={messageIcon} className="messagesIcon" />
              Message
            </Link>

            
          </div>
          <hr />
        </div>
        <div className="postCommentsContainer">
          <div className="columnContainer">{this.commentDisplay()}</div>
        </div>
      </div>
    );
  }

  render() {
    return this.showPost();
  }
}

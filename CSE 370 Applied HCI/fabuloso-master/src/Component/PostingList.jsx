import React from "react";
import Post from "./Post.jsx";
import "../Dustin.css";

/* The PostingList is going to load all the posts in the system.  This model won't work well if you have a lot of 
  posts - you would want to find a way to limit the posts shown. */

export default class PostingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      posts: [],
      friends: [],
      blocked: [],
      filtered_post: [],
      listType: props.listType,
    };
    this.getFriends();

    this.postingList = React.createRef();
    this.loadPosts = this.loadPosts.bind(this);
  }

  // the first thing we do when the component is ready is load the posts.  This updates the props, which will render the posts
  async componentDidMount() {
    await this.getFriends();
    await this.getBlocked();
    await this.loadPosts();
  }

  // if a parent component wants us to refresh, they can update the refresh value in the props passed in; this should also trigger a
  // reload of the posting list
  componentDidUpdate(prevProps) {
    //console.log("PrevProps " + prevProps.refresh);
    //console.log("Props " + this.props.refresh);
    if (prevProps.refresh !== this.props.refresh) {
      this.loadPosts();
    }
  }

  loadPosts() {
    // if the user is not logged in, we don't want to try loading posts, because it will just error out.
    if (sessionStorage.getItem("token")) {
      let url = process.env.REACT_APP_API_PATH + "/posts";
      if (this.props && this.props.profilePosts) {
        url += `?authorID=${this.props.profilePosts}&`;
      }
      //console.log(this.props);
      url += "?parentID=";
      // if there is a parentid passed in, then we are trying to get all the comments for a particular post or comment, so
      // we will restrict the fetch accordingly.
      if (this.props && this.props.parentid) {
        url += this.props.parentid;
      } else {
        // adds check if attribute isDirectMessage : false
        url +=
          "&attributes=%7B%0A%20%20%22path%22%3A%20%22isDirectMessage%22%2C%0A%20%20%22equals%22%3A%20false%0A%7D&sort=newest";
      }

      fetch(url, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            if (result) {
              this.filterFriends(result[0]);
              console.log(result)
              this.setState({
                isLoaded: true,
                posts: result[0],
              });

              //console.log("Got Posts");
            }
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
            //console.log("ERROR loading Posts")
          }
        );
    }
  }

  getFriends() {
    let url =
      process.env.REACT_APP_API_PATH +
      "/connections/?fromUserID=" +
      sessionStorage.getItem("user") +
      `&attributes=%7B%0A%20%20%22path%22%3A%20%22type%22%2C%0A%20%20%22equals%22%3A%20%22friend%22%0A%7D`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          this.setState({
            friends: result[0],
          });
        }
      });
  }

  filterFriends = async (posts) => {
    const { friends } = this.state;
    friends.push({ toUserID: sessionStorage.getItem("user") });
    if (friends.length > 0) {
      for (let i = 0; i < friends.length; i++) {
        for (let x = 0; x < posts.length - (posts.length - 20); x++) {
          if (friends[i]["toUserID"] == posts[x]["authorID"]) {
            posts.unshift(posts.splice(x, 1)[0]);
          }
        }
      }
    }
    return posts;
  };

  async getBlocked(){
  try{
    let url = process.env.REACT_APP_API_PATH +
      "/connections/?fromUserID=" +
      sessionStorage.getItem("user");
    const blockedResponse = await fetch(url,{
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
    const blockedJson = await blockedResponse.json()
    this.setState({
      blocked : blockedJson[0]
    })
  }catch(e){
    console.log(e)
  }

  }

  filterBlocked(posts){
    console.log(posts)
    const blockedIDs = this.state.blocked.map(blocked => blocked.toUserID)
    return posts.filter(post => {
      if (!blockedIDs.includes(post.authorID)){
        return post
      }
    })
  }

  render() {
    const { error, isLoaded} = this.state;
    let posts = this.filterBlocked(this.state.posts)
    console.log(posts)
    if (error) {
      return <div> Error: {error.message} </div>;
    } else if (!isLoaded) {
      return <div> Loading... </div>;
    } else if (posts) {
      if (posts.length > 0) {
        //console.log(posts)
        return (
          <div>
            {posts.map((post) => (
              <Post
                testing={this.props.testing}
                key={post.id}
                post={post}
                type={this.props.type}
                commentCount={post._count.children}
                loadPosts={this.loadPosts}
              />
            ))}
          </div>
        );
      } else {
        if (this.props.type == "commentlist") {
          return "";
        }
        return <div style={{display:"flex", justifyContent:"center"}}> No Posts Found </div>;
      }
    } else {
      return <div> Please Log In... </div>;
    }
  }
}

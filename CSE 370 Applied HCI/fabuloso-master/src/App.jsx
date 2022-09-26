/*
  App.js is the starting point for the application.   All of the components in your app should have this file as the root.
  This is the level that will handle the routing of requests, and also the one that will manage communication between
  sibling components at a lower level.  It holds the basic structural components of navigation, content, and a modal dialog.
*/

import React, { Fragment } from "react";
import "./App.css";
import "./pika.css";
import PostForm from "./Component/PostForm.jsx";
import FriendList from "./Component/FriendList.jsx";
import GroupList from "./Component/GroupList.jsx";
import LoginForm from "./Component/LoginForm.jsx";
import Setting from "./Component/Settings.jsx";
import FriendForm from "./Component/FriendForm.jsx";
import Modal from "./Component/Modal.jsx";
import Navbar from "./Component/Navbar.jsx";
import Create from "./Component/Create.jsx";
import ProfilePage from "./Component/ProfilePage.jsx";
import MessagesPage from "./Component/MessagesPage.jsx";
import SignUpForm from "./Component/SignUpForm.jsx";
import Followers from "./Component/Followers.jsx";
import FollowerSearch from "./Component/followerSearch";
import ForgetPassword from "./Component/ForgetPassword";
import ResetPassword from "./Component/ResetPassword";
import PicPopWindow from "./Component/PicPopWindow";
import BlockUser from "./Component/BlockUser";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFoundPage from "./Component/NotFoundPage";

// toggleModal will both show and hide the modal dialog, depending on current state.  Note that the
// contents of the modal dialog are set separately before calling toggle - this is just responsible
// for showing and hiding the component
function toggleModal(app) {
  app.setState({
    openModal: !app.state.openModal,
  });
}

// the App class defines the main rendering method and state information for the app
class App extends React.Component {
  // the only state held at the app level is whether or not the modal dialog
  // is currently displayed - it is hidden by default when the app is started.
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      refreshPosts: false,
      logout: false,
      login: false,

      users: [],
      loadingUsers: true,
    };

    // in the event we need a handle back to the parent from a child component,
    // we can create a reference to this and pass it down.
    this.mainContent = React.createRef();

    // since we are passing the doRefreshPosts method to a child component, we need to
    // bind it
    this.doRefreshPosts = this.doRefreshPosts.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.createProfileRoutes = this.createProfileRoutes.bind(this);
  }

  logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("password");
    this.setState({
      logout: true,
      login: false,
    });
  };

  login = () => {
    console.log("CALLING LOGIN IN APP");

    this.setState({
      login: true,
      logout: false,
      refreshPosts: true,
    });
  };

  // doRefreshPosts is called after the user logs in, to display relevant posts.
  // there are probably more elegant ways to solve this problem, but this is... a way
  doRefreshPosts = () => {
    console.log("CALLING DOREFRESHPOSTS IN APP");
    this.setState({
      refreshPosts: true,
    });
  };

  // This doesn't really do anything, but I included it as a placeholder, as you are likely to
  // want to do something when the app loads.  You can define listeners here, set state, load data, etc.
  componentDidMount() {
    /*
    window.addEventListener("click", (e) => {
      console.log("TESTING EVENT LISTENER");
    });
    */
    this.loadUsers()
  }

  renderNavbar() {
    console.log("Render Nav: ", this.state.logout)
    if (sessionStorage.getItem("token")) {
      return (
        <Navbar
          toggleModal={(e) => toggleModal(this, e)}
          logout={this.logout.bind(this)} />
      );
    }
    else {
      return ("")
    }
  }

  async loadUsers() {
    if (sessionStorage.getItem("token")) {
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
          loadingUsers: false,
        });
      } catch (error) {
        console.log(error)
      }
    }
  }

  createProfileRoutes() {
    console.log(this.state.users)
    return (
      <Fragment>
        {this.state.users.map((user) => {
          return (
            <Route
              key={user.id}
              path={"/profile/" + user.id}
              element={<User viewingUser={user} viewOnly={true} login={this.login} />}
            />
          )
        })}
      </Fragment>
    )
  }

  // As with all react files, render is in charge of determining what shows up on the screen,
  // and it gets called whenever an element in the state changes.  There are three main areas of the app,
  // the navbar, the main content area, and a modal dialog that you can use for ... you know, modal
  // stuff.  It's declared at this level so that it can overlay the entire screen.
  render() {
    return (
      // the app is wrapped in a router component, that will render the
      // appropriate content based on the URL path.  Since this is a
      // single page app, it allows some degree of direct linking via the URL
      // rather than by parameters.  Note that the "empty" route "/", which has
      // the same effect as /posts, needs to go last, because it uses regular
      // expressions, and would otherwise capture all the routes.  Ask me how I
      // know this.
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <header className="App-header">
            {this.renderNavbar()}
            <div className="maincontent" id="mainContent">
              <Routes>
                <Route path="/profile" element={<User login={this.login} />} />
                <Route path="/messages" element={<Messages login={this.login} />} />
                <Route path="/register" element={<SignUp login={this.login} />} />
                <Route path="/settings" element={<Settings login={this.login} logout={this.logout.bind(this)} />} />
                <Route path="/friends" element={<Friends login={this.login} />} />
                <Route path="/following" element={<Follower login={this.login} />} />
                <Route path="/followSearch" element={<SearchFollower login={this.login} />} />
                <Route path="/create" element={<Creation login={this.login} />} />
                <Route path="/groups" element={<Groups login={this.login} />} />
                <Route path="/posts" element={<Posts doRefreshPosts={this.doRefreshPosts} login={this.login} apprefresh={this.state.refreshPosts} />} />
                <Route path="/block" element={<BlockUsers login={this.login} />} />
                <Route path="/forgetpassword" element={<ForgetPassword />} />
                <Route path="/resetpassword" element={<ResetPassword />} />
                <Route path="/picpost" element={<PicPopWindow />} />

                {/* AB TESTING: 
               A = comment input on top of comments,
               B = comment input on bottom of comments */}
                <Route path="/postsA" element={<Posts testing={"A"} doRefreshPosts={this.doRefreshPosts} login={this.login} apprefresh={this.state.refreshPosts} />} />
                <Route path="/postsB" element={<Posts testing={"B"} doRefreshPosts={this.doRefreshPosts} login={this.login} apprefresh={this.state.refreshPosts} />} />

                {this.createProfileRoutes()}

                <Route path="/" element={<Posts doRefreshPosts={this.doRefreshPosts} login={this.login} apprefresh={this.state.refreshPosts} />} />
                <Route path='*' exact={true} element={<NotFound />} />
              </Routes>
            </div>
          </header>

          <Modal
            show={this.state.openModal}
            onClose={(e) => toggleModal(this, e)}
          >
            This is a modal dialog!
          </Modal>
        </div>
      </Router>
    );
  }
}

/*  BEGIN ROUTE ELEMENT DEFINITIONS */
// with the latest version of react router, you need to define the contents of the route as an element.  The following define functional components
// that will appear in the routes.

const NotFound = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the settings page
  if (!sessionStorage.getItem("token")) {
    console.log("LOGGED OUT");
    return (
      <div>
        <LoginForm login={props.login} />
      </div>
    );
  }
  return (
    <NotFoundPage />
  );
};

const Settings = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the settings page
  if (!sessionStorage.getItem("token")) {
    console.log("LOGGED OUT");
    return (
      <div>
        <LoginForm login={props.login} />
      </div>
    );
  }
  return (
      <Setting logout={props.logout} />
  );
};

const Friends = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the friends page
  if (!sessionStorage.getItem("token")) {
    console.log("LOGGED OUT");
    return (
      <div>
        <LoginForm login={props.login} />
      </div>
    );
  }
  return (
    <div>
      <FriendForm userid={sessionStorage.getItem("user")} />
      <FriendList userid={sessionStorage.getItem("user")} />
    </div>
  );
};

const Groups = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the groups form
  if (!sessionStorage.getItem("token")) {
    console.log("LOGGED OUT");
    return (
      <div>
        <LoginForm login={props.login} />
      </div>
    );
  }
  return (
    <div>
      <GroupList userid={sessionStorage.getItem("user")} />
    </div>
  );
};

const Posts = (props) => {
  console.log("RENDERING POSTS");
  console.log(typeof props.doRefreshPosts);

  console.log("TEST COMPLETE");

  // if the user is not logged in, show the login form.  Otherwise, show the post form
  if (!sessionStorage.getItem("token")) {
    console.log("LOGGED OUT");
    return (
      <div>
        {/* <p>Logins</p> */}
        <LoginForm login={props.login} />
      </div>
    );
  } else {
    console.log("LOGGED IN");
    return (
      <div>
        <PostForm testing={props.testing} refresh={props.apprefresh} />
      </div>
    );
  }
};

const User = (props) => {

  console.log("Working");
  if (!sessionStorage.getItem("token")) {
    console.log("LOGGED OUT");
    return (
      <div>
        <LoginForm login={props.login} />
      </div>
    );
  }
  else {
    return (
      <div>
        <ProfilePage viewingUser={props.viewingUser} viewOnly={props.viewOnly} refresh={props.apprefresh} />
      </div>
    );
  }
};


const Messages = (props) => {
  if (!sessionStorage.getItem("token")) {
    console.log("LOGGED OUT");
    return (
      <div>
        <LoginForm login={props.login} />
      </div>
    );
  } else {
    console.log("LOGGED IN");
    return (
      <div>
        <MessagesPage />
      </div>
    );
  }
};

const SignUp = (props) => {
  return (
    <div>
      <SignUpForm login={props.login} refresh={props.apprefresh} />
    </div>
  );
};
// const ForgetPassword = (props) => {
//   return (
//     <div>
//       <ForgetPassword refresh={props.apprefresh} />
//     </div>
//   );
// };

const Follower = (props) => {
  if (!sessionStorage.getItem("token")) {
    console.log("LOGGED OUT");
    return (
      <div>
        <LoginForm login={props.login} />
      </div>
    );
  } else {
    console.log("LOGGED IN");
    return (
      <div>
        <Followers refresh={props.apprefresh} />
      </div>
    );
  }
};

const SearchFollower = (props) => {
  if (!sessionStorage.getItem("token")) {
    console.log("LOGGED OUT");
    return (
      <div>
        <LoginForm login={props.login} />
      </div>
    );
  } else {
    console.log("LOGGED IN");
    return (
      <div>
        <FollowerSearch />
      </div>
    );
  }
};


const Creation = (props) => {
  if (!sessionStorage.getItem("token")) {
    console.log("LOGGED OUT");
    return (
      <div>
        <LoginForm login={props.login} />
      </div>
    );
  } else {
    console.log("LOGGED IN");
    return (
      <div>
        <Create />
      </div>
    );
  }
};

const BlockUsers = (props) => {
  if (!sessionStorage.getItem("token")) {
    console.log("LOGGED OUT");
    return (
      <div>
        <LoginForm login={props.login} />
      </div>
    );
  } else {
    console.log("LOGGED IN");
    return (
      <div>
        <BlockUser />
      </div>
    );
  }
};
/* END ROUTE ELEMENT DEFINITIONS */

// export the app for use in index.js
export default App;

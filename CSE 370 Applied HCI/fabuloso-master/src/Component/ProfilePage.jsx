import React, { Fragment } from "react";
import "../App.css";
import PostingList from "./PostingList.jsx";
import editIcon from "../assets/pencil.svg"
import { Link } from "react-router-dom";

export default class ProfilePage extends React.Component {
  static defaultProps = {
    viewOnly : false,
  };

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      responseMessage: "",
      tags: [],
      posts: [],
      isLoading: true,
      showTagForm: false,
      tagField: "",
      attributes: "",

      aboutMe: "",
      projects: "",

      //edit sections
      editName: false,
      editAboutMe: false,
      editProjects: false,

      firstNameField: "",
      lastNameField: "",
      aboutMeField: "",
      projectsField: "",

      //feedback after edit
      editAboutMeFeedback: "",
      editProjectsFeedback: "",

    };
    this.postListing = React.createRef();
  }

  // This is the function that will get called the first time that the component gets rendered.  This is where we load the current
  // values from the database via the API, and put them in the state so that they can be rendered to the screen.
  componentDidMount() {
    console.log("In profile");
    console.log(this.props);
    this.loadUser();
    this.setState({
     showTagForm: false
    })
  }

  loadUser() {
    // fetch the user data, and extract out the attributes to load and display
    const user =  this.props.viewOnly ? this.props.viewingUser.id : sessionStorage.getItem("user")
    fetch(
      process.env.REACT_APP_API_PATH +
        "/users/" +
        user,
      {
        method: "GET",
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
            this.setUserState(result);
          }
        },
        (error) => {
          alert("error!");
        }
      );
  }

  setUserState(result) {
    console.log(result);
    if (result.attributes) {
      this.setState({
        // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
        // try and make the form component uncontrolled, which plays havoc with react
        id: result.id || "",
        email: result.email || "",
        username: result.attributes.username || "",
        firstName: result.attributes.firstName || "",
        lastName: result.attributes.lastName || "",

        aboutMe: (result.attributes.aboutMe || "") == "" ? "Nothing yet" : result.attributes.aboutMe,
        projects: (result.attributes.projects || "") == "" ? "Nothing yet" : result.attributes.projects,

        firstNameField: result.attributes.firstName || "",
        lastNameField: result.attributes.lastName || "",
        aboutMeField: result.attributes.aboutMe || "",
        projectsField: result.attributes.projects || "",

        tags: result.attributes.tags || [],
        isLoading: false,
        attributes: result.attributes || {},
      });
    }
  }

  imageHandler = (e) => {
    this.loadUser()
    let imageUrl = "";
    const imageData = document.getElementById("input").files[0];
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
        let newAttributes = this.state.attributes
        newAttributes["profileImg"]= "https://webdev.cse.buffalo.edu" + result.path
        fetch(
          process.env.REACT_APP_API_PATH +
            "/users/" +
            sessionStorage.getItem("user"),
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
              attributes: newAttributes,
            }),
          }
        )
          .then((res) => res.json())
          .then((res) => {
          this.loadUser()
          });
      });
  };

  showPosts() {
    if (this.state.isLoading) {
      return "";
    }
    return (
      <div style={{display:"flex", justifyContent:"center", width:"100%"}}>
        <PostingList
        profilePosts={this.state.id}
        ref={this.postListing}
        refresh={this.props.refresh}
        type="postlist"
      />
      </div>
    );
  }

  changeTagHandler(e) {
    this.setState({
      tagField: e.target.value,
    });
  }

  submitTagHandler(e) {
    e.preventDefault();
    if (this.state.tagField != "") {
      this.addTags();
    }
  }

  async addTags() {
    let newAttributes = this.state.attributes;
    newAttributes.tags = [...this.state.tags, this.state.tagField];
    this.sendUserPatch(newAttributes);
    this.setState({
      tagField: "",
    });
  }

  async removeTag(tag) {
    let userID = sessionStorage.getItem("user");
    let newTags = this.state.tags;
    let index = newTags.indexOf(tag);
    if (index > -1) {
      newTags.splice(index, 1);
    }
    let newAttributes = this.state.attributes;
    newAttributes.tags = newTags;
    try {
      const postsResponse = await fetch(
        process.env.REACT_APP_API_PATH + "/users/" + userID,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            attributes: newAttributes,
          }),
        }
      );
      this.setState({
        tagField: "",
      });
      this.loadUser();
    } catch (e) {
      console.log(e);
    }
  }

  showTagForm() {
    if (this.state.showTagForm) {
      return (
        <form className="tag-form" onSubmit={this.submitTagHandler.bind(this)}>
          <label>Add a tag to show your skills or traits</label>
          <div className="tag-form-div">
          <input
            onChange={this.changeTagHandler.bind(this)}
            value={this.state.tagField}
            className="tag-input"
            placeholder="Add tag..."
          ></input>
          <button className="styled-button" style={{ margin: "10px", height: "50px" }}>
            <span className="styled-button-text">+</span>
          </button>
          </div>
        </form>
      );
    } else {
      return "";
    }
  }

  toggleTagForm() {
    this.setState({
      showTagForm: !this.state.showTagForm,
    });
  }

  toggleEditSection(section) {
    let state = {};
    state[section] = !this.state[section];
    this.setState(state);
  }

  onFieldChangeHandler = (field) => (e) => {
    const userInput = e.currentTarget.value;
    let state = {};
    state[field] = userInput;
    this.setState(state);
  };

  onSubmitSection = (section) => {
    //load user to get up to date attributes
    this.setState({
      isLoading: true,
    });
    this.loadUser();
    let newAttributes = this.state.attributes;
    switch (section) {
      case "editName":
        newAttributes.firstName = this.state.firstNameField;
        newAttributes.lastName = this.state.lastNameField;
        this.sendUserPatch(newAttributes);
        this.toggleEditSection(section);
        break;

      case "editAboutMe":
        newAttributes.aboutMe = this.state.aboutMeField;
        this.sendUserPatch(newAttributes);
        this.toggleEditSection(section);

      case "editProjects":
        newAttributes.projects = this.state.projectsField;
        this.sendUserPatch(newAttributes);
        this.toggleEditSection(section);
    }
  };

  async sendUserPatch(newAttributes) {
    try {
      let userID = sessionStorage.getItem("user");
      await fetch(process.env.REACT_APP_API_PATH + "/users/" + userID, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          attributes: newAttributes,
        }),
      });
      this.loadUser();
    } catch (e) {
      console.log(e);
    }
  }

  showFeedback() {
    return "wat";
  }

  showEditSection(section) {
    switch (section) {
      case "editName":
        if (this.state.editName) {
          return (
            <React.Fragment>
              <div style={{display:"flex", justifyContent:"center"}}>
                <input
                  className="editContactName"
                  onChange={this.onFieldChangeHandler("firstNameField")}
                  value={this.state.firstNameField}
                  placeholder="First Name"
                  name=""
                  id=""
                  cols={this.state.firstName.length}
                  rows="1"
                ></input>
                <input
                  className="editContactName"
                  onChange={this.onFieldChangeHandler("lastNameField")}
                  value={this.state.lastNameField}
                  placeholder="Last Name"
                  name=""
                  id=""
                  cols={this.state.lastName.length}
                  rows="1"
                ></input>
                <button
                  className="styled-button"
                  onClick={() => this.onSubmitSection("editName")}
                >
                  submit
                </button>
              </div>
            </React.Fragment>
          );
        }else{
          return (
            <Fragment>
              {this.state.firstName == "" ? "FirstName" : this.state.firstName} {this.state.lastName == "" ? "LastName" : this.state.lastName}
            </Fragment> 
          )
        }

      case "editAboutMe":
        if (this.state.editAboutMe) {
          return (
            <React.Fragment>
              <textarea
                className="editContactArea"
                onChange={this.onFieldChangeHandler("aboutMeField")}
                value={this.state.aboutMeField}
                placeholder="About me"
                name=""
                id=""
                cols="50"
                rows="15"
              ></textarea>

              <button
                className="styled-button"
                onClick={() => this.onSubmitSection("editAboutMe")}
              >
                submit
              </button>
            </React.Fragment>
          );
        } else {
          return (
          <div className="detailsContainer">
            <p className="profileDetails">{this.state.aboutMe}</p>
          </div>
          )
        }
      case "editProjects":
        if (this.state.editProjects) {
          return (
            <React.Fragment>
              <textarea
                className="editContactArea"
                onChange={this.onFieldChangeHandler("projectsField")}
                value={this.state.projectsField}
                placeholder="Projects"
                name=""
                id=""
                cols="50"
                rows="15"
              ></textarea>
              <button
                className="styled-button"
                onClick={() => this.onSubmitSection("editProjects")}
              >
                submit
              </button>
            </React.Fragment>
          );
        } else {
          return (
          <div className="detailsContainer">
            <p className="profileDetails">{this.state.projects}</p>
          </div>
          )
        }
      default:
        return "";
    }
  }

  showName() {
    var first = this.state.firstName ? this.state.firstName : "Firstname";
    var last = this.state.lastName ? this.state.lastName : "Lastname";
    return first + " " + last;
  }

  render() {
    return (
      <div className="profileMain" style={{ marginTop: "60px" }}>
        <div
          style={{
            background: "white",
            width: "55%",
            marginLeft: "10%",
            FlexGrow: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              width:"90%"
            }}
          >
            <h1
              style={{
                marginTop: "5%",
                color: "gray",
                fontSize: "80px",
                marginBottom: 0,
              }}
            >
              {this.showEditSection("editName")}
            </h1>
            {this.props.viewOnly == false ?
              <button
                onClick={() => this.toggleEditSection("editName")}
                className="editButtonContainer"
              >
                <img className="editButton" src={editIcon} />
              </button>
              :
              ""
            }
            {/*
                        <div className="circleButton">
                            <input type="image" style = {{height: 40, width: 40, borderRadius: 20, paddingTop: 5}}src = "https://www.seekpng.com/png/detail/202-2022672_edit-comments-edit-icon-png-circle.png"></input>
                        </div>
                      */}
          </div>
          <div style={{display:"flex", justifyContent:"center", width:"90%"}}>
            <span className="profileUserEmail">
                User: {this.state.username}
            </span>
          </div>

          {this.props.viewOnly == false ? 
          <Fragment>
          <button
            onClick={this.toggleTagForm.bind(this)}
            className="styled-button"
            style={{ margin: "0" }}
          >
            <span className="styled-button-text">
              {this.state.showTagForm ? "Done" : "Add a tag +"}
            </span>
          </button>
          {this.showTagForm()}
          </Fragment>
          :
          ""
          } 


          <div
            style={{
              display: "flex",
              marginTop: "30px",
              overflow: "auto",
              width: "90%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {this.state.tags.map((tag) => {
                return (
                  <div key={tag} style={{ display: "flex" }}>
                    <div
                      className="codeName"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        overflow: "hidden",
                        marginLeft: "5px",
                        marginRight: "0",
                      }}
                    >
                      <p className="codeNameText">{tag}</p>
                    </div>
                  {this.props.viewOnly == false ? 
                    <button
                      onClick={() => this.removeTag(tag)}
                      className="tag-remove-button"
                    >
                      <span>X</span>
                    </button>
                    :
                    ""
                  }
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{
              width: "90%",
              flexGrow: 1,
              textAlign: "left",
              display: "flex",
              flexDirection:"column",
              justifyContent:"center",
            }}
          >

            <div className="profileSectionHeader">
              <h2 className="profileSub">About Me</h2>
              {this.props.viewOnly == false ? 
              <button
                onClick={() => this.toggleEditSection("editAboutMe")}
                className="editButtonContainer"
              >
                <img className="editButton" src={editIcon} />
              </button>
              :
              ""
  }
            </div>
            {this.showEditSection("editAboutMe")}

            <div className="profileSectionHeader">
              <h2 className="profileSub">Projects</h2>
              {this.props.viewOnly == false ? 
              <button
                onClick={() => this.toggleEditSection("editProjects")}
                className="editButtonContainer"
              >
                <img className="editButton" src={editIcon} />
              </button>
              :
              ""
  }
            </div>
            {this.showEditSection("editProjects")}

            <h2 className="profileSub" style={{ textAlign: "center" }}>
              Posts
            </h2>
            {this.showPosts()}
          </div>
        </div>
        <div style={{ width: "35%" }}>
          <div className="img-holder">
            <img
              src={this.state.attributes.profileImg ? this.state.attributes.profileImg : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
              alt={this.state.attributes.username + "'s Profile Picture"}
              id="img"
              className="user-profile-pic"
              style={{ width: "300px", height: "300px" }}
            />
          </div>
          {this.props.viewOnly == false ? 
          <input
            type="file"
            accept="image/*"
            name="image-upload"
            id="input"
            onChange={this.imageHandler}
          />
          :
          ""
  }
          <br/>
          <br/>
          {!this.props.viewOnly ?
          <Link to={"/profile/" + this.state.id} >View how others see your profile.</Link> 
          : ""}

          {this.props.viewOnly && (sessionStorage.getItem("user") == this.props.viewingUser.id)
           ? <Link to={"/profile/"} >Edit Your Profile.</Link> 
           : ""}
        </div>
      </div>
    );
  }
}

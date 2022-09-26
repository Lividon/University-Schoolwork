import React from "react";
import "../Dustin.css";
import "../pika.css";
import "../App.css";
import { Link } from "react-router-dom"
import "../Brandon.css";

export default class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          id: "",
          username: "",
          firstName: "",
          lastName: "",

          firstNameField: "",
          lastNameField: "",

          attributes: {},

          isLoading: true,
        };
      }

    // profile image code
    state = {
        profileImg:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    };
    imageHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
        if (reader.readyState === 2) {
            this.setState({ profileImg: reader.result });
        }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

      componentDidMount() {
        this.loadUser()
      }

      setUserState(result){
        console.log(result);
          if (result.attributes){
          this.setState({
            // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
            // try and make the form component uncontrolled, which plays havoc with react
            id: result.id || "",
            email: result.email || "",
            username: result.attributes.username || "",
            firstName: result.attributes.firstName || "",
            lastName: result.attributes.lastName || "",
  
            firstNameField: result.attributes.firstName || "",
            lastNameField: result.attributes.lastName || "",

            attributes: result.attributes || {},

            isLoading:false,
          });
        }
      }

      loadUser () {
        // fetch the user data, and extract out the attributes to load and display
        fetch(process.env.REACT_APP_API_PATH+"/users/"+sessionStorage.getItem("user"), {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("token")
          }
        })
          .then(res => res.json())
          .then(
            result => {
              if (result) {
                this.setUserState(result)
              }
            },
            error => {
              alert("error!");
            }
          );
      }

      onFieldChangeHandler = (field) => (e) => {
        const userInput = e.currentTarget.value;
        let state = {}
        state[field] = userInput
        this.setState(state)
      }

      submitHandler(){
        this.setState({
            isLoading: true
        })
        this.loadUser()
        let newAttributes = this.state.attributes
        newAttributes.firstName = this.state.firstNameField
        newAttributes.lastName = this.state.lastNameField
        this.sendUserPatch(newAttributes)
    }

      async sendUserPatch(newAttributes){
        try {
            console.log("HEHHSKHRLFDJS")
          let userID = sessionStorage.getItem("user")
          await fetch(process.env.REACT_APP_API_PATH+"/users/" + userID,
           {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+ sessionStorage.getItem("token")
            },
            body: JSON.stringify({
              attributes: newAttributes
            }),
          })
          window.location.assign("https://webdev.cse.buffalo.edu/hci/teams/fabuloso/profile")
        }catch(e){
          console.log(e)
        }
      }

      


    render() {
        if(this.state.isLoading){
            return ""
        }
        const { profileImg } = this.state;
        return (
            
            <div className="MainCreatePage">
                <form className="Create-Profile-Form">
                    <label className="Title-Form">Get Started</label>
                    <label className="Section-Title">Your Name</label>
                    <label className="Label-Create-Form">First Name </label>
                    <input
                        placeholder="First Name"
                        alt="First Name Input"
                        className="Input-Box"
                        type="text"
                        onChange={this.onFieldChangeHandler("firstNameField")}
                        value={this.state.firstNameField}
                    />
                    <label className="Label-Create-Form">Last Name </label>
                    <input
                        placeholder="Last Name"
                        alt="Last Name Input"
                        className="Input-Box"
                        type="text"
                        onChange={this.onFieldChangeHandler("lastNameField")}
                        value={this.state.lastNameField}
                    />

                    {/*
                    <label className="Label-Create-Form">About Me... </label>
                    <input
                        placeholder="Talk about yourself...."
                        alt="About Me Input"
                        className="Input-Box"
                        type="text"
                    />

                    <label className="Section-Title">Contact Information</label>
                    <label className="Label-Create-Form">Discord Username</label>
                    <div className="rowContainer">
                        <input
                            placeholder="Awsomecoder"
                            alt="Discord Input"
                            className="Input-Box"
                            type="text"
                        />
                        <div className="Discord-Pound">#</div>
                        <input
                            placeholder="1923"
                            alt="Discord Number ID Input"
                            className="Input-Box"
                            type="text"
                        />
                    </div>
                    <label className="Label-Create-Form">Add Image</label>
                    */}
                    <div className="createButtonContainer">
                    <button className="submitCreate" id="styled-button" type="button" onClick={this.submitHandler.bind(this)}>Submit</button>
                    </div>
                    <div className="skip" >
                    <Link to="/">
                        skip
                    </Link>
                    </div>
                </form>
                </div>
    );
  }
  
}


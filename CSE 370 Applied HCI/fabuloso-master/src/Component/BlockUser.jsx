// import { ThermostatOutlined } from "@mui/icons-material";
import React from "react";
import "../App.css";
import "../Dustin.css";
import "../Responsive_CSS/blockR.css"
import Autocomplete from "./Autocomplete";
export default class BlockUser extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          //users from database for autocomplete suggestsions
          users: [],
          selectedId: -1,
          blockInput: "",
          unblockInput: "",
          //blocked users
          blockedUserConnections : [],
          blockedUsernames : [],
          feedback: "",
          loadingBlockedUsers: true,
          blockError: false,
          blockSuccess: false,
          unblockError: false,
          unblockSuccess: false,
          username: "",
          attributes: {},
          isLoading: true,
        };
      }

    async componentDidMount() {
        try {
            await this.getUsername()
            const blockedConnections = await this.getBlockedUsers()
            const blockedUsernames = blockedConnections.map(user=> user.toUser.attributes.username)
            const usersResponse = await fetch(process.env.REACT_APP_API_PATH + "/users/", {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
            })
            const usersJson = await usersResponse.json();
            //let names = result[0];
            let names = [];
            usersJson[0].forEach((element) => {
                if ((element.attributes?.username && element.id != sessionStorage.getItem("user")) && !blockedUsernames.includes(element.attributes.username) ) {
                    names.push(element);
                }
            });

            this.setState({
                users: names,
            });
            console.log(names);
        }catch (error){
            console.log(error)
        }
    }


    selectAutocomplete(selectedId) {
        this.setState({
            selectedId: selectedId
        })
    }

    async getBlockedUsers() {
        try{
            const userResponse = await fetch(process.env.REACT_APP_API_PATH + "/connections?fromUserID=" + sessionStorage.getItem("user") + "&attributes=%7B%0A%20%20%22path%22%3A%20%22type%22%2C%0A%20%20%22equals%22%3A%20%22block%22%0A%7D",{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                }
            });
            const userJson = await userResponse.json()
            const blocked = userJson[0]
            this.setState({
                blockedUserConnections: blocked,
                blockedUsernames: blocked.map(user => user.toUser.attributes.username),
                loadingBlockedUsers: false,
                isLoading: false,
            })
            return blocked
        }catch(e) {
            console.log(e)
        }
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

    changeInputHandler(input, form) {
        if (form == "block"){
            this.setState({
                blockInput : input
            })
        }else if (form == "unblock"){
            this.setState({
                unblockInput : input
            })
        }
    }

    blockUserChangeHandler = (event) => {
        this.setState({
            blockUser: event.target.value,
        })
    }


    async blockUserHandler(e) {
        this.getBlockedUsers()
        console.log(this.state.username, this.state.blockInput)
        e.preventDefault();
        const toUserID = await this.getUserID(this.state.blockInput)
        const alreadyBlocked = await this.checkAlreadyBlocked(toUserID)
        if (alreadyBlocked) {
            this.setState({
                blockError: true,
                feedback: "User is already blocked"
            })
        }else if (this.state.username === this.state.blockInput){
            this.setState({
                blockError: true,
                feedback: "You can't block yourself dummy"
            })
        }else if (this.state.users.filter(user => user.attributes.username == this.state.blockInput).length == 0){
            this.setState({
                blockError: true,
                feedback: "User not found"
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
                        attributes: { type: "block", status: "active" },
                    })
                });
                this.setState({
                    blockSuccess: true,
                    blockError: false,
                })
                this.getBlockedUsers()

            }catch(e){
                this.setState({
                    blockError: true,
                    feedback: "Sorry, something went wrong on our end."
                })
            }
        }
    }

    async unblockUserHandler(e) {
        this.getBlockedUsers()
        console.log(this.state.username, this.state.unblockInput)
        e.preventDefault();
        const notBlocked = !this.state.blockedUsernames.includes(this.state.unblockInput)
        if (notBlocked) {
            this.setState({
                unblockError: true,
                feedback: "User is not currently blocked"
            })
        }else{
            const connectionToDelete = this.state.blockedUserConnections.map(connection => {
                if (connection.toUser.attributes.username == this.state.unblockInput){
                    return connection
                }
            })[0]
            try{
                await fetch(process.env.REACT_APP_API_PATH + "/connections/" + connectionToDelete.id, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                    },
                });
                this.setState({
                    unblockSuccess: true,
                })
                this.getBlockedUsers()

            }catch(e){
                this.setState({
                    unblockError: true,
                    feedback: "Sorry, something went wrong on our end."
                })
            }
        }
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

    async checkAlreadyBlocked(toUserID){
        try{
            const url = process.env.REACT_APP_API_PATH + "/connections?fromUserID=" + sessionStorage.getItem("user") + "&toUserID=" + toUserID + "&attributes=%7B%0A%20%20%22path%22%3A%20%22type%22%2C%0A%20%20%22equals%22%3A%20%22block%22%0A%7D"
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

    feedbackHandler(form) {
        if(form == "block"){
            if (this.state.blockError){
            return (
                <span class="error-message">
                <br />
                {this.state.feedback}
                </span>
            )
            }else if (this.state.blockSuccess){
                return(
                <span class="error-message">
                    <br />
                    User successfully blocked
                </span>
                )
            }else{
                return (                
                <span class="error-message" style={{color:"transparent"}}>
                <br />
                {"error"}
                </span>)
            }
        }else{
            if (this.state.unblockError){
                return (
                    <span class="error-message">
                    <br />
                    {this.state.feedback}
                    </span>
                )
            }else if (this.state.unblockSuccess){
                return(
                <span class="error-message">
                    <br />
                    User successfully unblocked
                </span>
                )
            }else{
                return(
                <span class="error-message" style={{color:"transparent"}}>
                <br />
                {"error"}
                </span>
                )
            }
        }
    }

    renderBlockedUsers(){
        return(
            <div style={{overflowWrap:"break-word", overflow:"auto"}}>
                <h2 style={{marginTop:"0", paddingTop:"0"}}>Blocked Users: </h2>
                <p>{this.state.loadingBlockedUsers ? "" : this.state.blockedUsernames.map(username => " " + username).toString()}</p>
            </div>
        )
    }


    render(){
        if (this.state.isLoading){
            return ""
        }
        return(
            <div className="block-user-container" style={{marginTop:"120px"}}>
                <form className="block-form" onSubmit={this.blockUserHandler.bind(this)}>
                    <h1>Block a User</h1>
                    <label>Search User to Block</label>
                    <br></br>
                    {this.feedbackHandler("block")}
                    <div className="block-input-and-button">
                        <div className="block-input-container">
                        {/*<input className="block-users-input" onChange={this.searchUserChangeHandler} type="text" value={this.state.blockUser} placeholder="Block a user . . ."/>*/}
                        <Autocomplete inputClass="block-input"
                        placeholder="Block a user . . . "
                        form="block"
                        suggestions = {this.state.users} 
                        changeInputHandler={this.changeInputHandler.bind(this)} 
                        selectAutocomplete = {(e) => this.selectAutocomplete(e)}/>
                        </div>
                        <div className="block-button-container">
                            <button className="block-button">
                                <span id="block-input-text">Block</span>
                            </button>
                        </div>
                    </div>
                    {this.renderBlockedUsers()}
                </form>

                <form className="blockform" onSubmit={this.unblockUserHandler.bind(this)}>
                    <h1>Unblock a User</h1>
                    <label>Search User to Unblock</label>
                    <br/>
                    {this.feedbackHandler("unblock")}
                    <div className="block-input-and-button">
                        <div className="block-input-container">
                        {/*<input className="block-users-input" onChange={this.searchUserChangeHandler} type="text" value={this.state.blockUser} placeholder="Block a user . . ."/>*/}
                        <Autocomplete inputClass="block-input" 
                        placeholder="Unblock a user . . . "
                        form="unblock"
                        suggestions = {this.state.blockedUserConnections.map(connection => connection.toUser)} 
                        changeInputHandler={this.changeInputHandler.bind(this)} 
                        selectAutocomplete = {(e) => this.selectAutocomplete(e)}
                        />
                        </div>
                        <div className="block-button-container">
                            <button id="block-search-button" className="block-button">
                                <span id="block-input-text">Unblock</span>
                            </button>
                        </div>
                    </div>
                    {this.renderBlockedUsers()}
                </form>
            </div>
        )
    }
}
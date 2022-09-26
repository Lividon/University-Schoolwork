import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import ubLogo from "../assets/ub_logo.png";


export default class MessagesChatTop extends React.Component {
    constructor(props) {
        super(props)
    }

    render(){
        console.log(this.props)
        var name = ""
        var user = {}
        var attributes = {}
        if (this.props.messageUsers.length != 0){
            name = this.props.messageUsers[this.props.activeMessage].attributes.username
            user = this.props.messageUsers[this.props.activeMessage]
            attributes = user.attributes
        }


        return(
            /* Chatbox top */

            <div className="messages-chat-top">
                <Link to={"/profile/" + user.id} style={{textDecoration:"none", color:"black"}}>
                <img
                alt={name + " Profile Picture"}
                src={attributes.profileImg ? attributes.profileImg : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                className="messages-pic"
                title="User_Picture"
                />
                </Link>
                
                <Link to={"/profile/" + user.id} style={{textDecoration:"none", color:"black"}}>
               <h2 className="messages-chat-other">{name}</h2> 
               </Link>
               
            </div>
            
        );
    }
}
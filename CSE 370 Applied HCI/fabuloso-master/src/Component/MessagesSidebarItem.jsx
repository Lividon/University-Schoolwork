import React from "react";
import "../App.css";
import ubLogo from "../assets/ub_logo.png";


export default class MessagesSidebarItem extends React.Component {
    constructor(props){
        super(props);
    };

    activeUserHandler(){
        if (!this.props.active){
            this.props.onUpdateActiveMessage(this.props.index)
        }
    }

    render(){
        const gray= "#F0F0F0"
        var backgroundColor = this.props.active ? gray : "white"

        return(
            /* Sidebar Item */
            <button className="messages-item" onClick={this.activeUserHandler.bind(this)} style={{"background" : backgroundColor}}>
               
                <div className="messages-img-user">
                    <img alt={this.props.user.attributes.username + " Profile Picture"} src={this.props.user.attributes.profileImg ? this.props.user.attributes.profileImg : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} className="messages-pic" title="User_Picture"/>
                    <div style={{display:"flex", alignItems:"center"}}>
                        <h3 className="messages-item-user">{this.props.user.attributes.username}</h3> 
                        {/*<p className="messages-item-last">{this.props.lastMessage}</p>*/}
                    </div>
                </div>
                <div>
                    {/*<p className="messages-item-time"><small>5h</small></p>*/}
                </div>

            </button>
        );
    }
}
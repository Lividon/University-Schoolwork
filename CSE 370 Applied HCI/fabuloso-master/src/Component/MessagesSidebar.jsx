import React from "react";
import "../App.css";
import MessagesSearchUser from "./MessagesSearchUser";
import MessagesSidebarItem from "./MessagesSidebarItem";


export default class MessagesSidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // temp names
            // names: ["Andy", "Ashley", "Brandon", "Dustin", "Pika", "User1", "User2", "User3", "User4", "User 5", "User 6"],
            // temp last messages
            lastMessage: "This is great ",
        };
    }

    render(){
        var counter = -1
        return(
            /* Sidebar */
            <div className="messages-sidebar-container">
                <div className= "messages-sidebar-top">
                        <h1>Messages</h1>
                </div>
                <div className="messages-sidebar-list">
                    <ol>
                        <li>
                            <MessagesSearchUser
                            onAddUser={this.props.addUserHandler}
                            messageUsers={this.props.messageUsers}
                            />
                        </li>

                        {/*First item is active*/}
                        {this.props.messageUsers.map((user) => {
                            counter += 1
                            return(
                            <li key={counter} ><MessagesSidebarItem
                              index={counter}
                              user={user}
                              lastMessage={this.state.lastMessage}
                              active={this.props.activeMessage === counter ? true : false}
                              onUpdateActiveMessage={this.props.updateActiveMessage}
                              id={user.id}
                            /> 
                            </li>
                            )
                        })}
                    </ol>
                </div>
            </div>
        );
    };
}
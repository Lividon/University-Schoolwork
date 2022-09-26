import React from "react";
import "../App.css";

export default class MessagesChatInput extends React.Component {
    // Creates new user message
    // Calls /posts API to create new post with:
    // recipientUserID : User
    // attributes:
    // "directMessage": true
    constructor(props){
        super(props)
        this.state = {
            chatInput: ""
        }
    }

    // keeps the chat state as it is typed
    chatInputChangeHandler = (event) => {
        this.setState({
          chatInput: event.target.value,
        });
      };

    sendHandler(e) {
        e.preventDefault();
        if (this.props.messagesList == -1){
            console.log("messagesList not loaded yet")
        }else if (this.props.messagesList.length == 0){
            this.props.onSendNew(this.state.chatInput)
        }else {
            this.props.onSend(this.state.chatInput)
        }
        this.setState({
            chatInput: ""
        })
    }

    render(){
        return(
            <form onSubmit={this.sendHandler.bind(this)} className="messages-chat-input-container">
                <div className="messages-chat-input">
                    <input onChange={this.chatInputChangeHandler} value={this.state.chatInput} placeholder="Type a message"></input>
                    <button type="submit" id="messages-send" className="messages-button">
                        <span id="messages-send-text">Send</span>
                    </button>
                </div>
            </form>
  
        );
    }
}
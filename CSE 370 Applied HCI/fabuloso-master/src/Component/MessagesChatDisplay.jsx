import React from "react";
import "../App.css";
import MessagesChatBubble from "./MessagesChatBubble";

export default class MessagesChatDisplay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            updated : 0,
        }
        this.scrollToBottom = this.scrollToBottom.bind(this)
    }

                    // {
            //     "id": 10,
            //     "authorID": 62,
            //     "created": "2022-03-31T07:00:54.559Z",
            //     "updated": "2022-03-31T07:00:54.559Z",
            //     "content": "actual message",
            //     "parentID": 7,
            //     "recipientUserID": null,
            //     "recipientGroupID": null,
            //     "attributes": null,
            //     "author": {
            //       "id": 62,
            //       "email": "userMsg@example.com",
            //       "attributes": null
            //     },
            //     "recipientUser": null,
            //     "recipientGroup": null,
            //     "reactions": [],
            //     "_count": {
            //       "children": 0
            //     }
            //   }


    componentDidMount() {
        //setTimeout(this.scrollToBottom,500)
        this.props.scrollToBottomHandler(this.messagesEnd)
        setTimeout(this.props.pollingFunc,100)
        setInterval(this.props.pollingFunc, 3000)
    }

    componentDidUpdate() {
    }
    
    scrollToBottom(){
        this.messagesEnd?.scrollIntoView({behavior: "smooth"});
    }

    render(){
        return(
            /* Chatbox*/
            
            <div className="messages-chat-list">
                <ol>
                    {this.props.messagesList.map((msg) => {
                        return(
                        <li key={msg["id"]}> 
                            <MessagesChatBubble
                              author={msg["authorID"]}
                              msg={msg["content"]}
                              time={msg["created"]}
                            /> 
                        </li>
                        )
                    })}

                    <li>
                        <div ref={el => { this.messagesEnd = el; }}/>
                    </li>
                </ol>
            </div>
            
            
        );
    }
}
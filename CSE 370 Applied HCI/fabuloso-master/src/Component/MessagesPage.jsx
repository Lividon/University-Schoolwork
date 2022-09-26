import React from "react";
import "../App.css";
import MessagesChatInput from "./MessagesChatInput";
import MessagesChatTop from "./MessagesChatTop";
import MessagesSidebar from "./MessagesSidebar";
import MessagesChatDisplay from "./MessagesChatDisplay";


// Messages between two users will create two posts in the API
// One for each user, so one can delete the chat, the other still keeps the chat
// Each actual message will be a two messageComment with parent to the two messagePost

export default class MessagesPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = ({
            // list of user messages open
            messageUsers: [],
            newMessageUsers: [],
            // active user message being index of messageUsers
            activeMessage: 0,
            activeUser: "",
            // list of messages between users
            // message object = {au:user, recipient:user, content:user}
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
            messagesList: [],
            isLoading: true,
            chatLoading: true,
        });
    };



    // async getUsername(){
    //     let userID = sessionStorage.getItem("user")
    //     try {
    //         const userSearched = await fetch(`http://webdev.cse.buffalo.edu/hci/api/api/fabuloso/users/${userID}`);
    //         const userJson = await userSearched.json();
    //         const userEmail = userJson[0][0].email;

    //     } catch (error) {
    //         // TODO: display inline error user doesn't exist
    //         console.log(error)
    //     }
    // };

    async componentDidMount() {
        try {
            await this.getMessageUsers()
            await this.getChatMessages()
            this.state.scrollTo.scrollIntoView({behavior: "smooth"})
        } catch (error) {
            console.log(error)
        }
    }


    // create a new user message item
    addUserHandler(user) {
        this.setState({
            newMessageUsers: [
                {
                    "id": user.id,
                    "email": user.email,
                    "attributes": {
                      "username": user.attributes.username
                    }
                }
            ],
            activeMessage: 0,
            messagesList: [],
        },
            () => {
                this.getMessageUsers()
            }
        )
    };

    //update active message
    updateActiveMessage(index) {
        this.setState({
            activeMessage: index,
            chatLoading: true
        },
            () => {
                this.getChatMessages()
            })
    };

    // get list of users with messages on the sidebar
    async getMessageUsers() {
        let userID = sessionStorage.getItem("user")
        try {
            const messagePostsResponse = await fetch(process.env.REACT_APP_API_PATH + `/posts?authorID=${userID}&attributes=%7B%0A%20%20%22path%22%3A%20%22isDirectMessage%22%2C%0A%20%20%22equals%22%3A%20true%0A%7D&sort=newest`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                    }
                });
            const messagePosts = await messagePostsResponse.json()
            console.log(messagePosts)
            const users = messagePosts[0].map(post => {
                return post["recipientUser"]
            })
            this.setState({
                messageUsers: [...this.state.newMessageUsers, ...users],
                isLoading: false
            })
        } catch (error) {
            // TODO: display inline error 
            console.log(error)
        }
    }


    // display chat messages
    async getChatMessages() {
        if (this.state.messageUsers.length == 0) {
            console.log("no messages")
            this.setState({
                chatLoading: false
            })
        } else {
            let userID = sessionStorage.getItem("user")
            let recipientID = this.state.messageUsers[this.state.activeMessage].id
            try {
                const messagePostReponse = await fetch(
                    `https://webdev.cse.buffalo.edu/hci/api/api/fabuloso/posts?authorID=${userID}&recipientUserID=${recipientID}`,
                    {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                        }
                    });
                const messagePost = await messagePostReponse.json()
                if (messagePost[1] !== 0) {
                    const messageCommentsResponse = await fetch(`https://webdev.cse.buffalo.edu/hci/api/api/fabuloso/posts?parentID=${messagePost[0][0]["id"]}&sort=oldest`,
                        {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                            }
                        });
                    const messageComments = await messageCommentsResponse.json()
                    if (this.state.messagesList.length != messageComments[0].length) {
                        this.setState({
                            messagesList: messageComments[0],
                            chatLoading: false
                        })
                    } else {
                        this.setState({
                            chatLoading: false
                        })
                    }
                } else {
                    this.setState({
                        messagesList: [],
                        chatLoading: false
                    })
                }
            } catch (error) {
                // TODO: display inline error 
                console.log(error)
            }
        }
    }
    async getDirectMessage(authorID, recipientUserID) {
        try {
            const url = `https://webdev.cse.buffalo.edu/hci/api/api/fabuloso/posts?authorID=${authorID}&recipientUserID=${recipientUserID}&sort=oldest`
            const parentMessage = await fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                },
            })
            const parentMessageJson = await parentMessage.json()
            return parentMessageJson[0][0]["id"]
        } catch (error) {
            // TODO: display inline error 
            console.log(error)
        }
    }


    async createDirectMessage(input) {
        // create separate chats for each user
        // Creat Parent user to other
        await fetch("https://webdev.cse.buffalo.edu/hci/api/api/fabuloso/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            },
            body: JSON.stringify({
                authorID: sessionStorage.getItem("user"),
                content: "DIRECT MESSAGE",
                recipientUserID: this.state.messageUsers[this.state.activeMessage].id,
                attributes: {
                    isDirectMessage: true
                }
            })
        });
        // Create parent other to user
        await fetch("https://webdev.cse.buffalo.edu/hci/api/api/fabuloso/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            },
            body: JSON.stringify({
                authorID: this.state.messageUsers[this.state.activeMessage].id,
                content: "DIRECT MESSAGE",
                recipientUserID: sessionStorage.getItem("user"),
                attributes: {
                    isDirectMessage: true
                }
            })
        });
        this.setState({
            newMessageUsers: []
        })
        this.sendMessage(input)
    }

    async sendMessage(input) {
        // Create comment other to user
        await fetch("https://webdev.cse.buffalo.edu/hci/api/api/fabuloso/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            },
            body: JSON.stringify({
                authorID: sessionStorage.getItem("user"),
                content: input,
                parentID: await this.getDirectMessage(sessionStorage.getItem("user"), this.state.messageUsers[this.state.activeMessage].id)
            })
        })
        // Create comment user to other
        await fetch("https://webdev.cse.buffalo.edu/hci/api/api/fabuloso/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            },
            body: JSON.stringify({
                authorID: sessionStorage.getItem("user"),
                content: input,
                parentID: await this.getDirectMessage(this.state.messageUsers[this.state.activeMessage].id, sessionStorage.getItem("user"))
            })
        })
    }

    // update messages after interval
    polling = () => {
        if (sessionStorage.getItem("token") !== "" && sessionStorage.getItem("user") !== -1 && sessionStorage.getItem("token") !== undefined && sessionStorage.getItem("user") !== undefined) {
            this.setState({
                isLoading: true
            },
                () => {
                    this.getChatMessages()
                    this.getMessageUsers()
                })
        }
    }

    scrollToBottomHandler(element){
        this.setState({
            scrollTo: element
        })
    }


    render() {
        return (
            <div className="messages-container">
                <div className="messages-main">
                    <MessagesSidebar
                        messageUsers={this.state.messageUsers}
                        activeMessage={this.state.activeMessage}
                        addUserHandler={this.addUserHandler.bind(this)}
                        updateActiveMessage={this.updateActiveMessage.bind(this)}
                    />
                    <div className="messages-chat">
                        <MessagesChatTop
                            messageUsers={this.state.messageUsers}
                            activeMessage={this.state.activeMessage}
                        />
                        <MessagesChatDisplay
                            messagesList={this.state.messagesList}
                            pollingFunc={this.polling.bind(this)}
                            scrollToBottomHandler={this.scrollToBottomHandler.bind(this)}
                        />
                        <MessagesChatInput
                            messagesList={this.state.chatLoading ? -1 : this.state.messagesList}
                            onSendNew={this.createDirectMessage.bind(this)}
                            onSend={this.sendMessage.bind(this)}
                        />
                    </div>
                </div>
            </div>

        );
    }
}
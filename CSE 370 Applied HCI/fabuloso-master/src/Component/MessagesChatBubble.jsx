import React from "react";
import "../App.css";

export default class MessagesChatBubble extends React.Component {
    constructor(props) {
        super(props)
    }

    showTime(){
        return (
            <div className="messages-chat-time">
                <span>{String(new Date(this.props.time)).split("GMT")[0]}</span>
            </div>
        )
    }
    parseIsoDatetime(dtstr) {
        var dt = dtstr.split(/[: T-]/).map(parseFloat);
        return new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0);
    }

    
    showOtherTime(){
        if (this.props.author != sessionStorage.getItem("user")){
            return this.showTime()
        }else{
            return ""
        }
    }

    showUserTime(){
        if (this.props.author == sessionStorage.getItem("user")){
            return this.showTime()
        }else{
            return ""
        }
    }

    render(){
        let gray = "#F0F0F0";
        let gray2 = "#C4C4C4";
        let keppel = "#A1CEC9";
        let keppel2 = "#45A69A"
        var otherUserStyle = {"background" : {"background" : gray}, "align" : {"justifyCoontent" : "flex-start"}};
        var selfUserStyle = {"background" : {"background" : keppel}, "align" : {"justifyContent" : "flex-end"}};
        var otherTimeStyle = {}
        var selfTimeStyle = {}
        // If other user's message align text left and background gray
        var msgStyle = {}
        var timeStyle = {}
        const userIsAuthor = this.props.author == sessionStorage.getItem("user") ? true : false
        if (userIsAuthor){
            msgStyle = selfUserStyle;
            timeStyle = selfTimeStyle;
        } else{
            msgStyle = otherUserStyle;
            timeStyle = otherTimeStyle;
        }

        return(
            /* Chat Bubble*/
            <div className="messages-chat-bubble-container" style ={msgStyle["align"]}>
                <div style={{flexDirection:"column"}}>
                    {this.showUserTime()}
                    {this.showOtherTime()}
                    <div style={{display:"flex", justifyContent:userIsAuthor ? "flex-end" : "flex-start"}}>
                        <div className="messages-chat-bubble" style={msgStyle["background"]}>
                            <p> {this.props.msg} </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
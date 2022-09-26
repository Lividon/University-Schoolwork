import React from "react";
import "../Dustin.css";

export default class PicturePost extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="post">

                <div className="postUser">
                    <img className="profilePicturePost" scr=""></img>
                    <h3 className="usernamePost"> Name</h3>
                </div>

                <div className="postDiscriptionConatiner">
                    <p className="postDiscription">
                        A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet I feel that I never was a greater artist than now.
                    </p>
                </div>

                <div className="contentPictures">
                    <img className="Pictures" src="https://i.ytimg.com/vi/V5yv5TNpiLE/maxresdefault.jpg" />
                    <img className="Pictures" src="https://ssiddique.info/wp-content/uploads/2021/01/Computer-science-projects.jpg" />
                    <img className="Pictures" src="https://www.edrawsoft.com/templates/images/computer-science-project-mind-map.png" />
                    <img className="Pictures" src="https://i.ytimg.com/vi/V5yv5TNpiLE/maxresdefault.jpg" />
                    <img className="Pictures" src="https://ssiddique.info/wp-content/uploads/2021/01/Computer-science-projects.jpg" />
                    <img className="Pictures" src="https://www.edrawsoft.com/templates/images/computer-science-project-mind-map.png" />
                </div>
                <div className="rowContainer">
                    <div className="button" id="likeButton"><img src="" />Like</div>
                    <div className="button" id="shareButton">Share</div>
                </div>
                <div className="postCommentsContainer">
                    <div className="columnContainer">
                        <div className="rowContainer">
                            <b className="userComment">username:</b> <div className="commentBox">comment</div>
                        </div>
                        <div className="rowContainer">
                            <b className="userComment">username:</b> <div className="commentBox">comment</div>
                        </div>
                        <div className="rowContainer">
                            <b className="userComment">username:</b> <div className="commentBox">fdasjflkjdslkf lsdkdkjsafknsdk fs fk sd k fn sdkfsdkjnf ksdfkj sdfkjh skfh sdh fsdkjhf ksjj flsdjf lsadjflsdj ;fjsd lfjsdl fsdjlkf jsdlj f</div>
                        </div>
                        <div className="rowContainer">
                            <b className="userComment">username:</b> <div className="commentBox">dasjdkfjdaslkfgnlkasdngls fsdj gl sdnl gsjdglkjasdl gkjldsk gjlaskdjdg ldsjg;lasdjgl ksdjlgk jadlgj laks</div>
                        </div>
                    </div>

                    <div className="rowContainer">
                        <input placeholder="Write a comment..." className="commentInput"></input>
                        <div className="button" id="commentButton">Comment</div>
                    </div>
                </div>
            </div>
        );
    }
}
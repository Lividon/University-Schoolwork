import React, { useState, useRef } from "react";
import "../pika.css";
import { Link } from "react-router-dom";

export default function PicPopWindow() {
  const [current, update] = useState(false);
  const [selectedImage, setSelectedImage] = useState();

  const toggleUpdate = () => {
    update(!current);
  };
  if (current) {
    document.body.classList.add("active-modl");
  } else {
    document.body.classList.remove("active-modl");
  }

  //upload image
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // create separate chats for each user
  // Creat Parent user to other
  // fetch("http://webdev.cse.buffalo.edu/hci/api/api/fabuloso/posts", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: "Bearer " + sessionStorage.getItem("token"),
  //   },
  //   body: JSON.stringify({
  //     authorID: sessionStorage.getItem("user"),
  //     content: "DIRECT MESSAGE",
  //     recipientUserID:
  //       this.state.messageUsers[this.state.activeMessage]["userID"],
  //     attributes: {
  //       isDirectMessage: true,
  //     },
  //   }),
  // });

  return (
    <>
      <div className="postSection">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>{" "}
        {/* <form> */}
        <input
          className="PostInput"
          type="text"
          placeholder="What do you want to talk about"
        ></input>
        <button
          onClick={toggleUpdate}
          //   className="btn-modal"
          className="fa fa-camera"
        >
          Image
        </button>
        <button
          //   onClick={toggleUpdate}
          className="btn-modal"
          //   className="LoginButton"
        >
          Post
        </button>
      </div>
      {/* </form> */}
      {current && (
        <div className="modal">
          <div
            className="
overlay"
          ></div>
          <div className="modal-content">
            <button className="close-modal" onClick={toggleUpdate}>
              {" "}
              Close
            </button>
            <input
              className="PostInput"
              type="text"
              placeholder="What do you want to talk about"
            ></input>
            <h2>Upload Picturess</h2>

            <input accept="image/*" type="file" onChange={imageChange}></input>
            {selectedImage && (
              <div className="preview">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  className="uploadImage"
                  alt="Thumb"
                />
                {/* <button onClick={removeSelectedImage} style={styles.delete}>
                  Remove This Image
                </button> */}
              </div>
            )}

            <button className="btn-modal">Post</button>
          </div>
        </div>
      )}
    </>
  );
}

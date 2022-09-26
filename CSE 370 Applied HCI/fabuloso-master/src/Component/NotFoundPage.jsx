import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import "../App.css";


export default class NotFoundPage extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return(
        <Fragment>
            <div style={{marginTop:"60px"}}>
            <h1>Sorry, this page is not found, please try another.</h1>
            <Link to="/">Return to Homepage</Link>
            </div>
        </Fragment>
    )
  }
}

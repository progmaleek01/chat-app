import React, { Component } from "react";
import '../Styles/Welcome.css'

export class Welcome extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <div className='viewWelcomeBoard'>
        <img className='avatarWelcome' src={this.props.currentUserPhoto ? this.props.currentUserPhoto : "https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/nopic.jpg?alt=media&token=e941ad65-265e-4671-8f7f-190510ac1644"}  alt='' />
        <span className='textTitleWelcome'>{`Welcome, ${this.props.currentUserName}`}</span>
        <span className='textDescriptionWelcome'>Start Chartting</span>
      </div>
    );
  }
}

export default Welcome;

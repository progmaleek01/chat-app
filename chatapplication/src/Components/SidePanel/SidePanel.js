import React, { Component } from "react";
import LocalStorageStrings from "../LoginStrings";
import "../Styles/sidePanel.css";
import Welcome from "../Welcome/Welcome";
import LiveChat from "../LiveChat/LiveChat";
import firebase from "../Firebase/firebase";

class SidePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPeerUser: null,
      displayContacts: [],
    };

    this.searchUsers = [];
    this.currentUserDocumentId = localStorage.getItem(
      LocalStorageStrings.FirebaseDocumentId
    );
    this.currentUserId = localStorage.getItem(LocalStorageStrings.ID);
    this.currentUserPhoto = localStorage.getItem(LocalStorageStrings.PhotoURL);
    this.currentUserName = localStorage.getItem(LocalStorageStrings.Name);
    this.getListusers = this.getListusers.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
  }

  componentDidMount() {
    this.getListusers();
  }

  getListusers = async () => {
    const result = await firebase.firestore().collection("users").get();
    if (result.docs.length > 0) {
      let listusers = [];
      listusers = [...result.docs];
      listusers.forEach((item, index) => {
        this.searchUsers.push({
          key: index,
          documentkey: item.id,
          id: item.data().id,
          name: item.data().name,
          URL: item.data().URL,
          description: item.data().description,
        });
      });
      this.setState({ displayContacts: this.searchUsers });
      console.log(this.state.displayContacts);
    }
  };

  logout = () => {
    firebase.auth().signOut();
    this.props.history.push("/");
    localStorage.clear();
  };

  onProfileClick = () => {
    this.props.history.push("/profile");
  };

  searchHandler = (event) => {
    let searchQuery = event.target.value.toLowerCase();
    let filteredContacts = this.searchUsers.filter((el) => {
      let SearchValue = el.name.toLowerCase();
      return SearchValue.indexOf(searchQuery) !== -1;
    });
    this.setState({ displayContacts: filteredContacts });
  };

  render() {
    return (
      <div id='frame'>
        <div id='sidepanel'>
          <div id='profile'>
            <div className='wrap'>
              <img
                id='profile-img'
                className='online'
                src={
                  this.currentUserPhoto
                    ? this.currentUserPhoto
                    : "https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/nopic.jpg?alt=media&token=e941ad65-265e-4671-8f7f-190510ac1644"

                  }
                alt=''
              />
              <p>{this.currentUserName}</p>

              <div id='status-options'>
                <ul>
                  <li id='status-online' className='active'>
                    <span className='status-circle'></span>
                    <p>online</p>
                  </li>
                  <li id='status-away'>
                    <span className='status-circle'></span>
                    <p>Away</p>
                  </li>
                  <li id='status-busy'>
                    <span className='status-circle'></span>
                    <p>Busy</p>
                  </li>
                  <li id='status-offline'>
                    <span className='status-circle'></span>
                    <p>Offline</p>
                  </li>
                </ul>
              </div>

              <div id='expanded'>
                <label for='twitter'>
                  <i class='fa fa-facebook fa-fw' aria-hidden='true'></i>
                </label>
                <input name='twittwer' type='text' value='mikeross' />
                <label for='twitter'>
                  <i class='fa fa-twitter fa-fw' aria-hidden='true'></i>
                </label>
                <input name='twitter' type='text' value='ross81' />
                <label for='twitter'>
                  <i class='fa fa-instagram fa-fw' aria-hidden='true'></i>
                </label>
                <input name='twitter' type='text' value='mike.ross' />
              </div>
            </div>
          </div>

          <div id='search'>
            <label for=''>
              <i class='fa-fa-search' aria-hidden='true'></i>
            </label>
            <input
              class='input-field'
              type='text'
              onChange={this.searchHandler}
              placeholder='Search'
            />
          </div>
          <div id='contacts'>
            <ul style={{ listStyleType: "none", margin: "0", padding: "0" }}>
              {this.state.displayContacts
                ? this.state.displayContacts.map((item) =>
                    item.id !== this.currentUserId ? (
                      <li
                        class='contact'
                        onClick={() => {
                          this.setState({ currentPeerUser: item });
                        }}
                      >
                        <div className='wrap'>
                          <span className='contact-status online'></span>
                          <img
                            src={ 
                              item.URL ? item.URL  : "https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/nopic.jpg?alt=media&token=e941ad65-265e-4671-8f7f-190510ac1644"}alt=''></img>
                          <div className='meta'>
                            <p className='name'>{item.name}</p>
                            <p className='preview'>
                              {item.description
                                ? item.description
                                : "I am busy....."}
                            </p>
                          </div>
                        </div>
                      </li>
                    ) : (
                      console.log("no user Found")
                    )
                  )
                : console.log("no user is present")}
            </ul>
          </div>

          <div id='bottom-bar'>
            <button id='logout' onClick={this.logout}>
              <i class='fa fa-sign-out' aria-hidden='true'></i>{" "}
              <span>LogOut</span>{" "}
            </button>
            <button id='settings' onClick={this.onProfileClick}>
              <i class='fa fa-cog fa-fw' aria-hidden='true'></i>{" "}
              <span>Profile</span>{" "}
            </button>
          </div>
        </div>

        {this.state.currentPeerUser ? (
          <LiveChat
            currentPeerUser={this.state.currentPeerUser}
            showToast={this.props.showToast}
          />
        ) : (
          <Welcome
            currentUserName={this.currentUserName}
            currentUserPhoto={this.currentUserPhoto}
          />
        )}
      </div>
    );
  }
}

export default SidePanel;

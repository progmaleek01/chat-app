import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./Components/Home/Home";
import SignIn from "./Components/Signin/SignIn";
import SignUp from "./Components/Signup/SignUp";
import Profile from "./Components/Profile/Profile";
import SidePanel from "./Components/SidePanel/SidePanel";

class App extends Component {
  showToast = (type, message) => {
    switch (type) {
      case 0:
        toast.warning(message);
        break;
      case 1:
        toast.success(message);

      default:
        break;
    }
  };
  render() {
    return (
      <Router>
        <ToastContainer
          autoClose={200}
          hideProgressBar={true}
          position={toast.POSITION.TOP_CENTER}
        />
        <Switch>
          <Route exact path='/' render={(props) => <Home {...props} />} />

          <Route
            path='/signin'
            render={(props) => <SignIn showToast={this.showToast} {...props} />}
          />

          <Route
            path='/signup'
            render={(props) => <SignUp showToast={this.showToast} {...props} />}
          />

          <Route
            path='/profile'
            render={(props) => (
              <Profile showToast={this.showToast} {...props} />
            )}
          />

          <Route
            path='/chat'
            render={(props) => (
              <SidePanel showToast={this.showToast} {...props} />
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;

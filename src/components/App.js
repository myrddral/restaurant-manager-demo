import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Profile from "./Profile";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import Dashboard from "./Dashboard";
import NewItem from "./NewItem";
import Navigation from "./Navigation";
import Measuring from "./Measuring";
import Stock from "./Stock";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
          <PrivateRoute path="/add" component={NewItem} />
          <PrivateRoute path="/measure-wine" component={Measuring} />
          <PrivateRoute path="/measure-spirit" component={Measuring} />
          <PrivateRoute path="/stock" component={Stock} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;

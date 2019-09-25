import React from "react";
import { Redirect, Route } from "react-router-dom";
import Auth from "../../services/auth.service"

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/auth/login", state: { from: props.location } }} />
      )
    }
  />
);

export default PrivateRoute;

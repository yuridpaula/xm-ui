/*import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.jsx";
import AdminLayout from "layouts/Admin.jsx";

import "assets/scss/material-dashboard-pro-react.scss?v=1.5.0";
const hist = createBrowserHistory()
*/



import React from "react";
import ReactDOM from "react-dom";
import App from "./App"

/*
ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/auth" component={AuthLayout} />
      <Route path="/admin" component={AdminLayout} />
      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
*/
ReactDOM.render(
    <App />,
  document.getElementById("root")
);
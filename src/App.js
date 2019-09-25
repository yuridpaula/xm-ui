import React from "react"
import { createBrowserHistory } from "history"
import { Router, Route, Switch, Redirect } from "react-router-dom"

import AuthLayout from "layouts/Auth.jsx"
import AdminLayout from "layouts/Admin.jsx"
import PrivateRoute from "./components/PrivateRoute/PrivateRoute"

import Assessment from "@material-ui/icons/Assessment"
import AccountBalance from "@material-ui/icons/AccountBalance"
import Description from "@material-ui/icons/Description"
import AccountBalanceWallet from "@material-ui/icons/AccountBalanceWallet"
import InsertDriveFile from "@material-ui/icons/InsertDriveFile"
import SwapVerticalCircle from "@material-ui/icons/SwapVerticalCircle"

import "assets/scss/material-dashboard-pro-react.scss?v=1.5.0"
import { createStore } from 'react-hookstore'

if (localStorage.getItem('appColor') == null) {
    localStorage.setItem('appColor', 'info')
    localStorage.setItem('appSideBarColor', 'blue')
}

if (localStorage.getItem('bgColor') == null) {
    localStorage.setItem('bgColor', 'black')
}

const colors = {
    app: localStorage.getItem('appColor'),
    bgColor: localStorage.getItem('bgColor'),
    sideBar: localStorage.getItem('appSideBarColor')
}

const icons =  {
    ativo: (<Assessment />),
    corretora: (<AccountBalance />),
    set: (<Description />),
    conta: (<AccountBalanceWallet />),
    papel: (<InsertDriveFile />),
    operacao: (<SwapVerticalCircle />)
}

createStore('colors', colors)
createStore('icons', icons)

const hist = createBrowserHistory()

const App = (props) => {
    return (
        <Router history={hist}>
            <Switch>
                <Route path="/auth" component={AuthLayout} />
                <PrivateRoute path="/admin" component={AdminLayout} />
                <Redirect from="/" to="/auth/login" />
            </Switch>
        </Router>
    )
}


export default App
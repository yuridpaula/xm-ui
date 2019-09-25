import Hidden from "@material-ui/core/Hidden"
// import { Manager, Target, Popper } from "react-popper"
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles"
import ExitToApp from "@material-ui/icons/ExitToApp"
import adminNavbarLinksStyle from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.jsx"
import Button from "components/CustomButtons/Button.jsx"
import React, { useState } from "react"
import { Redirect } from "react-router-dom"
import Auth from "../../services/auth.service"

const HeaderLinks = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(Auth.isAuthenticated())

    const logOut = () => {
        setIsAuthenticated(false)
        Auth.sair()
    }

    const { classes } = props

    if (!isAuthenticated) {
        return (<Redirect to="/auth/login" />)
    }

    return (
        <div>
            <Button
                color="transparent"
                aria-label="Sair"
                justIcon
                round
                onClick={() => logOut()}
                className={classes.buttonLink}
            >
                <ExitToApp className={classes.sidebarMiniIcon} />
                <Hidden mdUp implementation="css">
                    <span className={classes.linkText}>{"Sair"}</span>
                </Hidden>
            </Button>
        </div>
    )
}

export default withStyles(adminNavbarLinksStyle)(HeaderLinks)

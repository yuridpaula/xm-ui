import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles"

import footerStyle from "assets/jss/material-dashboard-pro-react/components/footerStyle"

function Footer({ ...props }) {
  const { classes, fluid, white } = props
  var container = cx({
    [classes.container]: !fluid,
    [classes.containerFluid]: fluid,
    [classes.whiteColor]: white
  })
  var anchor =
    classes.a +
    cx({
      [" " + classes.whiteColor]: white
    })

  return (
    <footer className={classes.footer}>
      <div className={container}>
        <p className={classes.right}>
          &copy; {1900 + new Date().getYear()}{" "}
          <a href="https://www.github.com/yuridpaula" className={anchor}>
            {"Yuri de Paula"}
          </a>
        </p>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  fluid: PropTypes.bool,
  white: PropTypes.bool
}

export default withStyles(footerStyle)(Footer)

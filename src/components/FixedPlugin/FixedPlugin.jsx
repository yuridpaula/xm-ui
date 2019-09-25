/*eslint-disable*/
import React, { Component, useReducer } from "react"
import Tooltip from "@material-ui/core/Tooltip"

import withStyles from "@material-ui/core/styles/withStyles"
import Switch from "@material-ui/core/Switch"

import styles from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx"

import imagine1 from "assets/img/sidebar-1.jpg"
import imagine2 from "assets/img/sidebar-2.jpg"
import imagine3 from "assets/img/sidebar-3.jpg"
import imagine4 from "assets/img/sidebar-4.jpg"

import { useStore } from 'react-hookstore';

const FixedPlugin = (props) => {
  const [state, dispatch] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      classes: "dropdown show",
      bg_checked: true,
      bgImage: props.bgImage,
      showImage: true
    },
  )

  const [colors, setColors] = useStore('colors')

  const handleClick = () => {
    props.handleFixedClick()
  }

  const handleChange = name => event => {
    switch (name) {
      case "miniActive":
        props.sidebarMinimize()
        break
      case "image":
        if (event.target.checked) {
          props.handleImageClick(state.bgImage)
        } else {
          props.handleImageClick()
        }
        dispatch({...state, showImage: event.target.checked })
        break
      default:
        break
    }
  }

  const { classes } = props
  return (
      <Tooltip
          id="tooltip-top"
          title="Deixe o App com a sua cara :)"
          placement="bottom"
          classes={{ tooltip: classes.tooltip }}
      >
    <div
      className={"fixed-plugin"}
    >
      <div id="fixedPluginClasses" className={props.fixedClasses}>
        <div onClick={handleClick}>
          <i className="fa fa-cog fa-2x" />
        </div>
        <ul className="dropdown-menu">
          <li className="header-title">Cores</li>
          <li className="adjustments-line">
            <a className="switch-trigger active-color">
              <div className="badge-colors text-center">
                <span
                  className={
                    props.color === "purple"
                      ? "badge filter badge-purple active"
                      : "badge filter badge-purple"
                  }
                  data-color="purple"
                  onClick={() => {
                    props.handleColorClick("purple")
                    setColors({...colors, app: 'primary'})

                  }}
                />
                <span
                  className={
                    props.color === "blue"
                      ? "badge filter badge-blue active"
                      : "badge filter badge-blue"
                  }
                  data-color="blue"
                  onClick={() => {
                    props.handleColorClick("blue")
                    setColors({ ...colors, app: 'info'})
                  }}
                />
                <span
                  className={
                    props.color === "green"
                      ? "badge filter badge-green active"
                      : "badge filter badge-green"
                  }
                  data-color="green"
                  onClick={() => {
                    props.handleColorClick("green")
                    setColors({ ...colors, app: 'success'})
                  }}
                />
                <span
                  className={
                    props.color === "red"
                      ? "badge filter badge-red active"
                      : "badge filter badge-red"
                  }
                  data-color="red"
                  onClick={() => {
                    props.handleColorClick("red")
                    setColors({ ...colors, app: 'danger'})
                  }}
                />
                <span
                  className={
                    props.color === "orange"
                      ? "badge filter badge-orange active"
                      : "badge filter badge-orange"
                  }
                  data-color="orange"
                  onClick={() => {
                    props.handleColorClick("orange")
                    setColors({ ...colors, app: 'warning'})
                  }}
                />
                <span
                  className={
                    props.color === "white"
                      ? "badge filter badge-white active"
                      : "badge filter badge-white"
                  }
                  data-color="orange"
                  onClick={() => {
                    props.handleColorClick("white")
                    setColors({ ...colors, app: 'primary'})
                  }}
                />
                <span
                  className={
                    props.color === "rose"
                      ? "badge filter badge-rose active"
                      : "badge filter badge-rose"
                  }
                  data-color="orange"
                  onClick={() => {
                    props.handleColorClick("rose")
                    setColors({ ...colors, app: 'rose'})
                  }}
                />
              </div>
              <div className="clearfix" />
            </a>
          </li>
          <li className="header-title">Cor de Fundo</li>
          <li className="adjustments-line">
            <a className="switch-trigger active-color">
              <div className="badge-colors text-center">
                <span
                  className={
                    props.bgColor === "blue"
                      ? "badge filter badge-blue active"
                      : "badge filter badge-blue"
                  }
                  data-color="orange"
                  onClick={() => {
                    props.handleBgColorClick("blue")
                  }}
                />
                <span
                  className={
                    props.bgColor === "white"
                      ? "badge filter badge-white active"
                      : "badge filter badge-white"
                  }
                  data-color="orange"
                  onClick={() => {
                    props.handleBgColorClick("white")
                  }}
                />
                <span
                  className={
                    props.bgColor === "black"
                      ? "badge filter badge-black active"
                      : "badge filter badge-black"
                  }
                  data-color="orange"
                  onClick={() => {
                    props.handleBgColorClick("black")
                  }}
                />
              </div>
              <div className="clearfix" />
            </a>
          </li>
          <li className="adjustments-line">
            <a className="switch-trigger">
              <p className="switch-label">Mini Barra Lateral</p>
              <Switch
                checked={props.miniActive}
                onChange={handleChange("miniActive")}
                value="sidebarMini"
                classes={{
                  switchBase: classes.switchBase,
                  checked: classes.switchChecked,
                  icon: classes.switchIcon,
                  iconChecked: classes.switchIconChecked,
                  bar: classes.switchBar
                }}
              />
              <div className="clearfix" />
            </a>
          </li>
          <li className="adjustments-line">
            <a className="switch-trigger">
              <p className="switch-label">Imagem Barra Lateral</p>
              <Switch
                checked={state.showImage}
                onChange={handleChange("image")}
                value="sidebarMini"
                classes={{
                  switchBase: classes.switchBase,
                  checked: classes.switchChecked,
                  icon: classes.switchIcon,
                  iconChecked: classes.switchIconChecked,
                  bar: classes.switchBar
                }}
              />
              <div className="clearfix" />
            </a>
          </li>
          <li className="header-title">Imagens</li>
          <li className={state["bgImage"] === imagine1 ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                dispatch({...state, showImage: true, bgImage: imagine1 })
                props.handleImageClick(imagine1)
              }}
            >
              <img src={imagine1} alt="..." />
            </a>
          </li>
          <li className={state["bgImage"] === imagine2 ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                dispatch({...state, showImage: true, bgImage: imagine2 })
                props.handleImageClick(imagine2)
              }}
            >
              <img src={imagine2} alt="..." />
            </a>
          </li>
          <li className={state["bgImage"] === imagine3 ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                dispatch({...state, showImage: true, bgImage: imagine3 })
                props.handleImageClick(imagine3)
              }}
            >
              <img src={imagine3} alt="..." />
            </a>
          </li>
          <li className={state["bgImage"] === imagine4 ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                dispatch({...state, showImage: true, bgImage: imagine4 })
                props.handleImageClick(imagine4)
              }}
            >
              <img src={imagine4} alt="..." />
            </a>
          </li>
        </ul>
      </div>
    </div>
    </Tooltip>
  )

}

/*
class FixedPlugin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classes: "dropdown show",
      bg_checked: true,
      bgImage: this.props.bgImage,
      showImage: true
    }
    this.handleClick = this.handleClick.bind(this)

    this.props.handleColorClick(localStorage.getItem('xmSideBarAppColor'))
    this.props.handleBgColorClick(localStorage.getItem('xmAppBgColor'))
  }

  componentWillReceiveProps(nextProps) {
    let color
    switch(nextProps.color) {
      case 'purple' : 
        color = 'primary'
        break
      case 'green' :
        color = 'success'
        break
      case 'blue' : 
        color = 'info'
        break
      case 'red' :
        color = 'danger'
        break
      case 'orange' :
        color = 'warning'
        break
      case 'white' : 
        color = 'primary'
        break
      
      default :
        color = nextProps.color
    }

    if (localStorage.getItem('xmAppColor') !== color){
      localStorage.setItem('xmAppColor', color)
      localStorage.setItem('xmSideBarAppColor', nextProps.color)
      
    }

    if (localStorage.getItem('xmAppBgColor') !== nextProps.bgColor){
      localStorage.setItem('xmAppBgColor', nextProps.bgColor)
    }
    
  }

  handleClick() {
    this.props.handleFixedClick()
  }
  handleChange = name => event => {
    switch (name) {
      case "miniActive":
        this.props.sidebarMinimize()
        break
      case "image":
        if (event.target.checked) {
          this.props.handleImageClick(this.state.bgImage)
        } else {
          this.props.handleImageClick()
        }
        this.setState({ showImage: event.target.checked })
        break
      default:
        break
    }
  }
  render() {
    const { classes } = this.props
    return (
      <div
        className={"fixed-plugin"}
      >
        <div id="fixedPluginClasses" className={this.props.fixedClasses}>
          <div onClick={this.handleClick}>
            <i className="fa fa-cog fa-2x" />
          </div>
          <ul className="dropdown-menu">
            <li className="header-title">Cores</li>
            <li className="adjustments-line">
              <a className="switch-trigger active-color">
                <div className="badge-colors text-center">
                  <span
                    className={
                      this.props.color === "purple"
                        ? "badge filter badge-purple active"
                        : "badge filter badge-purple"
                    }
                    data-color="purple"
                    onClick={() => {
                      this.props.handleColorClick("purple")
                    }}
                  />
                  <span
                    className={
                      this.props.color === "blue"
                        ? "badge filter badge-blue active"
                        : "badge filter badge-blue"
                    }
                    data-color="blue"
                    onClick={() => {
                      this.props.handleColorClick("blue")
                    }}
                  />
                  <span
                    className={
                      this.props.color === "green"
                        ? "badge filter badge-green active"
                        : "badge filter badge-green"
                    }
                    data-color="green"
                    onClick={() => {
                      this.props.handleColorClick("green")
                    }}
                  />
                  <span
                    className={
                      this.props.color === "red"
                        ? "badge filter badge-red active"
                        : "badge filter badge-red"
                    }
                    data-color="red"
                    onClick={() => {
                      this.props.handleColorClick("red")
                    }}
                  />
                  <span
                    className={
                      this.props.color === "orange"
                        ? "badge filter badge-orange active"
                        : "badge filter badge-orange"
                    }
                    data-color="orange"
                    onClick={() => {
                      this.props.handleColorClick("orange")
                    }}
                  />
                  <span
                    className={
                      this.props.color === "white"
                        ? "badge filter badge-white active"
                        : "badge filter badge-white"
                    }
                    data-color="orange"
                    onClick={() => {
                      this.props.handleColorClick("white")
                    }}
                  />
                  <span
                    className={
                      this.props.color === "rose"
                        ? "badge filter badge-rose active"
                        : "badge filter badge-rose"
                    }
                    data-color="orange"
                    onClick={() => {
                      this.props.handleColorClick("rose")
                    }}
                  />
                </div>
                <div className="clearfix" />
              </a>
            </li>
            <li className="header-title">Cor de Fundo</li>
            <li className="adjustments-line">
              <a className="switch-trigger active-color">
                <div className="badge-colors text-center">
                  <span
                    className={
                      this.props.bgColor === "blue"
                        ? "badge filter badge-blue active"
                        : "badge filter badge-blue"
                    }
                    data-color="orange"
                    onClick={() => {
                      this.props.handleBgColorClick("blue")
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === "white"
                        ? "badge filter badge-white active"
                        : "badge filter badge-white"
                    }
                    data-color="orange"
                    onClick={() => {
                      this.props.handleBgColorClick("white")
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === "black"
                        ? "badge filter badge-black active"
                        : "badge filter badge-black"
                    }
                    data-color="orange"
                    onClick={() => {
                      this.props.handleBgColorClick("black")
                    }}
                  />
                </div>
                <div className="clearfix" />
              </a>
            </li>
            <li className="adjustments-line">
              <a className="switch-trigger">
                <p className="switch-label">Mini Barra Lateral</p>
                <Switch
                  checked={this.props.miniActive}
                  onChange={this.handleChange("miniActive")}
                  value="sidebarMini"
                  classes={{
                    switchBase: classes.switchBase,
                    checked: classes.switchChecked,
                    icon: classes.switchIcon,
                    iconChecked: classes.switchIconChecked,
                    bar: classes.switchBar
                  }}
                />
                <div className="clearfix" />
              </a>
            </li>
            <li className="adjustments-line">
              <a className="switch-trigger">
                <p className="switch-label">Imagem Barra Lateral</p>
                <Switch
                  checked={this.state.showImage}
                  onChange={this.handleChange("image")}
                  value="sidebarMini"
                  classes={{
                    switchBase: classes.switchBase,
                    checked: classes.switchChecked,
                    icon: classes.switchIcon,
                    iconChecked: classes.switchIconChecked,
                    bar: classes.switchBar
                  }}
                />
                <div className="clearfix" />
              </a>
            </li>
            <li className="header-title">Imagens</li>
            <li className={this.state["bgImage"] === imagine1 ? "active" : ""}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ showImage: true, bgImage: imagine1 })
                  this.props.handleImageClick(imagine1)
                }}
              >
                <img src={imagine1} alt="..." />
              </a>
            </li>
            <li className={this.state["bgImage"] === imagine2 ? "active" : ""}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ showImage: true, bgImage: imagine2 })
                  this.props.handleImageClick(imagine2)
                }}
              >
                <img src={imagine2} alt="..." />
              </a>
            </li>
            <li className={this.state["bgImage"] === imagine3 ? "active" : ""}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ showImage: true, bgImage: imagine3 })
                  this.props.handleImageClick(imagine3)
                }}
              >
                <img src={imagine3} alt="..." />
              </a>
            </li>
            <li className={this.state["bgImage"] === imagine4 ? "active" : ""}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ showImage: true, bgImage: imagine4 })
                  this.props.handleImageClick(imagine4)
                }}
              >
                <img src={imagine4} alt="..." />
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
*/
export default withStyles(styles)(FixedPlugin)

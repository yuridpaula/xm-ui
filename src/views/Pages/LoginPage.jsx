import FormControlLabel from "@material-ui/core/FormControlLabel"
import Icon from "@material-ui/core/Icon"
import InputAdornment from "@material-ui/core/InputAdornment"
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles"
import Switch from "@material-ui/core/Switch"
import AddAlert from "@material-ui/icons/AddAlert"
import Email from "@material-ui/icons/Email"
import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx"
import Card from "components/Card/Card.jsx"
import CardBody from "components/Card/CardBody.jsx"
import CardFooter from "components/Card/CardFooter.jsx"
import CardHeader from "components/Card/CardHeader.jsx"
import Button from "components/CustomButtons/Button.jsx"
import CustomInput from "components/CustomInput/CustomInput.jsx"
// import LockOutline from "@material-ui/icons/LockOutline"
// core components
import GridContainer from "components/Grid/GridContainer.jsx"
import GridItem from "components/Grid/GridItem.jsx"
import Snackbar from "components/Snackbar/Snackbar.jsx"
import React, { useReducer, useState, useEffect } from "react"

//personal
import Auth from "services/auth.service"
import { useStore } from 'react-hookstore'

const LoginPage = (props) => {
    const [state, dispatch] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            cardAnimation: "cardHidden",
            email: localStorage.getItem("email"),
            senha: localStorage.getItem("senha"),
            rememberMe: true,
            showSnack: false,
            snackColor: "danger",
            snackMessage: "",
            timeOutFunction: setTimeout(() => dispatch({ cardAnimation: "" }), 700)
        },
    )
    
    const [isAuthenticated, setIsAuthenticated] = useState(Auth.isAuthenticated())
    
    const [colors] = useStore('colors')

    const { classes } = props

    const handleSnack = (color, message) => {
        dispatch({
            showSnack: true,
            snackColor: color,
            snackMessage: message
        })

        setTimeout(() => dispatch({ showSnack: false }), 3000)
    }

    const submit = async (e) => {

        e.preventDefault()

        if (state.email === '' ||
            state.senha === '') {

            handleSnack("danger", "Dados Inválidos para Autenticação")

            return
        }

        let [err, res] = await Auth.autenticar({ email: state.email, senha: state.senha })

        if(err) {
            handleSnack("danger",
            err.response
                ? err.response.data.developerMessage
                : "Impossível efetuar Login")
        }

        if (res) {
            if (state.rememberMe) {
                localStorage.setItem("email", state.email)
                localStorage.setItem("senha", state.senha)
                localStorage.setItem("rememberMe", state.rememberMe)
            }

            setIsAuthenticated(true)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            clearInterval(state.timeOutFunction)
            dispatch({ timeOutFunction: null })
            
            handleSnack("success", "Redirecionando...")
            
            setTimeout(() => {
                props.history.push("/admin/dashboard")
            }, 2000)
        }
    }, [isAuthenticated])

    return (
        <div className={classes.container}>
            <GridContainer justify="center">
                <GridItem xs={12} sm={6} md={4}>
                    <form onSubmit={(e) => submit(e)} >
                        <Card login className={classes[state.cardAnimation]}>
                            <CardHeader
                                className={`${classes.cardHeader} ${classes.textCenter}`}
                                color={colors.app}
                            >
                                <h4 className={classes.cardTitle}>Log in</h4>
                            </CardHeader>
                            <CardBody>
                                <CustomInput
                                    labelText="Email..."
                                    id="email"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Email className={classes.inputAdornmentIcon} />
                                            </InputAdornment>
                                        ),
                                        onChange: e => dispatch({ email: e.target.value }),
                                        defaultValue: state.email
                                    }}
                                />
                                <CustomInput
                                    labelText="Senha"
                                    id="senha"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "password",
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Icon className={classes.inputAdornmentIcon}>
                                                    lock_outline
                                                </Icon>
                                            </InputAdornment>
                                        ),
                                        onChange: e => dispatch({ senha: e.target.value }),
                                        defaultValue: state.senha
                                    }}
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            onChange={e => dispatch({ rememberMe: !state.rememberMe })}
                                            checked={state.rememberMe}
                                            color="primary"/>
                                    }
                                    label="Lembrar-me"
                                />
                            </CardBody>
                            <CardFooter className={classes.justifyContentCenter}>
                                <Button
                                    color={colors.app}
                                    simple
                                    size="lg"
                                    block
                                    type="submit">
                                    Log in
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </GridItem>
            </GridContainer>
            <Snackbar
                place="bc"
                color={state.snackColor}
                icon={AddAlert}
                message={state.snackMessage}
                open={state.showSnack}
                closeNotification={() => dispatch({ showSnack: false })}
                close
            />
        </div>
    )
}

export default withStyles(loginPageStyle)(LoginPage)

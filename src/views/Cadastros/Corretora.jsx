import React, { useState, useReducer } from "react"

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles"

// @material-ui/icons
import DoneAll from "@material-ui/icons/DoneAll"
import AddAlert from "@material-ui/icons/AddAlert"

// core components
import GridContainer from "components/Grid/GridContainer.jsx"
import GridItem from "components/Grid/GridItem.jsx"
import CustomInput from "components/CustomInput/CustomInput.jsx"
import Button from "components/CustomButtons/Button.jsx"
import Card from "components/Card/Card.jsx"
import CardHeader from "components/Card/CardHeader.jsx"
import CardIcon from "components/Card/CardIcon.jsx"
import CardBody from "components/Card/CardBody.jsx"
import Snackbar from "components/Snackbar/Snackbar.jsx"
import Tooltip from '@material-ui/core/Tooltip'

//style
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle"

//personal
import Service from "../../services/generic.service"
import { useStore } from 'react-hookstore'

const Corretora = (props) => {
    Service.setUrl("corretora")

    const [state, dispatch] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            showSnack: false,
            snackColor: "danger",
            snackMessage: ""
        },
    )

    const [colors] = useStore('colors')
    const [icons] = useStore('icons')

    const initialState = {
        id: 0,
        nome: '',
        site: '',
        foto: ''
    }

    const [corretora, setCorretora] = useState(props.location.state ? props.location.state.corretora : initialState)

    const { classes } = props

    const handleSnack = (color, message) => {
        dispatch({
            showSnack: true,
            snackColor: color,
            snackMessage: message
        })

        setTimeout(() => dispatch({ showSnack: false }), 3000)
    }

    const handleChange = (e) => {
        setCorretora({ ...corretora, [e.target.id]: e.target.value })
    }

    const submit = async (e) => {
        e.preventDefault()

        if (corretora.nome === '' ||
            corretora.site === '' ||
            corretora.foto === '') {

            handleSnack("danger", "Necessário informar campos obrigatórios!")

            return
        }

        let [err, res] = []

        if (corretora.id === 0) {
            [err, res] = await Service.gravar(corretora)
        } else {
            [err, res] = await Service.atualizar(corretora)
        }

        handleSnack(err ? "danger" : "success",
            err
                ? err.response
                    ? err.response.data.developerMessage
                    : "Ocorreu um erro ao incluir/alterar registro"
                : "Registro incluído/alterado com sucesso"
        )

        if (res) {
            setTimeout(() => {
                props.history.push("/admin/consulta/corretora")
            }, 1000)
        } else {
            console.log(err)
        }

    }

    return (
        <>
            <GridContainer>
                <GridItem xs={1} />
                <GridItem xs={10} sm={10} md={10}>
                    <Card>
                        <CardHeader color={colors.app} icon>
                            <CardIcon color={colors.app}>
                                {icons.corretora}
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Cadastro Corretoras</h4>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={e => submit(e)}>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="Nome Corretora *"
                                        id="nome"

                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: "text",
                                            onChange: e => handleChange(e),
                                            defaultValue: corretora.nome

                                        }}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="Site Corretora *"
                                        id="site"

                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: "text",
                                            onChange: e => handleChange(e),
                                            defaultValue: corretora.site
                                        }}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                    <GridContainer>
                                        <GridItem xs={10} sm={10} md={10}>
                                            <CustomInput
                                                labelText="Foto Corretora *"
                                                id="foto"

                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    multiline: true,
                                                    rows: 2,
                                                    type: "text",
                                                    onChange: e => handleChange(e),
                                                    defaultValue: corretora.foto
                                                }}
                                            />
                                        </GridItem>
                                        <Tooltip
                                            id="tooltip-top"
                                            title="Gravar"
                                            placement="bottom"
                                            classes={{ tooltip: classes.tooltip }}
                                        >
                                            <Button
                                                color={colors.app}
                                                justIcon
                                                round
                                                className={classes.marginRight}
                                                type="submit">
                                                <DoneAll className={classes.icons} />
                                            </Button>
                                        </Tooltip>
                                    </GridContainer>
                                </GridItem>

                                <div className={classes.formCategory}>
                                    <small>*</small> Campos Obrigatórios
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer >
            <Snackbar
                place="br"
                color={state.snackColor}
                icon={AddAlert}
                message={state.snackMessage}
                open={state.showSnack}
                closeNotification={() => dispatch({ showSnack: false })}
                close
            />
        </>
    )

}

export default withStyles(regularFormsStyle)(Corretora)

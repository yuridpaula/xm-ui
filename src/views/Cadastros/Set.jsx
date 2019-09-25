import React, { useState, useReducer } from "react"

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles"
import FormControlLabel from "@material-ui/core/FormControlLabel"

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
import Switch from "@material-ui/core/Switch"

//style
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle"

//personal
import Service from "../../services/generic.service"
import { useStore } from 'react-hookstore'

const Set = (props) => {
    Service.setUrl("set")

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
        mediaMovel: 0,
        distanciaMedia: 0,
        distanciaOrdem: 0,
        ativo: false,
        observacao: '',
        urlDownload: ''
    }

    const [set, setSet] = useState(props.location.state ? props.location.state.set : initialState)

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
        setSet({ ...set, [e.target.id]: e.target.value })
    }

    const submit = async (e) => {
        e.preventDefault()

        if (set.nome === '' ||
            set.mediaMovel === 0 ||
            set.distanciaMedia === '' ||
            set.distanciaOrdem === '' ||
            set.observacao === '' ||
            set.urlDownload === '') {

            handleSnack("danger", "Necessário informar campos obrigatórios!")

            return
        }

        let [err, res] = []

        if (set.id === 0) {
            [err, res] = await Service.gravar(set)
        } else {
            [err, res] = await Service.atualizar(set)
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
                props.history.push("/admin/consulta/set")
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
                                {icons.set}
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Cadastro Sets</h4>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={e => submit(e)}>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="Nome Set *"
                                        id="nome"

                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: "text",
                                            onChange: e => handleChange(e),
                                            defaultValue: set.nome

                                        }}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                    <GridContainer>
                                        <GridItem xs={12} sm={4} md={2}>
                                            <CustomInput
                                                labelText="Média Móvel"
                                                id="mediaMovel"

                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number",
                                                    onChange: e => handleChange(e),
                                                    defaultValue: set.mediaMovel

                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={4} md={2}>
                                            <CustomInput
                                                labelText="Distancia Média"
                                                id="distanciaMedia"

                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number",
                                                    onChange: e => handleChange(e),
                                                    defaultValue: set.distanciaMedia
                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={4} md={2}>
                                            <CustomInput
                                                labelText="Distancia Ordem"
                                                id="distanciaOrdem"

                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number",
                                                    onChange: e => handleChange(e),
                                                    defaultValue: set.distanciaOrdem
                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={4} md={2}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        onChange={e => setSet({ ...set, ativo: !set.ativo })}
                                                        checked={set.ativo}
                                                        color="primary" />
                                                }
                                                label="Ativo"
                                            />
                                        </GridItem>
                                    </GridContainer>
                                </GridItem>

                                <GridItem xs={12} sm={12} md={8}>
                                    <CustomInput
                                        labelText="Observação"
                                        id="observacao"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            multiline: true,
                                            rows: 2,
                                            onChange: e => handleChange(e),
                                            defaultValue: set.observacao
                                        }}
                                    />
                                </GridItem>

                                <GridItem xs={12} sm={12} md={12}>
                                    <GridContainer>
                                        <GridItem xs={10} sm={10} md={10}>
                                            <CustomInput
                                                labelText="URL Download"
                                                id="urlDownload"

                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    multiline: true,
                                                    rows: 2,
                                                    type: "text",
                                                    onChange: e => handleChange(e),
                                                    defaultValue: set.urlDownload
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

export default withStyles(regularFormsStyle)(Set)

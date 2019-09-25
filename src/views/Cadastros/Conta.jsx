import React, { useState, useReducer, useEffect } from "react"

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
import Switch from "@material-ui/core/Switch"
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

//style
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle"

//personal
import Service from "../../services/generic.service"
import { useStore } from 'react-hookstore'

const Conta = (props) => {
    Service.setUrl("conta")

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
        corretora: '',
        corretoraId: 0,
        usuario: {},
        demo: false,
        margemContrato: 0,
        ativo: '',
        ativoId: 0
    }

    const [conta, setConta] = useState(props.location.state ? 
        ({ 
            ...props.location.state.conta, 
            corretoraId: props.location.state.conta.corretora.id,
            ativoId: props.location.state.conta.ativo.id
        }) : 
        initialState)

    const [corretoras, setCorretoras] = useState([])
    const [corr, setCorr] = useState([])

    const [ativos, setAtivos] = useState([])
    const [atv, setAtv] = useState([])

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
        setConta({ ...conta, [e.target.id]: e.target.value })
    }

    const handleSelect = (e, val, arr) => {
        setConta({ ...conta, [e.target.name]: e.target.value, [val]: arr.find(i => i.id === e.target.value) })
    }

    const submit = async (e) => {
        e.preventDefault()

        if (conta.nome === '' ||
            conta.corretora === {} ||
            conta.ativo === {}) {

            handleSnack("danger", "Necessário informar campos obrigatórios!")

            return
        }

        let [err, res] = []

        if (conta.id === 0) {
            [err, res] = await Service.gravar(conta)
        } else {
            [err, res] = await Service.atualizar(conta)
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
                props.history.push("/admin/consulta/conta")
            }, 1000)
        } else {
            console.log(err)
        }

    }

    const getCorretoras = async () => {
        let [err, res] = await Service.buscarCustom("corretora")

        if (err) {
            handleSnack("danger", "Ocorreu um erro ao buscar as Corretoras")
            console.log({ err })
        } else {
            let data = res.data.records.map(corretora => {
                return (
                    <MenuItem
                        classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                        }}
                        value={corretora.id}
                        key={corretora.id}
                    >
                        {corretora.nome}
                    </MenuItem>
                )
            })

            setCorr(res.data.records)

            setCorretoras(data)
        }
    }

    const getAtivos = async () => {
        let [err, res] = await Service.buscarCustom("ativo")

        if (err) {
            handleSnack("danger", "Ocorreu um erro ao buscar as Ativos")
            console.log({ err })
        } else {
            let data = res.data.records.map(ativo => {
                return (
                    <MenuItem
                        classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                        }}
                        value={ativo.id}
                        key={ativo.id}
                    >
                        {ativo.sigla + ' - ' + ativo.nome}
                    </MenuItem>
                )
            })

            setAtv(res.data.records)

            setAtivos(data)
        }
    }

    useEffect(() => {
        getCorretoras()
        getAtivos()
    }, [])

    return (
        <>
            <GridContainer>
                <GridItem xs={1} />
                <GridItem xs={10} sm={10} md={10}>
                    <Card>
                        <CardHeader color={colors.app} icon>
                            <CardIcon color={colors.app}>
                                {icons.conta}
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Cadastro Contas</h4>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={e => submit(e)}>
                                <GridItem xs={12} sm={12} md={6}>
                                    <img src={conta.corretora.foto} width="50" height="60" />
                                    <br/><br/>
                                    <FormControl
                                        fullWidth
                                        className={classes.selectFormControl}
                                    >
                                        <InputLabel
                                            htmlFor="corretora-select"
                                            className={classes.selectLabel}
                                        >
                                            Corretora *
                                        </InputLabel>
                                        <Select
                                            MenuProps={{
                                                className: classes.selectMenu
                                            }}
                                            classes={{
                                                select: classes.select
                                            }}
                                            value={conta.corretoraId}
                                            onChange={(e) => handleSelect(e, 'corretora', corr)}
                                            inputProps={{
                                                name: "corretoraId",
                                                id: "corretora-select"
                                            }}
                                        >
                                            <MenuItem
                                                disabled
                                                classes={{
                                                    root: classes.selectMenuItem
                                                }}
                                            >
                                                Escolha a Corretora
                                            </MenuItem>

                                            {corretoras}

                                        </Select>
                                    </FormControl>

                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}><br /></GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <FormControl
                                        fullWidth
                                        className={classes.selectFormControl}
                                    >
                                        <InputLabel
                                            htmlFor="ativo-select"
                                            className={classes.selectLabel}
                                        >
                                            Ativo *
                                                </InputLabel>
                                        <Select
                                            MenuProps={{
                                                className: classes.selectMenu
                                            }}
                                            classes={{
                                                select: classes.select
                                            }}
                                            value={conta.ativoId}
                                            onChange={(e) => handleSelect(e, 'ativo', atv)}
                                            inputProps={{
                                                name: "ativoId",
                                                id: "ativo-select"
                                            }}
                                        >
                                            <MenuItem
                                                disabled
                                                classes={{
                                                    root: classes.selectMenuItem
                                                }}
                                            >
                                                Escolha o Ativo
                                            </MenuItem>

                                            {ativos}

                                        </Select>
                                    </FormControl>

                                </GridItem>

                                <GridItem xs={12} sm={12} md={12}>
                                    <GridContainer>
                                        <GridItem xs={10} sm={6} md={6}>
                                            <CustomInput
                                                labelText="Nome Conta *"
                                                id="nome"

                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "text",
                                                    onChange: e => handleChange(e),
                                                    defaultValue: conta.nome

                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={10} sm={3} md={3}>
                                            <CustomInput
                                                labelText="Margem Contrato"
                                                id="margemContrato"

                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number",
                                                    onChange: e => handleChange(e),
                                                    defaultValue: conta.margemContrato

                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>


                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                    <GridContainer>
                                        <GridItem xs={10} sm={10} md={10}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        onChange={e => setConta({ ...conta, demo: !conta.demo })}
                                                        checked={conta.demo}
                                                        color="primary" />
                                                }
                                                label="Conta Demo"
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

export default withStyles(regularFormsStyle)(Conta)

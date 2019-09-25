import React, { useState, useReducer, useEffect } from "react"
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from "react-datetime"
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
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"

//style
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle"

//personal
import Service from "../../services/generic.service"
import { useStore } from 'react-hookstore'
import Utils from "../../services/utils.service"

const Papel = (props) => {
    Service.setUrl("papel")

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
        vencimento: '',
        vencimentoDisplay: '',
        ativo: '',
        ativoId: 0
    }

    const [papel, setPapel] = useState(props.location.state ?
        ({
            ...props.location.state.papel,
            ativoId: props.location.state.papel.ativo.id,
            vencimentoDisplay: Utils.localDateToMoment(props.location.state.papel.vencimento)
        }) :
        initialState)

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
        setPapel({ ...papel, [e.target.id]: e.target.value })
    }

    const handleSelect = (e, val) => {
        setPapel({ ...papel, [e.target.name]: e.target.value, [val]: atv.find(i => i.id === e.target.value) })
    }

    const handleDateTime = (e) => {
        setPapel({ ...papel, vencimentoDisplay: e, vencimento: Utils.momentToLocalDate(e) })
    }

    const submit = async (e) => {
        e.preventDefault()

        if (papel.nome === '' ||
            papel.vencimentoDisplay === '' ||
            papel.ativoId === 0) {

            handleSnack("danger", "Necessário informar campos obrigatórios!")

            return
        }

        let [err, res] = []

        if (papel.id === 0) {
            [err, res] = await Service.gravar(papel)
        } else {
            [err, res] = await Service.atualizar(papel)
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
                props.history.push("/admin/consulta/papel")
            }, 1000)
        } else {
            console.log(err)
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
                                {icons.papel}
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Cadastro Papeis</h4>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={e => submit(e)}>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="Nome Papel *"
                                        id="nome"

                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: "text",
                                            onChange: e => handleChange(e),
                                            defaultValue: papel.nome

                                        }}
                                    />

                                </GridItem>
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
                                            value={papel.ativoId}
                                            onChange={(e) => handleSelect(e, 'ativo')}
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
                                <GridItem xs={12} sm={12} md={12}><br /></GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                    <GridContainer>

                                        <GridItem xs={12} sm={10} md={3}>
                                            {papel.vencimentoDisplay && <InputLabel className={classes.label}>Vencimento</InputLabel>}
                                            <FormControl fullWidth>
                                                <Datetime
                                                    timeFormat={false}
                                                    inputProps={{ placeholder: "Vencimento" }}
                                                    defaultValue={papel.vencimentoDisplay}
                                                    dateFormat={"DD/MM/YYYY"}
                                                    onChange={e => handleDateTime(e)}
                                                />
                                            </FormControl>


                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={4}></GridItem>
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

export default withStyles(regularFormsStyle)(Papel)


import React, { useState, useReducer, useEffect } from "react"
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from "react-datetime"
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles"

// @material-ui/icons
import DoneAll from "@material-ui/icons/DoneAll"
import AddAlert from "@material-ui/icons/AddAlert"
import Warning from "@material-ui/icons/Warning"

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
import Danger from "components/Typography/Danger.jsx"
//style
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle"

//personal
import Service from "../../services/generic.service"
import { useStore } from 'react-hookstore'
import Utils from "../../services/utils.service";

const Operacao = (props) => {
    Service.setUrl("operacao")

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
        data: '',
        dataDisplay: '',
        contratos: 0,
        tipoOperacao: 'a',
        entrada: 0,
        saida: 0,
        papel: {},
        papelId: 0,
        set: {},
        setId: 0,
        conta: {},
        contaId: 0
    }

    const [operacao, setOperacao] = useState(props.location.state ?
        ({
            ...props.location.state.operacao,
            papelId: props.location.state.operacao.papel.id,
            setId: props.location.state.operacao.set.id,
            dataDisplay: Utils.localDateToMoment(props.location.state.operacao.data)

        }) :
        initialState)

    const [papeis, setPapeis] = useState([])
    const [papeisItem, setPapeisItem] = useState([])

    const [sets, setSets] = useState([])
    const [setsItem, setSetsItem] = useState([])

    const [contas, setContas] = useState([])
    const [contasItem, setContasItem] = useState([])


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
        setOperacao({ ...operacao, [e.target.id]: e.target.value })
    }

    const handleDateTime = (e) => {
        setOperacao({ ...operacao, dataDisplay: e, data: Utils.momentToLocalDate(e) })
    }

    const handleSelect = (e, val, arr) => {
        setOperacao({ ...operacao, [e.target.name]: e.target.value, [val]: arr.find(i => i.id === e.target.value) })
    }

    const submit = async (e) => {
        e.preventDefault()

        if (operacao.dataDisplay === '' ||
            operacao.contratos === 0 ||
            operacao.entrada === 0 ||
            operacao.saida === 0 ||
            operacao.tipoOperacao === '' ||
            operacao.setId === 0 ||
            operacao.setId === 0 ||
            operacao.contaId === 0) {

            handleSnack("danger", "Necessário informar campos obrigatórios!")

            return
        }

        let [err, res] = []

        if (operacao.id === 0) {
            [err, res] = await Service.gravar(operacao)
        } else {
            [err, res] = await Service.atualizar(operacao)
        }

        handleSnack(err ? "danger" : "success",
            err
                ? err.response
                    ? err.response.data.userMessage
                    : "Ocorreu um erro ao incluir/alterar registro"
                : "Registro incluído/alterado com sucesso"
        )

        if (res) {
            setTimeout(() => {
                props.history.push("/admin/consulta/operacao")
            }, 1000)
        } else {
            console.log(err)
        }

    }

    const getContas = async () => {
        let [err, res] = await Service.buscarCustom("conta")

        if (err) {
            handleSnack("danger", "Ocorreu um erro ao buscar as Contas")
            console.log({ err })
        } else {
            let data = res.data.records.map(conta => {
                return (
                    <MenuItem
                        classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                        }}
                        value={conta.id}
                        key={conta.id}
                    >
                        {(conta.demo ? "(Demo) " : "") + conta.nome}
                    </MenuItem>
                )
            })
            setContas(res.data.records)

            setContasItem(data)
        }
    }

    const getPapeis = async () => {
        let [err, res] = await Service.buscarCustom("papel")

        if (err) {
            handleSnack("danger", "Ocorreu um erro ao buscar os Papeis")
            console.log({ err })
        } else {
            let data = res.data.records.map(papel => {
                return (
                    <MenuItem
                        classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                        }}
                        value={papel.id}
                        key={papel.id}
                    >
                        {papel.nome}
                    </MenuItem>
                )
            })

            setPapeis(res.data.records)

            setPapeisItem(data)
        }
    }

    const getSets = async () => {
        let [err, res] = await Service.buscarCustom("set")

        if (err) {
            handleSnack("danger", "Ocorreu um erro ao buscar os Sets")
            console.log({ err })
        } else {
            let data = res.data.records.map(set => {
                return (
                    <MenuItem
                        classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                        }}
                        value={set.id}
                        key={set.id}
                    >
                        {set.nome}
                    </MenuItem>
                )
            })

            setSets(res.data.records)

            setSetsItem(data)
        }
    }

    useEffect(() => {
        getContas()
        getPapeis()
        getSets()
    }, [])

    return (
        <>
            <GridContainer>
                <GridItem xs={1} />
                <GridItem xs={10} sm={10} md={10}>
                    <Card>
                        <CardHeader color={colors.app} icon>
                            <CardIcon color={colors.app}>
                                {icons.operacao}
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Cadastro Operações</h4>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={e => submit(e)}>
                                <GridItem xs={12} sm={6} md={3}>
                                    {operacao.dataDisplay && <InputLabel className={classes.label}>Data Operação *</InputLabel>}
                                    <FormControl fullWidth>
                                        <Datetime
                                            timeFormat={false}
                                            inputProps={{ placeholder: "Data Operação *" }}
                                            defaultValue={operacao.dataDisplay}
                                            dateFormat={"DD/MM/YYYY"}
                                            onChange={e => handleDateTime(e)}
                                        />
                                    </FormControl>
                                </GridItem>

                                <GridItem xs={12} sm={12} md={12}><br /> </GridItem>

                                <GridItem xs={12} sm={12} md={12}>
                                    <GridContainer>
                                        <GridItem xs={12} sm={6} md={3}>
                                            <FormControl
                                                fullWidth
                                                className={classes.selectFormControl}
                                            >
                                                <InputLabel
                                                    htmlFor="operacao-select"
                                                    className={classes.selectLabel}
                                                >
                                                    Tipo Operação *
                                                </InputLabel>
                                                <Select
                                                    MenuProps={{
                                                        className: classes.selectMenu
                                                    }}
                                                    classes={{
                                                        select: classes.select
                                                    }}
                                                    value={operacao.tipoOperacao}
                                                    onChange={(e) => setOperacao({ ...operacao, tipoOperacao: e.target.value })}
                                                    inputProps={{
                                                        name: "operacaoId",
                                                        id: "operacao-select"
                                                    }}
                                                >
                                                    <MenuItem
                                                        disabled
                                                        classes={{
                                                            root: classes.selectMenuItem
                                                        }}
                                                    >
                                                        Escolha o Tipo
                                                    </MenuItem>

                                                    <MenuItem
                                                        classes={{
                                                            root: classes.selectMenuItem
                                                        }}
                                                        value={"COMPRA"}
                                                    >
                                                        Compra
                                                    </MenuItem>
                                                    <MenuItem
                                                        classes={{
                                                            root: classes.selectMenuItem
                                                        }}
                                                        value={"VENDA"}
                                                    >
                                                        Venda
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </GridItem>
                                        <GridItem xs={12} sm={6} md={4}>
                                            <FormControl
                                                fullWidth
                                                className={classes.selectFormControl}
                                            >
                                                <InputLabel
                                                    htmlFor="conta-select"
                                                    className={classes.selectLabel}
                                                >
                                                    Conta *
                                                </InputLabel>

                                                <Select
                                                    MenuProps={{
                                                        className: classes.selectMenu
                                                    }}
                                                    classes={{
                                                        select: classes.select
                                                    }}
                                                    value={operacao.contaId}
                                                    onChange={(e) => handleSelect(e, 'conta', contas)}
                                                    inputProps={{
                                                        name: "contaId",
                                                        id: "conta-select"
                                                    }}
                                                >
                                                    <MenuItem
                                                        disabled
                                                        classes={{
                                                            root: classes.selectMenuItem
                                                        }}
                                                    >
                                                        Escolha a Conta
                                                    </MenuItem>

                                                    {contasItem}

                                                </Select>
                                            </FormControl>
                                        </GridItem>
                                    </GridContainer>
                                </GridItem>

                                <GridItem xs={12} sm={12} md={12}><br /> </GridItem>

                                <GridItem xs={12} sm={12} md={12}>
                                    <GridContainer>

                                        <GridItem xs={12} sm={6} md={3}>
                                            <FormControl
                                                fullWidth
                                                className={classes.selectFormControl}
                                            >
                                                <InputLabel
                                                    htmlFor="set-select"
                                                    className={classes.selectLabel}
                                                >
                                                    Set *
                                                </InputLabel>

                                                <Select
                                                    MenuProps={{
                                                        className: classes.selectMenu
                                                    }}
                                                    classes={{
                                                        select: classes.select
                                                    }}
                                                    value={operacao.setId}
                                                    onChange={(e) => handleSelect(e, 'set', sets)}
                                                    inputProps={{
                                                        name: "setId",
                                                        id: "set-select"
                                                    }}
                                                >
                                                    <MenuItem
                                                        disabled
                                                        classes={{
                                                            root: classes.selectMenuItem
                                                        }}
                                                    >
                                                        Escolha o Set
                                            </MenuItem>

                                                    {setsItem}

                                                </Select>
                                            </FormControl>
                                        </GridItem>
                                        <GridItem xs={12} sm={6} md={4}>
                                            <FormControl
                                                fullWidth
                                                className={classes.selectFormControl}
                                            >
                                                <InputLabel
                                                    htmlFor="papel-select"
                                                    className={classes.selectLabel}
                                                >
                                                    Papel *
                                                </InputLabel>

                                                <Select
                                                    MenuProps={{
                                                        className: classes.selectMenu
                                                    }}
                                                    classes={{
                                                        select: classes.select
                                                    }}
                                                    value={operacao.papelId}
                                                    onChange={(e) => handleSelect(e, 'papel', papeis)}
                                                    inputProps={{
                                                        name: "papelId",
                                                        id: "papel-select"
                                                    }}
                                                >
                                                    <MenuItem
                                                        disabled
                                                        classes={{
                                                            root: classes.selectMenuItem
                                                        }}
                                                    >
                                                        Escolha o papel
                                            </MenuItem>

                                                    {papeisItem}

                                                </Select>
                                            </FormControl>
                                        </GridItem>
                                    </GridContainer>
                                </GridItem>

                                <GridItem xs={12} sm={12} md={12}><br /> </GridItem>

                                <GridItem xs={12} sm={12} md={12}>
                                    <GridContainer>
                                        <GridItem xs={12} sm={4} md={3}>
                                            <CustomInput
                                                labelText="Entrada *"
                                                id="entrada"

                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number",
                                                    onChange: e => handleChange(e),
                                                    defaultValue: operacao.entrada
                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={4} md={3}>
                                            <CustomInput
                                                labelText="Saida *"
                                                id="saida"

                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number",
                                                    onChange: e => handleChange(e),
                                                    defaultValue: operacao.saida
                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={4} md={3}>
                                            <CustomInput
                                                labelText="Nº Contratos *"
                                                id="contratos"

                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number",
                                                    onChange: e => handleChange(e),
                                                    defaultValue: operacao.contratos
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

export default withStyles(regularFormsStyle)(Operacao)

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles"
import AddAlert from "@material-ui/icons/AddAlert"
import Close from "@material-ui/icons/Close"
import Edit from "@material-ui/icons/Edit"
import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx"
import Card from "components/Card/Card.jsx"
import CardBody from "components/Card/CardBody.jsx"
import CardHeader from "components/Card/CardHeader.jsx"
import CardIcon from "components/Card/CardIcon.jsx"
import Button from "components/CustomButtons/Button.jsx"
import Tooltip from '@material-ui/core/Tooltip'
import AssignmentTurnedIn from "@material-ui/icons/AssignmentTurnedIn"
import AssignmentLate from "@material-ui/icons/AssignmentLate"
// core components
import GridContainer from "components/Grid/GridContainer.jsx"
import GridItem from "components/Grid/GridItem.jsx"
import Snackbar from "components/Snackbar/Snackbar.jsx"
import React, { useReducer, useEffect, useState } from "react"
// react component for creating dynamic tables
import ReactTable from "react-table"

//personal
import Service from "../../services/generic.service"
import { useStore } from 'react-hookstore'

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    }
}

const ListaConta = (props) => {
    Service.setUrl("conta")

    const [colors] = useStore('colors')
    const [icons] = useStore('icons')

    const [contas, setContas] = useState([])

    const [state, dispatch] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            showSnack: false,
            snackColor: "info",
            snackMessage: "",
            conta: null
        },
    )

    const dataColumns = [
        {
            Header: "Conta",
            accessor: "nome"
        },
        {
            Header: "Margem Contrato",
            accessor: "margem",
            className: "actions-center"
        },
        {
            Header: "Corretora",
            accessor: "corretora"
        },
        {
            Header: "Ativo Associado",
            accessor: "ativo"
        },
        {
            Header: "Ações",
            accessor: "actions",
            filterable: false,
            sortable: false
        }
    ]

    const handleSnack = (color, message) => {
        dispatch({
            showSnack: true,
            snackColor: color,
            snackMessage: message
        })

        setTimeout(() => dispatch({ showSnack: false }), 3000)
    }

    const update = (conta) => {
        props.history.push('/admin/cadastro/conta', { conta: conta })
    }

    const remove = async (conta) => {
        let [err, res] = await Service.deletar(conta.id)

        handleSnack(err ? "danger" : "success",
            err
                ? "Impossivel apagar Conta!!"
                : "Conta apagado com Sucesso!"
        )

        if (res) {
            setContas(prevContas => prevContas.filter(a => a.id !== conta.id))
        }
    }

    const getContas = async () => {
        let [err, res] = await Service.buscar()

        if (err) {
            handleSnack("danger", "Ocorreu um erro ao buscar as Contas")
            console.log({ err })
        } else {
            let data = res.data.records.map(conta => {
                return {
                    id: conta.id,
                    nome: (<>
                        <Tooltip
                            id="tooltip-top"
                            title={conta.demo ? "Conta Demo" : "Conta Real"}
                            placement="bottom"
                            classes={{ tooltip: classes.tooltip }}
                        >
                            <Button
                                aria-label={conta.demo ? "Demo" : "Real"}
                                justIcon
                                round
                                simple
                                color={conta.demo ? "warning" : "success"}
                            >
                                {icons.conta}
                            </Button>
                        </Tooltip>
                        {" "} {conta.nome}
                    </>),
                    margem: "R$ " + conta.margemContrato.toFixed(2),
                    corretora: (<>
                        <img src={conta.corretora.foto} width="25" height="30" />
                        {"  "}
                        <a href={"https://" + conta.corretora.site} target="_blank">
                            {conta.corretora.nome}
                        </a>
                    </>),
                    ativo: conta.ativo.nome,
                    actions: (
                        <div className="actions-right">
                            <Tooltip
                                id="tooltip-top"
                                title="Editar"
                                placement="bottom"
                                classes={{ tooltip: classes.tooltip }}
                            >
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => update(conta)}
                                    color="warning"
                                    className="edit"
                                >
                                    <Edit />
                                </Button>
                            </Tooltip>
                            <Tooltip
                                id="tooltip-top"
                                title="Excluir"
                                placement="bottom"
                                classes={{ tooltip: classes.tooltip }}
                            >
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => remove(conta)}
                                    color="danger"
                                    className="remove"
                                >
                                    <Close />
                                </Button>
                            </Tooltip>
                        </div>
                    )
                }
            })
            setContas(data)
        }
    }

    useEffect(() => {
        getContas()
    }, [])

    const { classes } = props
    return (
        <>
            <GridContainer>
                <GridItem xs={1} />
                <GridItem xs={10}>
                    <Card>
                        <CardHeader color={colors.app} icon>
                            <CardIcon color={colors.app}>
                                {icons.conta}
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Contas Cadastrados</h4>
                        </CardHeader>
                        <CardBody>
                            <ReactTable
                                data={contas}
                                filterable
                                columns={dataColumns}
                                defaultPageSize={5}
                                showPaginationTop
                                showPaginationBottom
                                className="-striped -highlight"
                            />
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>

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

export default withStyles(styles)(ListaConta)

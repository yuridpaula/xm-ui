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
import TrendingUp from "@material-ui/icons/TrendingUp"
import TrendingDown from "@material-ui/icons/TrendingDown"

// core components
import GridContainer from "components/Grid/GridContainer.jsx"
import GridItem from "components/Grid/GridItem.jsx"
import Snackbar from "components/Snackbar/Snackbar.jsx"
import React, { useReducer, useEffect, useState } from "react"
// react component for creating dynamic tables
import ReactTable from "react-table"

//personal
import Service from "../../services/generic.service"
import Utils from "../../services/utils.service"
import { useStore } from 'react-hookstore'

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    }
}

const ListaOperacao = (props) => {
    Service.setUrl("operacao")

    const [colors] = useStore('colors')
    const [icons] = useStore('icons')

    const [operacoes, setOperacoes] = useState([])

    const [state, dispatch] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            showSnack: false,
            snackColor: "info",
            snackMessage: "",
            operacao: null
        },
    )

    const dataColumns = [
        {
            Header: "Conta",
            accessor: "conta"
        },
        {
            Header: "Papel",
            accessor: "papel"
        },
        {
            Header: "Set",
            accessor: "set"
        },
        {
            Header: "Data",
            accessor: "data",
            className: "actions-center"
        },
        {
            Header: "Tipo",
            accessor: "tipo",
            className: "actions-center"
        },
        {
            Header: "Contratos",
            accessor: "contratos",
            className: "actions-right"
        },
        {
            Header: "Entrada",
            accessor: "entrada",
            className: "actions-right"
        },
        {
            Header: "Saida",
            accessor: "saida",
            className: "actions-right"
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

    const update = (operacao) => {
        props.history.push('/admin/cadastro/operacao', { operacao: operacao })
    }

    const remove = async (operacao) => {
        let [err, res] = await Service.deletar(operacao.id)

        handleSnack(err ? "danger" : "success",
            err
                ? "Impossivel apagar Operacao!!"
                : "Operacao apagada com Sucesso!"
        )

        if (res) {
            setOperacoes(prevOperacoes => prevOperacoes.filter(a => a.id !== operacao.id))
        }
    }

    const getOperacoes = async () => {
        let [err, res] = await Service.buscar()

        if (err) {
            handleSnack("danger", "Ocorreu um erro ao buscar as Operacoes")
            console.log({ err })
        } else {
            let data = res.data.records.map(operacao => {
                return {
                    id: operacao.id,
                    conta: operacao.conta.nome,
                    papel: operacao.papel.nome,
                    set: operacao.set.nome,
                    data: Utils.localDateToMomentDisplay(operacao.data),
                    tipo: (
                        <>
                            <Button
                                aria-label={operacao.tipoOperacao === "COMPRA" ? "Compra" : "Venda"}
                                justIcon
                                round
                                simple
                                color={operacao.tipoOperacao === "COMPRA" ? "success" : "danger"}
                            >
                                {operacao.tipoOperacao === "COMPRA" ? <TrendingUp /> : <TrendingDown />}
                            </Button>
                            {operacao.tipoOperacao}
                        </>
                    ),
                    contratos: operacao.contratos.toFixed(2),
                    entrada: operacao.entrada.toFixed(2),
                    saida: operacao.saida.toFixed(2),
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
                                    onClick={() => update(operacao)}
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
                                    onClick={() => remove(operacao)}
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
            setOperacoes(data)
        }
    }

    useEffect(() => {
        getOperacoes()
    }, [])

    const { classes } = props
    return (
        <>
            <GridContainer>
                <GridItem xs={12}>
                    <Card>
                        <CardHeader color={colors.app} icon>
                            <CardIcon color={colors.app}>
                                {icons.operacao}
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Operacoes Cadastradas</h4>
                        </CardHeader>
                        <CardBody>
                            <ReactTable
                                data={operacoes}
                                filterable
                                columns={dataColumns}
                                defaultPageSize={10}
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

export default withStyles(styles)(ListaOperacao)

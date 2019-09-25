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
// core components
import GridContainer from "components/Grid/GridContainer.jsx"
import GridItem from "components/Grid/GridItem.jsx"
import Snackbar from "components/Snackbar/Snackbar.jsx"
import React, { useReducer, useEffect, useState } from "react"
// react component for creating dynamic tables
import ReactTable from "react-table"

//personal
import Service from "../../services/generic.service"
import Auth from "../../services/auth.service"
import { useStore } from 'react-hookstore'

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    }
}

const ListaAtivo = (props) => {
    Service.setUrl("ativo")

    const isAdmin = Auth.isAdmin()

    const [colors] = useStore('colors')
    const [icons] = useStore('icons')

    const [ativos, setAtivos] = useState([])

    const [state, dispatch] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            showSnack: false,
            snackColor: "info",
            snackMessage: "",
            ativo: null
        },
    )

    const dataColumns = [
        {
            Header: "Ativo",
            accessor: "nome"
        },
        {
            Header: "Sigla",
            accessor: "sigla"
        },
        {
            Header: "Valor Ponto",
            accessor: "valorPonto",
            className: "actions-right"
        },
        {
            Header: "Ações",
            accessor: "actions",
            sortable: false,
            filterable: false
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

    const update = (ativo) => {
        props.history.push('/admin/cadastro/ativo', { ativo: ativo })
    }

    const remove = async (ativo) => {
        let [err, res] = await Service.deletar(ativo.id)

        handleSnack(err ? "danger" : "success",
            err
                ? "Impossivel apagar Ativo!!"
                : "Ativo apagado com Sucesso!")

        if (res) {
            setAtivos(prevAtivos => prevAtivos.filter(a => a.id !== ativo.id))
        }
    }

    const getAtivos = async () => {
        let [err, res] = await Service.buscar()

        if (err) {
            handleSnack("danger", "Ocorreu um erro ao buscar os Ativos")
            console.log({ err })
        } else {
            let data = res.data.records.map(ativo => {
                return {
                    id: ativo.id,
                    nome: ativo.nome,
                    sigla: ativo.sigla,
                    valorPonto: "R$ " + ativo.valorPonto.toFixed(2),
                    actions: !isAdmin ? null : (
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
                                    onClick={() => update(ativo)}
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
                                    onClick={() => remove(ativo)}
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
            setAtivos(data)
        }
    }

    useEffect(() => {
        getAtivos()
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
                                {icons.ativo}
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Ativos Cadastrados</h4>
                        </CardHeader>
                        <CardBody>
                            <ReactTable
                                data={ativos}
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

export default withStyles(styles)(ListaAtivo)

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles"
import AddAlert from "@material-ui/icons/AddAlert"
import CloudDownload from "@material-ui/icons/CloudDownload"
import Block from "@material-ui/icons/Block"
import CheckCircle from "@material-ui/icons/CheckCircle"
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

const ListaSet = (props) => {
    Service.setUrl("set")

    const isAdmin = Auth.isAdmin()

    const [colors] = useStore('colors')
    const [icons] = useStore('icons')

    const [sets, setSets] = useState([])

    const [state, dispatch] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            showSnack: false,
            snackColor: "info",
            snackMessage: "",
            set: null
        },
    )

    const dataColumns = [
        {
            Header: "Set",
            accessor: "nome"
        },
        {
            Header: "Observação",
            accessor: "observacao"
        },
        {
            Header: "Média Móvel",
            accessor: "mediaMovel",
            className: "actions-right"
        },
        {
            Header: "Distancia da Média",
            accessor: "distanciaMedia",
            className: "actions-right"
        },
        {
            Header: "Distancia da Ordem",
            accessor: "distanciaOrdem",
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

    const update = (set) => {
        props.history.push('/admin/cadastro/set', { set: set })
    }

    const remove = async (set) => {
        let [err, res] = await Service.deletar(set.id)

        handleSnack(err ? "danger" : "success",
            err
                ? "Impossivel apagar Set!!"
                : "Set apagado com Sucesso!"
        )

        if (res) {
            setSets(prevSets => prevSets.filter(a => a.id !== set.id))
        }
    }

    const getSets = async () => {
        let [err, res] = await Service.buscar()

        if (err) {
            handleSnack("danger", "Ocorreu um erro ao buscar os Sets")
            console.log({ err })
        } else {
            let data = res.data.records.map(set => {
                return {
                    id: set.id,
                    nome: set.nome,
                    observacao: set.observacao,
                    mediaMovel: set.mediaMovel,
                    distanciaMedia: set.distanciaMedia,
                    distanciaOrdem: set.distanciaOrdem,
                    nome: (set.ativo ?
                        (<>
                            <Tooltip
                                id="tooltip-top"
                                title="Ativo"
                                placement="bottom"
                                classes={{ tooltip: classes.tooltip }}
                            >
                                <Button
                                    aria-label={"Ativo"}
                                    justIcon
                                    round
                                    simple
                                    color="success"
                                >
                                    <CheckCircle />
                                </Button>
                            </Tooltip>
                            {" "} {set.nome}
                        </>) :
                        (<>
                            <Tooltip
                                id="tooltip-top"
                                title="Desativado"
                                placement="bottom"
                                classes={{ tooltip: classes.tooltip }}
                            >
                                <Button
                                    aria-label={"Desativado"}
                                    justIcon
                                    round
                                    simple
                                    color="danger"
                                >
                                    <Block />
                                </Button>
                            </Tooltip>
                            {" "} {set.nome}
                        </>)),
                    actions: !isAdmin ? (
                        <div className="actions-right">
                            <Tooltip
                                id="tooltip-top"
                                title="Download"
                                placement="bottom"
                                classes={{ tooltip: classes.tooltip }}
                            >
                                <Button
                                    justIcon
                                    round
                                    simple
                                    href={set.urlDownload}
                                    disabled={!isAdmin}
                                    color="info"
                                    className="edit"
                                >
                                    <CloudDownload />
                                </Button>
                            </Tooltip>
                        </div>) : (
                            <div className="actions-right">
                                <Tooltip
                                    id="tooltip-top"
                                    title="Download"
                                    placement="bottom"
                                    classes={{ tooltip: classes.tooltip }}
                                >
                                    <Button
                                        justIcon
                                        round
                                        simple
                                        href={set.urlDownload}
                                        disabled={!isAdmin}
                                        color="info"
                                        className="edit"
                                    >
                                        <CloudDownload />
                                    </Button>
                                </Tooltip>
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
                                        disabled={!isAdmin}
                                        onClick={() => update(set)}
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
                                        disabled={!isAdmin}
                                        onClick={() => remove(set)}
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
            setSets(data)
        }
    }

    useEffect(() => {
        getSets()
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
                                {icons.set}
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Sets Cadastrados</h4>
                        </CardHeader>
                        <CardBody>
                            <ReactTable
                                data={sets}
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

export default withStyles(styles)(ListaSet)

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

const ListaCorretora = (props) => {
    Service.setUrl("corretora")

    const isAdmin = Auth.isAdmin()

    const [colors] = useStore('colors')
    const [icons] = useStore('icons')

    const [corretoras, setCorretoras] = useState([])

    const [state, dispatch] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            showSnack: false,
            snackColor: "info",
            snackMessage: "",
            corretora: null
        },
    )

    const dataColumns = [
        {
            Header: "",
            accessor: "logo"
        },
        {
            Header: "Corretora",
            accessor: "nome"
        },
        {
            Header: "Site",
            accessor: "site"
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

    const update = (corretora) => {
        props.history.push('/admin/cadastro/corretora', { corretora: corretora })
    }

    const remove = async (corretora) => {
        let [err, res] = await Service.deletar(corretora.id)

        handleSnack(err ? "danger" : "success",
            err
                ? "Impossivel apagar Corretora!!"
                : "Corretora apagado com Sucesso!"
        )

        if (res) {
            setCorretoras(prevCorretoras => prevCorretoras.filter(a => a.id !== corretora.id))
        }
    }

    const getCorretoras = async () => {
        let [err, res] = await Service.buscar()

        if (err) {
            handleSnack("danger", "Ocorreu um erro ao buscar as Corretoras")
            console.log({ err })
        } else {
            let data = res.data.records.map(corretora => {
                return {
                    id: corretora.id,
                    logo: (<img src={corretora.foto} width="50" height="60" />),
                    nome: corretora.nome,
                    site: (<><a href={"https://" + corretora.site} target="_blank">{corretora.site}</a></>),
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
                                    disabled={!isAdmin}
                                    onClick={() => update(corretora)}
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
                                    onClick={() => remove(corretora)}
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
            setCorretoras(data)
        }
    }

    useEffect(() => {
        getCorretoras()
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
                                {icons.corretora}
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Corretoras Cadastrados</h4>
                        </CardHeader>
                        <CardBody>
                            <ReactTable
                                data={corretoras}
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

export default withStyles(styles)(ListaCorretora)

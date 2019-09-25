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
import Utils from "../../services/utils.service"
import Auth from "../../services/auth.service"
import { useStore } from 'react-hookstore'

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    }
}

const ListaPapel = (props) => {
    Service.setUrl("papel")

    const isAdmin = Auth.isAdmin()

    const [colors] = useStore('colors')
    const [icons] = useStore('icons')

    const [papeis, setPapeis] = useState([])

    const [state, dispatch] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            showSnack: false,
            snackColor: "info",
            snackMessage: "",
            papel: null
        },
    )

    const dataColumns = [
        {
            Header: "Papel",
            accessor: "nome"
        },
        {
            Header: "Ativo",
            accessor: "ativo"
        },
        {
            Header: "Vencimento",
            accessor: "vencimento",
            className: "actions-center"
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

    const update = (papel) => {
        props.history.push('/admin/cadastro/papel', { papel: papel })
    }

    const remove = async (papel) => {
        let [err, res] = await Service.deletar(papel.id)

        handleSnack(err ? "danger" : "success",
            err
                ? "Impossivel apagar Papel!!"
                : "Papel apagado com Sucesso!"
        )

        if (res) {
            setPapeis(prevPapeis => prevPapeis.filter(a => a.id !== papel.id))
        }
    }

    const getPapeis = async () => {
        let [err, res] = await Service.buscar()

        if (err) {
            handleSnack("danger", "Ocorreu um erro ao buscar as Papeis")
            console.log({ err })
        } else {
            let data = res.data.records.map(papel => {
                console.log(papel)
                return {
                    id: papel.id,
                    nome: papel.nome,
                    ativo: papel.ativo.nome,
                    vencimento: Utils.localDateToMomentDisplay(papel.vencimento),
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
                                    onClick={() => update(papel)}
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
                                    onClick={() => remove(papel)}
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
            setPapeis(data)
        }
    }

    useEffect(() => {
        getPapeis()
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
                                {icons.papel}
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Papeis Cadastrados</h4>
                        </CardHeader>
                        <CardBody>
                            <ReactTable
                                data={papeis}
                                filterable
                                columns={dataColumns}
                                defaultPageSize={papeis.length > 5 ? 10 : 5}
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

export default withStyles(styles)(ListaPapel)

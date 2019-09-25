import React, { useEffect, useState, useReducer } from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AddAlert from "@material-ui/icons/AddAlert"
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
import Store from "@material-ui/icons/Store";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Refresh from "@material-ui/icons/Refresh";
import Edit from "@material-ui/icons/Edit";
import Place from "@material-ui/icons/Place";
import ArtTrack from "@material-ui/icons/ArtTrack";
import Language from "@material-ui/icons/Language";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Table from "components/Table/Table.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Danger from "components/Typography/Danger.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx"
import CardText from "components/Card/CardText.jsx"
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";

import {
    roundedLineChart,
    straightLinesChart,
    simpleBarChart,
    colouredLineChart,
    multipleBarsChart,
    colouredLinesChart,
    pieChart
} from "variables/charts.jsx";

import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";

import priceImage1 from "assets/img/card-2.jpeg";
import priceImage2 from "assets/img/card-3.jpeg";
import priceImage3 from "assets/img/card-1.jpeg";

import { useStore } from 'react-hookstore'
import Service from "../../services/generic.service"

var Chartist = require("chartist");

const DashContent = (props) => {

    const [colors] = useStore('colors')

    const classes = props.classes

    const initialState = {
        drawDown: 0,
        mediaRentabilidade: 0,
        operacoes: 0,
        pontos: 0,
        rebaixamentoSaldo: 0,
        valor: 0,
        anos: []
    }

    const [anos, setAnos] = useState([])
    const [anosTabs, setAnosTabs] = useState([])

    const [content, setContent] = useState(initialState)

    const [state, dispatch] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            showSnack: false,
            snackColor: "info",
            snackMessage: "",
            ativo: null
        },
    )

    const [saldoChart, setSaldoChart] = useState({}) 

    const [pontosChart, setPontosChart] = useState({})


    const getData = async () => {
        let [err, res] = await Service.buscarCustom("geral/user")

        if (err) {
            handleSnack("danger", "Ocorreu um erro ao buscar os Dados Gerais")
            console.log({ err })
        } else {
            let data = res.data.records.map(content => {
                return content
            })

            let anosArray = data[0].anos.map(a => {
                return [
                    a.ano,
                    a.operacoes,
                    a.pontos.toLocaleString(),
                    `R$ ${a.valor.toFixed(2)}`
                ]
            })

            let tabs = data[0].anos.map(ano => {
                return {
                    tabName: ano.ano,
                    tabIcon: DateRange,
                    tabContent: (
                        <Table
                            hover
                            tableHeaderColor={"warning"}
                            tableHead={["Mês", "Operações", "Pontos", "Valor"]}
                            tableData={ano.meses.map(mes => {
                                return [
                                    mes.nomeMes,
                                    mes.operacoes,
                                    mes.pontos.toLocaleString(),
                                    `R$ ${mes.valor.toFixed(2)}`
                                ]
                            })}
                        />
                    )
                }
            })

            let newArray = []

            data[0].anos.map(ano => {
                ano.meses.map(mes => {
                    newArray.push(
                        {
                            mes: `${ano.ano.toString().substr(2, 2)}/${mes.nomeMes.substr(0, 3)}`,
                            valor: mes.valor,
                            pontos: mes.pontos
                        })
                })
            })
            newArray.reverse()

            let pontos = 0
            let valor = 0

            newArray.map(m => {
                pontos += m.pontos
                valor += m.valor

                m.pontos = pontos
                m.valor = valor
            })

            newArray = newArray.splice(newArray.length > 12 ? newArray.length - 12 : 0)

            let labels = []
            let pontosSerie = []
            let saldoSerie = []

            newArray.map(a => {
                labels.push(a.mes)
                pontosSerie.push(a.pontos)
                saldoSerie.push(a.valor)
            })

            const delays = 800
            const durations = 5000

            setSaldoChart({
                data: {
                    labels: labels,
                    series: [saldoSerie]
                },
                options: {
                    lineSmooth: Chartist.Interpolation.cardinal({
                        tension: 2
                    }),
                    axisY: {
                        showGrid: true,
                        offset: 40
                    },
                    axisX: {
                        showGrid: true
                    },
                    low: Math.min.apply(Math, saldoSerie),
                    high: Math.max.apply(Math, saldoSerie),
                    showPoint: true,
                    height: "300px",
                    showArea: true
                },
                animation: {
                    draw: (data) => {
                        if (data.type === "line" || data.type === "area") {
                            data.element.animate({
                                d: {
                                    begin: 600,
                                    dur: 700,
                                    from: data.path
                                        .clone()
                                        .scale(1, 0)
                                        .translate(0, data.chartRect.height())
                                        .stringify(),
                                    to: data.path.clone().stringify(),
                                    easing: Chartist.Svg.Easing.easeOutQuint
                                }
                            });
                        } else if (data.type === "point") {
                            data.element.animate({
                                opacity: {
                                    begin: (data.index + 1) * delays,
                                    dur: durations,
                                    from: 0,
                                    to: 1,
                                    easing: "ease"
                                }
                            });
                        }
                    }
                }
            })

            setPontosChart({
                data: {
                    labels: labels,
                    series: [pontosSerie]
                },
                options: {
                    lineSmooth: Chartist.Interpolation.cardinal({
                        tension: 2
                    }),
                    axisY: {
                        showGrid: true,
                        offset: 40
                    },
                    axisX: {
                        showGrid: true
                    },
                    low: Math.min.apply(Math, pontosSerie),
                    high: Math.max.apply(Math, pontosSerie),
                    showPoint: true,
                    height: "300px",
                    showArea: true
                },
                animation: {
                    draw: (data) => {
                        if (data.type === "line" || data.type === "area") {
                            data.element.animate({
                                d: {
                                    begin: 600,
                                    dur: 700,
                                    from: data.path
                                        .clone()
                                        .scale(1, 0)
                                        .translate(0, data.chartRect.height())
                                        .stringify(),
                                    to: data.path.clone().stringify(),
                                    easing: Chartist.Svg.Easing.easeOutQuint
                                }
                            });
                        } else if (data.type === "point") {
                            data.element.animate({
                                opacity: {
                                    begin: (data.index + 1) * delays,
                                    dur: durations,
                                    from: 0,
                                    to: 1,
                                    easing: "ease"
                                }
                            });
                        }
                    }
                }
            })

            setContent(data[0])
            setAnos(anosArray)
            setAnosTabs(tabs)
        }
    }

    const handleSnack = (color, message) => {
        dispatch({
            showSnack: true,
            snackColor: color,
            snackMessage: message
        })

        setTimeout(() => dispatch({ showSnack: false }), 3000)
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <GridContainer>
                <GridItem xs={12} sm={4} md={3} lg={2}>
                    <Card>
                        <CardHeader color={content.valor < 0 ? "danger" : "success"} stats icon>
                            <CardText color={content.valor < 0 ? "danger" : "success"}>
                                <Icon>{content.valor < 0 ? "money_off" : "monetization_on"}</Icon>
                            </CardText>
                            <p className={classes.cardCategory}>Posição<br />Geral</p>
                            <h3 className={classes.cardTitle}>
                                <small>R$ </small>{content.valor.toFixed(2)}
                            </h3>
                        </CardHeader>
                        <CardFooter stats />
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={4} md={3} lg={2}>
                    <Card>
                        <CardHeader color={content.pontos < 0 ? "danger" : "success"} stats icon>
                            <CardText color={content.pontos < 0 ? "danger" : "success"}>
                                <Icon>{content.pontos < 0 ? "trending_down" : "trending_up"}</Icon>
                            </CardText>
                            <p className={classes.cardCategory}>Total<br />Pontos</p>
                            <h3 className={classes.cardTitle}>
                                <small></small>{content.pontos.toLocaleString()}
                            </h3>
                        </CardHeader>
                        <CardFooter stats />
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={4} md={3} lg={2}>
                    <Card>
                        <CardHeader color={"info"} stats icon>
                            <CardText color={"info"}>
                                <Icon>swap_vertical_circle</Icon>
                            </CardText>
                            <p className={classes.cardCategory}>Total<br />Operações</p>
                            <h3 className={classes.cardTitle}>
                                <small></small>{content.operacoes}
                            </h3>
                        </CardHeader>
                        <CardFooter stats />
                    </Card>
                </GridItem>


                <GridItem xs={12} sm={4} md={3} lg={2}>
                    <Card>
                        <CardHeader color={"danger"} stats icon>
                            <CardText color={"info"}>
                                <Icon>work_outline</Icon>
                            </CardText>
                            <p className={classes.cardCategory}>Rentabilidade<br />Média</p>
                            <h3 className={classes.cardTitle}>
                                {content.mediaRentabilidade.toFixed(2).toLocaleString()}<small> %</small>
                            </h3>
                        </CardHeader>
                        <CardFooter stats />
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={4} md={3} lg={2}>
                    <Card>
                        <CardHeader color={"warning"} stats icon>
                            <CardText color={"warning"}>
                                <Icon>trending_down</Icon>
                            </CardText>
                            <p className={classes.cardCategory}>DrawDown<br />(pontos)</p>
                            <h3 className={classes.cardTitle}>
                                <small></small>{content.drawDown.toLocaleString()}
                            </h3>
                        </CardHeader>
                        <CardFooter stats />
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={4} md={3} lg={2}>
                    <Card>
                        <CardHeader color={"warning"} stats icon>
                            <CardText color={"warning"}>
                                <Icon>trending_down</Icon>
                            </CardText>
                            <p className={classes.cardCategory}>Rebaixamento<br />de Saldo</p>
                            <h3 className={classes.cardTitle}>
                                <small>R$ </small>{content.rebaixamentoSaldo.toFixed(2)}
                            </h3>
                        </CardHeader>
                        <CardFooter stats />
                    </Card>
                </GridItem>

                <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                            <Card>
                                <CardHeader color={colors.app} icon>
                                    <CardIcon color={colors.app}>
                                        <Icon>monetization_on</Icon>
                                    </CardIcon>
                                    <h4 className={classes.cardIconTitle}>
                                        Saldo em R$ (útimos 12 Meses)
                                    </h4>
                                </CardHeader>
                                <CardBody>
                                    <ChartistGraph
                                        data={saldoChart.data}
                                        type="Line"
                                        options={saldoChart.options}
                                        listener={saldoChart.animation}
                                    />
                                </CardBody>
                            </Card>
                        </GridItem>

                        <GridItem xs={12} sm={12} md={6}>
                            <Card>
                                <CardHeader color={colors.app} icon>
                                    <CardIcon color={colors.app}>
                                        <Icon>trending_up</Icon>
                                    </CardIcon>
                                    <h4 className={classes.cardIconTitle}>
                                        Saldo em Pontos (útimos 12 Meses)
                                    </h4>
                                </CardHeader>
                                <CardBody>
                                    <ChartistGraph
                                        data={pontosChart.data}
                                        type="Line"
                                        options={pontosChart.options}
                                        listener={pontosChart.animation}
                                    />
                                </CardBody>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </GridItem>


                <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6} lg={6}>
                            <Card>
                                <CardHeader color={colors.app} text>
                                    <CardText color={colors.app}>
                                        <h4 className={classes.cardTitleWhite}>Resultado Anual</h4>
                                    </CardText>
                                </CardHeader>
                                <CardBody>
                                    <Table
                                        hover
                                        tableHeaderColor={"warning"}
                                        tableHead={["Ano", "Operações", "Pontos", "Valor"]}
                                        tableData={anos}
                                    />
                                </CardBody>
                            </Card>
                        </GridItem>

                        <GridItem xs={12} sm={12} md={6} lg={6}>
                            <CustomTabs
                                title={"Resultado Mensal"}
                                headerColor={colors.app}
                                tabs={anosTabs}
                            />
                        </GridItem>
                    </GridContainer>
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

export default withStyles(dashboardStyle)(DashContent)
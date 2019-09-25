const moment = require('moment')

const Utils = {
    localDateToMoment(date){
        let dia = date[2]
        let mes = date[1]
        let ano = date[0]

        let newDate = moment()

        newDate.year(ano)
        newDate.month(mes - 1)
        newDate.date(dia)

        return newDate
    },

    localDateToMomentDisplay(date) {
        return (date ? this.localDateToMoment(date).format("DD/MM/YYYY") : null)
    },

    momentToLocalDate(moment) {
        return (moment ? moment.toISOString().split("T")[0] : null)
    }



}

export default Utils
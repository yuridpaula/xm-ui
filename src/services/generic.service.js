import { ApiBase, ApiVersion, promiseHandler } from './base.service'

// eslint-disable-next-line
let url 

const Service = {

    setUrl(comp) {
        this.url = `${ApiVersion}${comp}`
    },

    buscar() {
        return promiseHandler(ApiBase.get(this.url))
    },

    deletar(id) {
        return promiseHandler(ApiBase.delete(`${this.url}/${id}`))
    },

    buscarPorId(id) {
        return promiseHandler(ApiBase.get(`${this.url}/${id}`))
    },

    gravar(entity) {
        return promiseHandler(ApiBase.post(`${this.url}`, entity))
    },

    atualizar(entity) {
        return promiseHandler(ApiBase.put(`${this.url}/${entity.id}`, entity))
    },

    buscarCustom(comp) {
        return promiseHandler(ApiBase.get(`${ApiVersion}${comp}`))
    }

}

export default Service
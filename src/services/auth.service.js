import { ApiBase, ApiVersion, promiseHandler } from './base.service'
import JwtDecode from 'jwt-decode'

const Auth = {

    async autenticar(auth) {
        let [err, res] = await promiseHandler(ApiBase.post('auth', auth))

        if (res) {
            localStorage.setItem("token", res.data.records[0].token)
        }

        return [err, res]
    },

    cadastrar(user) {
        return promiseHandler(ApiBase.post(`${ApiVersion}usuario`, user))
    },

    isAuthenticated() {
        let token = localStorage.getItem("token")
        let expired = true
        if (token) {
            let decoded = JwtDecode(token)
            //console.log({ decoded })
            expired = ((decoded.created + decoded.exp) < (Date.now() / 1000))

        }
        return token !== null && token !== undefined && !expired
    },

    sair() {
        //console.log('dentro do sair')
        localStorage.removeItem("token")        
    },

    isAdmin() {
        let token = localStorage.getItem("token")
        let isAdmin = false
        if (token) {
            let decoded = JwtDecode(token)
            isAdmin = decoded.role === "ROLE_ADMIN"

        }
        return isAdmin
    }

}

export default Auth

import axios from 'axios';

export let ApiBase = axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json'
    }
})

ApiBase.interceptors.request.use(async (config) => {
    //const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5dXJpb2RwQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTVUFSSU8iLCJjcmVhdGVkIjoxNTU4MTE1NTQxNTUzLCJleHAiOjIxNjI5MTU1NDF9.2hlCA5O2fPN5V8mAj1gz5xKaUUGgJ5RQ6tVe44bmq0ZL_uPxko2_eSbnZpzz8K875o3Jh7LiC0bHGzDfXVcMig'

    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = 'Bearer ' + token
    } else {
        config.headers.Authorization = null
    }


    return config
})

export var ApiVersion = 'v1/'

export function promiseHandler(promise) {
    return promise.then(data => {
        return [null, data]
    })
        .catch(err => [err, null])
}

export default { ApiBase, ApiVersion, promiseHandler }

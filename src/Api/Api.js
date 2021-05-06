import axios from 'axios'

export const participativoApi = axios.create({
    baseUrl: 'https://participativo.com.br/api/',
    timeout: 1000
})

export const participativoAvatarFile = axios.create({
    baseUrl: 'https://participativo.com.br/api/download/avatar?file=',
    timeout: 1000
})

export const participativoImagePublication = axios.create({
    baseUrl: 'https://participativo.com.br/api/download/image?file=',
    timeout: 1000
})

export const participativoLogin = axios.create({
    baseUrl: 'https://participativo.com.br/login',
    timeout: 1000
})
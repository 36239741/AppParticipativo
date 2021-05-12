import axios from 'axios'
import { getToken } from '../Service/auth'

const TIME_OUT = 5000;

export const participativoApi = axios.create({
    baseURL: 'https://participativo.com.br/api/',
    timeout: TIME_OUT,
})

export const participativoAvatarFile = axios.create({
    baseURL: 'https://participativo.com.br/api/download/avatar?file=',
    timeout: TIME_OUT
})

export const participativoImagePublication = axios.create({
    baseURL: 'https://participativo.com.br/api/download/image?file=',
    timeout: TIME_OUT
})

export const participativoLogin = axios.create({
    baseURL: 'https://participativo.com.br',
    timeout: TIME_OUT
})
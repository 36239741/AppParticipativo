import {participativoApi} from '../Api/Api'


export function create(user) {
    return participativoApi.post('usuarios', user)
}
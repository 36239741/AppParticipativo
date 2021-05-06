import {participativoApi} from '../Api/Api'


export function uploadAvatar(file, type, uuid) {

    let url;

    const formData = new FormData();

    if (type === 'user') {

      url = 'upload/avatar'
      formData.append('file', file);

    } else {

      url = 'upload/image';
      formData.append('file', file);
      formData.append('publicacao', uuid);

    }

    return participativoApi.post(url, formData);

  }
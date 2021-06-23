import { isEmpty, isNil } from 'lodash';
import axios from 'axios';

export function fetchApisByProductId(args = {}, headers = {}, timeout) {
  return new Promise((resolve, reject) => {
    const { productId } = args;
    if (isEmpty(productId)) {
      return reject(new Error(`productId를 확인해 주세요`));
    }
    const url = `/api/tool/v1/products/${productId}/apis`;
    const config = {
      timeout,
      headers,
      maxRedirects: 0
    };

    return resolve(axios.get(url, config));
  });
}

export function fetchArtifacts(args = {}, headers = {}, timeout) {
  return new Promise((resolve, reject) => {
    const { baseDomain } = args;
    const url = `${baseDomain}/artifacts`;
    const config = {
      timeout,
      headers,
      maxRedirects: 0
    };

    return resolve(axios.get(url, config));
  });
}

export function fetchCellsByArtifactId(args = {}, headers = {}, timeout) {
  return new Promise((resolve, reject) => {
    const { baseDomain, artifactId } = args;
    console.log(args);

    if (isNil(artifactId)) {
      return reject(new Error(`artifactId를 확인해주세요`));
    }

    const url = `${baseDomain}/artifacts/${artifactId}/cells`;

    const config = {
      timeout,
      headers,
      maxRedirects: 0
    };

    return resolve(axios.get(url, config));
  });
}

export function saveCell(args = {}, headers = {}, timeout) {
  return new Promise((resolve, reject) => {
    const { baseDomain, artifactId, cellId, imageUrl } = args;

    if (isNil(artifactId)) {
      return reject(new Error(`artifactId를 확인해주세요`));
    }

    if (isNil(cellId)) {
      return reject(new Error(`cellId를 확인해주세요`));
    }

    // if (isEmpty(imageUrl)) {
    //   return reject(new Error(`imageUrl을 확인해주세요`))
    // }

    const formData = new FormData();
    formData.append('file', imageUrl);
    console.log(formData);
    console.log(formData.get('file'));

    const url = `${baseDomain}/artifacts/${artifactId}/cells/${cellId}`;
    const config = {
      timeout,
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data'
      },
      maxRedirects: 0
    };

    return resolve(axios.post(url, formData, config));
  });
}

export default {
  fetchApisByProductId,
  fetchCellsByArtifactId,
  saveCell
};

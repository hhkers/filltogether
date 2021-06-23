import axios from 'axios';
import {
  FILLTOGETHER_CONTRACT_ADDRESS,
  ADMIN_ADDRESS,
  CELL_PRICE
} from '../constants';

export const A2P_API_PREPARE_URL =
  'https://a2a-api.klipwallet.com/v2/a2a/prepare';
export const APP_NAME = 'Fill Together';
export const DEFAULT_QR_CODE = APP_NAME;

export const buyCell = (artifactId, cellId, qrCallback, resCallback) => {
  const functionJson =
    '{ "constant": false, "inputs": [ { "name": "artworkId", "type": "string" }, { "name": "pos", "type": "uint256" }, { "name": "adminWallet", "type": "address" } ], "name": "buyPosition", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }';
  executeContract(
    FILLTOGETHER_CONTRACT_ADDRESS,
    functionJson,
    CELL_PRICE,
    `[\"${artifactId}\",\"${cellId}\",\"${ADMIN_ADDRESS}\"]`,
    qrCallback,
    resCallback
  );
};

export const getAddressByKlip = (qrCallback, resCallback) => {
  axios
    .post(A2P_API_PREPARE_URL, {
      bapp: {
        name: APP_NAME
      },
      type: 'auth'
    })
    .then(response => {
      const { request_key } = response.data;
      const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
      qrCallback(qrcode);
      const timerId = setInterval(() => {
        axios
          .get(
            `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
          )
          .then(res => {
            if (res.data.result) {
              resCallback(res.data.result.klaytn_address);
              clearInterval(timerId);
            }
          });
      }, 1000);
    });
};

export const executeContract = (
  txTo,
  functionJSON,
  value,
  params,
  qrCallback,
  resCallback
) => {
  axios
    .post(A2P_API_PREPARE_URL, {
      bapp: {
        name: APP_NAME
      },
      type: 'execute_contract',
      transaction: {
        to: txTo,
        abi: functionJSON,
        value: value,
        params: params
      }
    })
    .then(response => {
      const { request_key } = response.data;
      const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
      qrCallback(qrcode);
      let timerId = setInterval(() => {
        axios
          .get(
            `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
          )
          .then(res => {
            if (res.data.result && res.data.result.status !== 'pending') {
              console.log(`[Result] ${JSON.stringify(res.data.result)}`);
              resCallback(res.data.result);
              clearInterval(timerId);
            }
          });
      }, 1000);
    });
};

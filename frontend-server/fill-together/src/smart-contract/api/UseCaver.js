/* eslint-disable */

import Caver from 'caver-js';
import FillTogetherABI from '../abi/FillTogetherABI.json';
import {
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  CHAIN_ID,
  FILLTOGETHER_CONTRACT_ADDRESS
} from '../constants';

const option = {
  headers: [
    {
      name: 'Authorization',
      value: `Basic ${Buffer.from(
        `${ACCESS_KEY_ID}:${SECRET_ACCESS_KEY}`
      ).toString('base64')}`
    },
    {
      name: 'x-chain-id',
      value: CHAIN_ID
    }
  ]
};

const caver = new Caver(
  new Caver.providers.HttpProvider(
    'https://node-api.klaytnapi.com/v1/klaytn',
    option
  )
);

const fillTogetherContract = new caver.contract(
  FillTogetherABI,
  FILLTOGETHER_CONTRACT_ADDRESS
);

export const getBalance = address => {
  return caver.rpc.klay.getBalance(address).then(response => {
    const balance = caver.utils.convertFromPeb(
      caver.utils.hexToNumberString(response)
    );
    console.log(`BALANCE : ${balance}`);
    return balance;
  });
};

export const getOwner = async (artifactId, cellId) => {
  const owner = await fillTogetherContract.methods.owner(artifactId, cellId).call();
  return owner;
};

/* eslint-enable */

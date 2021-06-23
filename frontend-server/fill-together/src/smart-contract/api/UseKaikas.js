import { isNil, get } from 'lodash';

export const getAddressByKaikas = (onSuccess, onFailure) => {
  if (!isNil(window.klaytn)) {
    // windos.klaytn.enable() returns Promise
    window.klaytn
      .enable()
      .then(response => {
        onSuccess(get(response, '0', null));
      })
      .catch(error => {
        console.log(error);
        onFailure();
      });
  } else {
    console.log('window.klaytn is null');
    alert('kaikas 플러그인 설치를 확인해주세요!');
    onFailure();
  }
};

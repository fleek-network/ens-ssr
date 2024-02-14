// Namehash utility: https://github.com/web3/web3.js/blob/4.x/packages/web3-eth-ens/src/utils.ts

import { sha3Raw } from 'web3-utils';
import { ens_normalize } from '@adraffy/ens-normalize';

export const namehash = (inputName) => {
  // Reject empty names:
  let node = '';
  for (let i = 0; i < 32; i += 1) {
    node += '00';
  }

  if (inputName) {
    const name = ens_normalize(inputName);
    const labels = name.split('.');

    for (let i = labels.length - 1; i >= 0; i -= 1) {
      const labelSha = sha3Raw(labels[i]).slice(2);
      node = sha3Raw(`0x${node}${labelSha}`).slice(2);
    }
  }

  return `0x${node}`;
};

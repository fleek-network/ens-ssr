import { Web3Eth } from 'web3-eth';

BigInt.prototype.toJSON = function() { return this.toString() }

export async function main(name = "ens.eth") {
  let eth = new Web3Eth('https://cloudflare-eth.com');
  const block = await eth.getBlock(0);
  return JSON.stringify(block);
};

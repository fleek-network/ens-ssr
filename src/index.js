import { Web3Eth } from 'web3-eth';
import { ENS } from 'web3-eth-ens';
import { namehash } from './utils.js';

const eth = new Web3Eth('https://cloudflare-eth.com');
const ens = new ENS(undefined, 'https://cloudflare-eth.com');

export const main = async (name = "ens.eth") => {
  const resolver = await ens.getResolver(name);
  const hash = namehash(name);

  // TODO: Batch these contract calls
  const [[eth_address, eth_balance], github, twitter, avatar] = await Promise.all([
    resolver.methods.addr(hash, 60).call().then(async (address) => {
      const balance = await eth.getBalance(address);
      return [address, balance];
    }),
    resolver.methods.text(hash, 'com.github').call(),
    resolver.methods.text(hash, 'com.twitter').call(),
    resolver.methods.text(hash, 'avatar').call()
  ]);

  return `<html>
  <body>
    <image src="${avatar}" width="150px"/>
    <h1>${name}</h1>
    <p>Address: ${eth_address}</p>
    <p>Balance: ${eth_balance} Wei</p>
    <p>Github: ${github}</p>
    <p>Twitter: ${twitter}</p>
  </body>
</html>`;
};

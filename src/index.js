import { Web3 } from 'web3';
import { namehash } from './utils.js';

const web3 = new Web3('https://cloudflare-eth.com');

export const main = async (name = "ens.eth") => {
  const resolver = await web3.eth.ens.getResolver(name);
  const hash = namehash(name);

  // TODO: Batch these contract calls
  const eth_address = await resolver.methods.addr(hash, 60).call(); // 60 = ETH
  const github = await resolver.methods.text(hash, 'com.github').call();
  const twitter = await resolver.methods.text(hash, 'com.twitter').call();

  const eth_balance = await web3.eth.getBalance(eth_address);

  return `<html>
  <body>
    <h1>${name}</h1>
    <p>Address: ${eth_address}</p>
    <p>Balance: ${eth_balance} Wei</p>
    <p>Github: @${github}</p>
    <p>Twitter: @${twitter}</p>
  </body>
</html>`;
};

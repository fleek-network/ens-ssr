import { Web3 } from 'web3';

BigInt.prototype.toJSON = function() { return this.toString() }


export async function main(name = "ens.eth") {
  const web3 = new Web3('https://cloudflare-eth.com');
  const address = await web3.eth.ens.getAddress(name);
  const eth_balance = await web3.eth.getBalance(address);

  return `<html>
  <body>
    <h1>${name}</h1>
    <p>Address: ${address}</p>
    <p>Balance: ${eth_balance} Wei</p>
  </body>
</html>`;
};

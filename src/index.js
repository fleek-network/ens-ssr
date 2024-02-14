import { Web3Eth } from "web3-eth";
import { ENS } from "web3-eth-ens";
import { fromWei } from "web3-utils";
import { namehash } from "./utils.js";

const eth = new Web3Eth("https://cloudflare-eth.com");
const ens = new ENS(undefined, "https://cloudflare-eth.com");

export const main = async () => {
  // Parse the ens name from the request path `/:name/*`
  const name = location.pathname.substring(1).split("/")[0] || "ens.eth";

  // Get the resolver contract for the name
  const resolver = await ens.getResolver(name);
  const hash = namehash(name);

  // Fetch all the needed data from the resolver contract in parallel
  const [
    [eth_address, eth_balance],
    github,
    twitter,
    avatar,
  ] = await Promise.all([
    resolver.methods.addr(hash, 60).call().then(async (address) => {
      const balance = fromWei(await eth.getBalance(address), "ether");
      return [address, balance];
    }),
    resolver.methods.text(hash, "com.github").call(),
    resolver.methods.text(hash, "com.twitter").call(),
    resolver.methods.text(hash, "avatar").call(),
  ]);

  // Render final html
  return `<html>
  <body>
    <image src="${avatar}" width="150px"/>
    <h1>${name}</h1>
    <p>Address: ${eth_address}</p>
    <p>Balance: ${eth_balance}</p>
    <p>Github: ${github}</p>
    <p>Twitter: ${twitter}</p>
  </body>
</html>`;
};

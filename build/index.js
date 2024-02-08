import { ethers } from 'ethers';

 const main = async (id = "ozwaldorf.eth") => {
  const provider = new ethers.JsonRpcProvider('https://cloudflare-eth.com/');
  const resolver = await provider.getResolver(id);

  const address = await resolver.getAddress();
  const avatar = await resolver.getAvatar();
  const email = await resolver.getText("email");
  const url = await resolver.getText("url");
  const twitter = await resolver.getText("com.twitter");

  return `
<html>
  <body>
    <h1>${id} - ${address}</h1>
    <image src="${avatar.url}" />
    <p>Email: ${email}</p>
    <p><a href="${url}">Homepage</a></p>
    <p><a href="${twitter}">Twitter</a></p>
  </body>
</html>
`;
};

export { main };


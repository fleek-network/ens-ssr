import { Web3 } from "web3";
import { Web3Eth } from "web3-eth";
import { ENS } from "web3-eth-ens";
import { fromWei } from "web3-utils";
import { namehash } from "./utils.js";

const eth = new Web3Eth("https://cloudflare-eth.com");
const ens = new ENS(undefined, eth.provider);

export const main = async (name = "ens.eth") => {

  // const name = location.pathname.substring(1).split("/")[0] || "ens.eth";

  // Get the resolver contract for the name
  const resolver = await ens.getResolver(name);
  // const resolver = await web3.eth.ens.getResolver(name);

  const hash = namehash(name);
  const [[eth_address, eth_balance], github, twitter, avatar, desc] = await Promise.all([
    resolver.methods.addr(hash, 60).call().then(async(address)=>{
        const balance = fromWei(await eth.getBalance(address), "ether");
        return[address, balance]
    }), 
    resolver.methods.text(hash, "com.github").call(),
    resolver.methods.text(hash, "com.twitter").call(),
    resolver.methods.text(hash, "avatar").call(),
    resolver.methods.text(hash, "description").call()
  ])

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    id: 67,
    jsonrpc: "2.0",
    method: "qn_fetchNFTs",
    params: [
      {
        wallet: `${eth_address}`,
        omitFields: ["traits"],
        page: 1,
        perPage: 10,
        contracts: [],
      },
    ],
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  var raw0 = JSON.stringify({
    id: 67,
    jsonrpc: "2.0",
    method: "qn_getWalletTokenBalance",
    params: [
      {
        wallet: `${eth_address}`,
      },
    ],
  });

  var requestOptions0 = {
    method: "POST",
    headers: myHeaders,
    body: raw0,
    redirect: "follow",
  };
// TODO: Batch these contract calls

  // TODO: Batch these contract calls
  // const github = await resolver.methods.text(hash, "com.github").call();
  // const twitter = await resolver.methods.text(hash, "com.twitter").call();
  // const desc = await resolver.methods.text(hash, "description").call();
  // const avatar = await resolver.methods.text(hash, "avatar").call();

  // const eth_balance = await web3.eth.getBalance(eth_address);
  // eth_balance = eth_balance/10**18

  //   return `<html>
  //   <body>
  //     <h1>${name}</h1>
  //     <p>Address: ${eth_address}</p>
  //     <p>Balance: ${eth_balance} Wei</p>
  //     <p>Github: @${github}</p>
  //     <p>Twitter: @${twitter}</p>
  //   </body>
  // </html>`;

  var finalans = "";
  var options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "X-API-Key":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjQwNTAzOWJlLTMwNjMtNDliYS04ZmY3LTgwZDYxYjk4NmIyMCIsIm9yZ0lkIjoiMzc2MjcyIiwidXNlcklkIjoiMzg2NjcxIiwidHlwZUlkIjoiNjRlNjhiYmEtYWEzNi00OGRlLWExOWUtZTRmYWFhOWI3NGE5IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDczNDMzNTQsImV4cCI6NDg2MzEwMzM1NH0.ypax-k1mesHIu1j_lJ2TcvAcSmLTX1UvwhlrCa0WsN4",
    },
  };

  var walletadd = await fetch(
    `https://deep-index.moralis.io/api/v2.2/resolve/ens/${name}`,
    options
  );
  var ans = await walletadd.json();
  console.log(ans.address);
  finalans = finalans + " " + ans.address;
  const useableAddress =
    eth_address.slice(0, 5) + "..." + eth_address.slice(eth_address.length - 4);

  var newwalletbal = await fetch(
    `https://deep-index.moralis.io/api/v2.2/${ans.address}/balance?chain=eth`,
    options
  );
  var newans = await newwalletbal.json();
  console.log(newans.balance);
  finalans = finalans + " " + newans.balance;
  const useableBalance = newans.balance.slice(0, 6);

  
  // var newtokensans = await newtokens.json();
  // var newnftans = await newnfts.json();
  var newnftans;
  var newtokensans;
  const [newtokens, newnfts] = await Promise.all([
    fetch(
      "https://docs-demo.quiknode.pro/",
      requestOptions0
    ).then(async(res)=>{newtokensans = await res.json();}),
    fetch("https://docs-demo.quiknode.pro/", requestOptions).then(async(res)=>{newnftans = await res.json();})
  ])
  // var newtokens = await fetch(
  //   "https://docs-demo.quiknode.pro/",
  //   requestOptions0
  // );
  console.log(newtokensans);
  finalans = finalans + " " + JSON.stringify(newtokensans);

  // var newnfts = await fetch("https://docs-demo.quiknode.pro/", requestOptions);
  console.log(newnftans.result);

  var baseUrl =
    "http://fleek-test.network/services/1/blake3/" + window.location.hostname;

  var TokenString = "";
  var NFTString = "";

  function makeTokenList(tokens) {
    tokens.result.result.map(
      (item) =>
        (TokenString += `
      <div class="border border-[#5C5C5C] px-2.5 py-4 mt-3 hover:scale-105 duration-300 ease-in-out ">
                            <a href="https://etherscan.io/address/${item.address}" target="_blank">
                                <div class="flex gap-3 items-center justify-between">
                                    <div class="flex gap-3">

                                        
                                        
                                        <div class="gap-1 flex flex-col">
                                            <div class="text-white mt-5"> ${fromWei(item.totalBalance, "ether")}</div>                
                                            <div class=" text-sm text-[#B6B6B6]"> ${item.name}</div>                
                                        </div>
                                    </div>
                                    <div>
                                        <img class="mr-5 w-6 h-6 invert" src="	https://cdn-icons-png.flaticon.com/512/2901/2901214.png
                                        " alt="" srcset="">
                                    </div>
                                </div>
                        </a>
                        </div>
      `)
    );
  }
  // function makeTokenList(tokens){
  //   tokens.map((item)=>(
  //       TokenString+=(`<div class='border border-[#5C5C5C] px-2.5 py-4 mt-3 hover:scale-105 duration-300 ease-in-out'> <a href='https://etherscan.io/address/${item.token_address}' target='_blank'>
  //       <div class='font-semi-bold text-xl'><p> ${item.balance/10**18}</p></div>
  //       <div class='font-semi-bold text-xl text-[#B6B6B6]'> ${item.name}</div>
  //       </a></div>
  //       `
  //           )
  //       ))
  // }

  function makeNFTList(NFTs) {
    NFTs.result.assets.map(
      (item) =>
        (NFTString += `
    <div class="border border-[#5C5C5C] px-2.5 py-4 mt-3 hover:scale-105 duration-300 ease-in-out ">
                            <a href="https://etherscan.io/address/${item.collectionAddress}" target="_blank">
                                <div class="flex gap-3 items-center justify-between">
                                    <div class="flex gap-3">

                                        
                                        <div><img class="w-20 h-20" src="${item.imageUrl}" alt=""></div>
                                        <div class="gap-1 flex flex-col">
                                            <div class="text-white mt-5"> ${item.name}</div>                
                                            <div class=" text-sm text-[#B6B6B6]"> ${item.collectionName}</div>                
                                        </div>
                                    </div>
                                    <div>
                                        <img class="mr-5 w-6 h-6 invert" src="	https://cdn-icons-png.flaticon.com/512/2901/2901214.png
                                        " alt="" srcset="">
                                    </div>
                                </div>
                        </a>
                        </div>`)
    );
  }

  makeTokenList(newtokensans);
  makeNFTList(newnftans);

  return `

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Profiles with Fleek Network</title>
    <meta name="description" content="ENS profiles Built on Fleek Network" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="" />
    <script src="https://cdn.tailwindcss.com"></script>   
    <script>    
     function goToNewPage(){
            var inputvalue = document.getElementById('search').value
            
            let params = encodeURI('"'+inputvalue+'"');
            var url = "${baseUrl}" + '?param=' + params;

            window.location.replace(url);
        }
            // Attach the event listener to the button
            document.addEventListener('DOMContentLoaded', function () {
            // Wait for the DOM to be fully loaded before trying to attach the event listener
            var button = document.getElementById('go');
        button.addEventListener('click', goToNewPage);
        });
            document.addEventListener('DOMContentLoaded', function () {
            // Wait for the DOM to be fully loaded before trying to attach the event listener
            var button = document.getElementById('share');
        button.addEventListener('click', () => navigator.clipboard.writeText(window.location.href);
        );
        });

        function copyAdd(){
        navigator.clipboard.writeText(${ans.address});

        }
</script>
    <style>
        .myBtn {    
            animation: button-pop var(--animation-btn, 0.25s) ease-out;
            &:active:hover,
            &:active:focus {
                animation: button-pop 0s ease-out;
                transform: scale(var(--btn-focus-scale, 0.97));
            }
        }

        @keyframes button-pop {
            0% {
                transform: scale(var(--btn-focus-scale, 0.98));
            }
            40% {
                transform: scale(1.02);
            }
            100% {
                transform: scale(1);
            }
        }

    </style>
  </head>
  <body class="bg-black text-white ">
    <div class="flex justify-between  py-3 border-b border-[#5C5C5C] gap-5">
        <div class="basis-1/3 flex items-center pl-8 w-fit">
            <img class="max-w-[5vw] min-w-[15vw] " src="https://raw.githubusercontent.com/fleek-network/brand-kit/0de961a8af7b9ccee12e5c8af50f623977f7c863/Logo/Full%20Logo/SVG/fleek-network-full-on-dark.svg" alt="Fleek Network" srcset="">
        </div>
        <div class="flex basis-1/3">
            <input
            class="bg-black border-[#5C5C5C] border px-2 py-2.5 w-full h-full"
            placeholder="Enter ENS Address"    
            id="search"                    
          />
          <button class='font-secondaryMedium text-black bg-white border-[#5C5C5C] border  tracking-widest px-3 h-full text-base myBtn' id="go">                          
               Go!
          </button>
        </div>
        <div class="flex basis-1/3 gap-5 text-base justify-end items-center  pr-8">
            <a href="https://docs.fleek.network/docs/" target="_blank" class="tracking-wider py-2 tracking-widest  text-sm text-[#f1f1f1] hover:text-white focus:text-white myBtn">
                // Docs
            </a>
            <a href="https://blog.fleek.network/" target="_blank" class="tracking-wider py-2 tracking-widest  text-sm text-[#f1f1f1] hover:text-white focus:text-white myBtn">
                // Blog
            </a>
            <a href="https://discord.gg/fleek" target="_blank" class="tracking-wider py-2 tracking-widest  text-sm text-[#f1f1f1] hover:text-white focus:text-white myBtn">
                // Discord
            </a>
            <a href="https://twitter.com/fleek_net" target="_blank" class="tracking-wider py-2 tracking-widest  text-sm text-[#f1f1f1] hover:text-white focus:text-white myBtn">
                // Twitter
            </a>
            
        </div>
    </div>
    <div class="flex justify-center ">

        <div class=" py-16 min-w-[40rem] 2xl:min-w-[60rem]">
            <div class="border-b border-[#5C5C5C] flex justify-between">
                <div class="text-center flex flex-col gap-4 ">
                    <div class="flex ">
                        <img class="w-36 border border-yellow-300 h-36 " src="${avatar ? avatar : "https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?s=612x612&w=0&k=20&c=P1DebpeMIAtXj_ZbVsKVvg-duuL0v9DlrOZUvPG6UJk="}" alt="Fleek Network" srcset="">
                    </div>
                    <div class="flex flex-col text-start gap-1.5">
                        <h1 class="font-semibold text-2xl">${name}</h1>
                        <div class="flex text-lg  gap-3 ">
                            <button class=" tracking-wider py-1 text-[#B6B6B6] myBtn">
                                ${useableAddress}
                            </button>
                            
                        </div>
                        <h6 class="pb-5 text-start" id="balance"><span class="text-base mr-1">${eth_balance}</span>Eth</h6>                                
                    </div>                
                </div>
                <div class=" w-full basis-1/4">
                    <button id="share" class="text-2xl text-black bg-white tracking-widest  w-full px-5 py-3 myBtn">SHARE</button>
                </div>
            </div>
            
            <div class=" pt-5">
                <div>
                    <h2 class="font-semibold text-2xl">Info</h2>    
                    ${desc ? `
                    <div id="test1" class="border border-[#5C5C5C] px-2.5 py-4 mt-3">
                        <h3 class="text-[#B6B6B6] text-sm">Bio</h3>
                        <h2 class="text-lg">${desc}</h2>
                    </div>                    
                    ` : ""}    
                    
                    ${twitter ? `
                    <div id="test1" class="border border-[#5C5C5C] px-2.5 py-4 mt-3">
                        <h3 class="text-[#B6B6B6] text-sm">Twitter</h3>
                        <h2 class="text-lg">@${twitter}</h2>
                    </div>                    
                    `: ""}
                    ${github ? `
                    <div id="test1" class="border border-[#5C5C5C] px-2.5 py-4 mt-3">
                        <h3 class="text-[#B6B6B6] text-sm">Github</h3>
                        <h2 class="text-lg">@${github}</h2>
                    </div>                    
                    ` : ""}
                    
                    
                </div>
                
            </div>
            <div class=" pt-5">
                <div>
                    <h2 class="font-semibold text-2xl">NFTs</h2>
                    <div id="test1" class="">
                        ${NFTString}
                    </div>
                    
                    <h2 class="font-semibold text-2xl mt-5">Tokens</h2>
                    <div id="test2" class="">
                        ${TokenString}
                        
                    </div>
                </div>
                
            </div>
            
        </div>
    </div>
        
        <script>
    console.log(1)
        function onClickHandler(e){
            e.preventDefault();
            var inputvalue = document.getElementById('search').value
            var url = ${baseUrl} + '?param=' + inputvalue;
            console.log(url)
            window.location.replace(url);
        }
    console.log(2)
    </script>
  </body>
</html>

`;
};

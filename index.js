import { ethers } from "./ethers.min.js";

import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
connectButton.onclick = connect;
fundButton.onclick = fund;

console.log(ethers);

async function connect() {
  if (window.ethereum !== "undefined") {
    console.log("Metamask is detected in your chrome");
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      connectButton.innerHTML = "Connected!";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log(accounts);
    } catch (error) {
      console.log("Not Able to Connect to Metamask");
      connectButton.innerHTML = "Please install MetaMask extension to continue";
    }
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please install MetaMask extension to continue";
  }
}

// fund function
async function fund() {
  const ethAmount = "0.02";
  console.log(`Funding with ${ethAmount}.....`);
  // always check if the connection to the wallet is always there
  if (typeof window.ethereum !== "undefined") {
    // provider - to connect to the blockchain

    const provider = new ethers.BrowserProvider(window.ethereum);
    // const provider = new ethers.provider.Web3Provider(window.ethereum);

    // signer - wallet
    const signer = await provider.getSigner();

    // for the contract - abi, address
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      });
      await listenToEvents(transactionResponse, provider);
      console.log(`Done mining the transaction`);
    } catch (error) {
      console.log(error);
    }
  }
}

// we need a function to listen to the mining hash for the transaction and the receipt
function listenToEvents(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash} .......`);

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} no of confirmations `
      );
      resolve();
    });
  });
}

// withdraw function

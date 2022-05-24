import "./App.css";

import axios from "axios";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

import { nftContractAddress } from "./config";
import NFT from "./utils/NFT.json";

const mumbaiChainId = "0x13881";
const devChainId = 1337;
const localhostChainId = `0x${Number(devChainId).toString(16)}`;

export default function App() {
  const [mintedNFT, setMintedNFT] = useState([]);
  const [status, setStatus] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  // Checks if wallet is connected
  async function checkIfWalletConnected() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length !== 0) {
        console.log("found authorized account: ", accounts[0]);
        setCurrentAccount(accounts[0]);
      } else {
        console.log("no authorized account found");
      }
    } else {
      console.log("Metamask not detected");
    }
  }

  // Checks if wallet is connected to the correct network
  async function checkCorrectNetwork() {
    let chainId = await window.ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain:" + chainId);

    if (chainId !== mumbaiChainId && chainId !== localhostChainId) {
      setCorrectNetwork(false);
    } else {
      setCorrectNetwork(true);
    }
  }

  // Triggered by button to connect to wallet
  async function connectWallet() {
    try {
      if (!window.ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);

      if (chainId !== mumbaiChainId && chainId !== localhostChainId) {
        alert("You are not connected to the Mumbai Testnet!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Found account", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  }

  // Check if connected on load
  useEffect(() => {
    checkIfWalletConnected();
    checkCorrectNetwork();
  }, []);

  async function mintNFT() {
    try {
      const randomInt = Math.floor(Math.random() * 4) + 1;
      const url = `https://gateway.pinata.cloud/ipfs/QmZTJ9wDPaBP8aFMNKQubuuTaAnqA747QxoktqPaxBTfMA/${randomInt}.json`;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(
        nftContractAddress,
        NFT.abi,
        signer
      );

      let nftTx = await nftContract.createToken(url);
      console.log("Mining...", nftTx.hash);

      await nftTx.wait();

      console.log(
        `Mined! See transaction here: https://mumbai.polygonscan.com/tx/${nftTx.hash}`
      );

      loadMintedNFTs();
    } catch (error) {
      console.log("Error minting NFT", error);
    }
  }

  async function loadMintedNFTs() {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          nftContractAddress,
          NFT.abi,
          signer
        );

        let tokenIdsString = await nftContract.tokensOfOwner(currentAccount);
        let tokenIds = [];
        tokenIdsString.forEach((str) => {
          tokenIds.push(Number(str));
        });
        console.log(tokenIds);
        let minted = [];

        for (let i = 0; i < tokenIds.length; i++) {
          let tokenURI = await nftContract.tokenURI(tokenIds[i]);
          let data = await axios.get(tokenURI);
          // console.log(data);
          minted.push(data.data.name);
        }

        setMintedNFT(minted);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWallet}>
        {currentAccount !== "" && correctNetwork ? (
          "Connected: " +
          String(currentAccount).substring(0, 6) +
          "..." +
          String(currentAccount).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      {currentAccount !== "" && correctNetwork ? (
        <button onClick={mintNFT}>Mint</button>
      ) : (
        <div>Please connect to Mumbai Testnet</div>
      )}

      <div>{mintedNFT !== undefined && mintedNFT}</div>
    </div>
  );
}

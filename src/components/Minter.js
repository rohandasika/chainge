import axios from "axios";
import { ethers } from "ethers";

import { nftContractAddress } from "../config.js";
import NFT from "../NFT.json";

export default function Minter(props) {
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

        let tokenIdsString = await nftContract.tokensOfOwner(props.addr);
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

        props.updateNFTs(minted);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {props.addr !== "" && props.corrNet ? (
        <button onClick={mintNFT}>Mint</button>
      ) : (
        <div>Please connect to Mumbai Testnet</div>
      )}
    </div>
  );
}

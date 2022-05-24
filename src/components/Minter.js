import axios from "axios";
import { ethers } from "ethers";

import { nftContractAddress } from "../config.js";
import NFT from "../NFT.json";

const NFT_COUNT = 5;
const PINATA_URL =
  "https://gateway.pinata.cloud/ipfs/QmZTJ9wDPaBP8aFMNKQubuuTaAnqA747QxoktqPaxBTfMA/";
const MUMBAI_URL = "https://mumbai.polygonscan.com/tx/";

export default function Minter(props) {
  function getContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(
      nftContractAddress,
      NFT.abi,
      signer
    );

    return nftContract;
  }

  async function mintNFT() {
    try {
      const nftContract = getContract();

      const randomInt = Math.floor(Math.random() * NFT_COUNT) + 1;
      const url = PINATA_URL + `${randomInt}.json`;

      let nftTx = await nftContract.createToken(url);
      console.log("Mining...", nftTx.hash);

      await nftTx.wait();

      console.log(
        "Mined! See transaction here: " + MUMBAI_URL + `${nftTx.hash}`
      );

      loadMintedNFTs();
    } catch (error) {
      console.log("Error minting NFT", error);
    }
  }

  async function loadMintedNFTs() {
    try {
      const nftContract = getContract();

      let tokenIdsString = await nftContract.tokensOfOwner(props.addr);
      let tokenIds = [];
      tokenIdsString.forEach((str) => {
        tokenIds.push(Number(str));
      });

      let minted = [];
      for (let i = 0; i < tokenIds.length; i++) {
        let tokenURI = await nftContract.tokenURI(tokenIds[i]);
        let data = await axios.get(tokenURI);
        // console.log(data);
        minted.push(data.data.name);
      }

      props.updateNFTs(minted);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {props.connected ? <button onClick={mintNFT}>Mint</button> : <div></div>}
    </div>
  );
}

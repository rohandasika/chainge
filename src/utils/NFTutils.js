import axios from "axios";
import { ethers } from "ethers";

import { nftContractAddress } from "./constants";
import NFT from "./NFT.json";

export async function getNftContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(nftContractAddress, NFT.abi, signer);
}

export async function getAllNFTs(addr, updateNFTs) {
  try {
    const nftContract = await getNftContract();

    let tokenIdsString = await nftContract.tokensOfOwner(addr);
    let tokenIds = [];
    tokenIdsString.forEach((str) => {
      tokenIds.push(Number(str));
    });

    let minted = [];
    for (let i = 0; i < tokenIds.length; i++) {
      let tokenURI = await nftContract.tokenURI(tokenIds[i]);
      let data = await axios.get(tokenURI);

      // console.log(data.data);

      minted.push([
        data.data.token_id,
        data.data.name,
        data.data.attributes[0].value, // Action
        data.data.attributes[1].value, // Times Done
      ]);
    }

    updateNFTs(minted);
    // console.log(minted);
  } catch (error) {
    console.log(error);
  }
}

export function isNftVerified(token_id, verifiedNFTs) {
  for (let i = 0; i < verifiedNFTs.length; i++)
    if (token_id === parseInt(verifiedNFTs[i].nftID)) return true;

  return false;
}

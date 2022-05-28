import { ethers } from "ethers";

import { TileDocument } from "@ceramicnetwork/stream-tile";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { StreamID } from "@ceramicnetwork/streamid";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays";

import NFT from "./NFT.json";
import { nftContractAddress, NFT_COUNT, aliases } from "./constants";
import { good_deeds } from "./good_deeds.js";

// Utility function to get the NFT contract
export async function getNftContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(nftContractAddress, NFT.abi, signer);
}

async function instantiateCeramic() {
  // The key must be provided as an environment variable
  const key = fromString(
    "026e1b87ec8ea5d7436b7d28bde7d26255012c346d705255df829523e605b658",
    "base16"
  );

  // Create and authenticate the project's DID
  const did = new DID({
    provider: new Ed25519Provider(key),
    resolver: getResolver(),
  });
  await did.authenticate();

  // Create the Ceramic obj and model manager
  const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
  ceramic.did = did;
  const model = new DataModel({ ceramic, aliases });
  const dataStore = new DIDDataStore({ ceramic, model });

  return [ceramic, model, dataStore];
}

export async function updateTokenMapping(token_id, streamID) {
  const [ceramic, model, dataStore] = await instantiateCeramic();

  let tokenMap = await dataStore.get("tokenMapping");
  // await dataStore.set("tokenMapping", {});

  // we have to create if it doesn't exist yet
  if (Object.keys(tokenMap).length === 0) {
    const map = { tokens: [{ token_id: token_id, streamID: streamID }] };
    await dataStore.set("tokenMapping", map);
  } else {
    const new_entry = { token_id: token_id, streamID: streamID };
    tokenMap.tokens.push(new_entry);
    await dataStore.set("tokenMapping", tokenMap);
  }
}

export async function createNFT() {
  const [ceramic, model, dataStore] = await instantiateCeramic();

  const action = good_deeds[0];
  const actionCount = good_deeds.length; // nbr of remaining actions
  if (actionCount === 0) {
    console.log("No more actions to create");
    return;
  }
  const idx = NFT_COUNT - actionCount + 1; // get the index of the action (total - remaining + 1)
  const metadata = {
    token_id: idx,
    name: action,
    image:
      "https://gateway.pinata.cloud/ipfs/QmYCrmBY6Wk2mn1Yq868QDzuVL2LSG9NvC7SykqyBSTTgh",
    traits: [
      {
        trait_type: "times_done",
        value: 0,
      },
    ],
  };

  console.log("Creating NFT with metadata: ", metadata);

  const newNFT = await model.createTile("nftMetadata", metadata);

  // delete first element of good_deeds
  good_deeds.shift();

  return [metadata.token_id, newNFT];
}

// Utility function to get all NFTs that have been minted
export async function getAllNFTs(addr, updateNFTs) {
  try {
    const nftContract = await getNftContract();
    const [ceramic, model, dataStore] = await instantiateCeramic();

    let tokenIdsString = await nftContract.tokensOfOwner(addr);
    let tokenIds = [];
    tokenIdsString.forEach((str) => {
      tokenIds.push(Number(str));
    });

    let minted = [];
    let tokenMap = await dataStore.get("tokenMapping");
    for (let i = 0; i < tokenIds.length; i++) {
      console.log(tokenMap[tokenIds[i]]);

      // const streamID = StreamID.fromString(tokenURI.substring(10));
      // const tile = await TileDocument.load(ceramic, streamID);
      // const data = tile.content;

      // minted.push([
      //   data.token_id,
      //   data.name,
      //   data.traits[0].value, // Times Done
      // ]);
    }

    updateNFTs(minted);
  } catch (error) {
    console.log(error);
  }
}

// Check token_id against verified list to see if NFT has been verified
export function isNftVerified(token_id, verifiedNFTs) {
  for (let i = 0; i < verifiedNFTs.length; i++)
    if (token_id === parseInt(verifiedNFTs[i].nftID)) return true;

  return false;
}

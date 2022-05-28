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
import { nftContractAddress, IMAGE_URL, aliases } from "./constants";
import { good_deeds } from "./good_deeds.js";

// Utility function to get the NFT contract
export async function getNftContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(nftContractAddress, NFT.abi, signer);
}

// Utility function to create a Ceramic object
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

// Returns all the tokenIds owned by this address
async function getAllTokensOfOwner(addr) {
  const nftContract = await getNftContract();
  let tokenIdsString = await nftContract.tokensOfOwner(addr);
  let userTokens = [];

  for (let i = 0; i < tokenIdsString.length; i++) {
    let tokenId = Number(tokenIdsString[i]);
    let tokenURI = await nftContract.tokenURI(tokenId);
    userTokens.push({ tokenId, tokenURI });
  }

  return userTokens;
}

export async function updateTokenMapping(addr, streamID) {
  const [ceramic, model, dataStore] = await instantiateCeramic();

  const tokenIds = getAllTokensOfOwner(addr);

  let existingMap = await dataStore.get("tokenMapping");
  // await dataStore.set("tokenMapping", {});
  let tokenMap = {
    tokens: [],
  };

  // we have to create if it doesn't exist yet
  if (Object.keys(existingMap).length === 0) {
    const map = { tokens: [{ token_id: tokenIds[0], streamID: streamID }] };
    tokenMap = map;
  } else {
    // loop over all tokenIds and recreate the mapping
    for (let i = 0; i < tokenIds.length; i++) {
      for (let j = 0; j < existingMap.tokens.length; j++) {
        // if a match exists in the current map, then just load that again
        if (existingMap.tokens[j].token_id === tokenIds[i]) {
          tokenMap.tokens.push({
            token_id: tokenIds[i],
            stream_id: existingMap.tokens[j].stream_id,
          });
        }
        // if match not found in current map, then create a new entry with new streamID
        else {
          tokenMap.tokens.push({
            token_id: tokenIds[i],
            stream_id: streamID,
          });
        }
      }
    }
  }

  console.log(tokenMap);

  await dataStore.set("tokenMapping", tokenMap);

  // we have to create if it doesn't exist yet
  // if (Object.keys(tokenMap).length === 0) {
  //   const map = { tokens: [{ token_id: token_id, streamID: streamID }] };
  //   await dataStore.set("tokenMapping", map);
  // } else {
  //   const new_entry = { token_id: token_id, streamID: streamID };
  //   tokenMap.tokens.push(new_entry);
  //   await dataStore.set("tokenMapping", tokenMap);
  // }
}

export async function createNftMetadata() {
  const [ceramic, model, dataStore] = await instantiateCeramic();

  // Get a random action from good_deeds
  const action = good_deeds[Math.floor(Math.random() * good_deeds.length)];

  const metadata = {
    name: action,
    image: IMAGE_URL,
    traits: [
      {
        trait_type: "times_done",
        value: 0,
      },
    ],
  };

  console.log("Creating NFT with metadata: ", metadata);

  const newNFT = await model.createTile("nftMetadata", metadata);

  return newNFT;
}

// Utility function to get all NFTs that have been minted for this user
export async function getAllNFTs(addr, updateNFTs) {
  try {
    const [ceramic, model, dataStore] = await instantiateCeramic();

    let minted = [];
    let tokenIds = await getAllTokensOfOwner(addr);
    for (let i = 0; i < tokenIds.length; i++) {
      const URI = tokenIds[i].tokenURI;
      const streamID = URI.substring(URI.indexOf("k"), URI.indexOf("/content"));
      const stream = StreamID.fromString(streamID);
      const tile = await TileDocument.load(ceramic, stream);
      const data = tile.content;

      minted.push([
        tokenIds[i].tokenId,
        data.name,
        data.traits[0].value, // Times Done
      ]);
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

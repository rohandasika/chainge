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

import {
  nftContractAddress,
  IMAGE_URL,
  aliases,
  good_deeds,
} from "./constants";
import NFT from "../contracts/NFT.json";

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

// Given a token URI,will find the streamID and return the Stream object
function getStreamFromTokenURI(URI) {
  const streamID = URI.substring(URI.indexOf("k"), URI.indexOf("/content"));
  return StreamID.fromString(streamID);
}

// Given a token ID, will return the stream Obj of the token
async function getStreamFromTokenID(addr, tokenId) {
  let tokenIds = await getAllTokensOfOwner(addr);

  for (let i = 0; i < tokenIds.length; i++) {
    let token = tokenIds[i];
    if (token.tokenId === tokenId) {
      return getStreamFromTokenURI(token.tokenURI);
    }
  }
}

// Given a token ID, will return the data stored on the tile
export async function getTileDataFromTokenID(addr, tokenId) {
  const [ceramic, model, dataStore] = await instantiateCeramic();

  const stream = await getStreamFromTokenID(addr, tokenId);
  const tile = await TileDocument.load(ceramic, stream);
  return tile.content;
}

// On minting, generate NFT metadata and stores in a Ceramic tile doc
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

// Gets all NFTs that have been minted for this user
export async function getAllNFTs(addr, updateNFTs) {
  try {
    const [ceramic, model, dataStore] = await instantiateCeramic();

    let minted = [];
    let tokenIds = await getAllTokensOfOwner(addr);

    for (let i = 0; i < tokenIds.length; i++) {
      const URI = tokenIds[i].tokenURI;
      const stream = getStreamFromTokenURI(URI);
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

// Updates the number of times an action has been done when verified
export async function updateTimesDone(addr, token_id) {
  try {
    const [ceramic, model, dataStore] = await instantiateCeramic();

    const stream = await getStreamFromTokenID(addr, token_id);
    console.log("updated NFT stream: " + stream.toString());
    const tile = await TileDocument.load(ceramic, stream);
    const data = tile.content;

    const newData = {
      name: data.name,
      image: data.image,
      traits: [
        {
          trait_type: "times_done",
          value: data.traits[0].value + 1,
        },
      ],
    };

    tile.update(newData);
  } catch (error) {
    console.log(error);
  }
}
// Check token_id against verified list to see if NFT has been verified
export function isNftVerified(token_id, verifiedNFTs) {
  for (let i = 0; i < verifiedNFTs.length; i++)
    if (token_id === parseInt(verifiedNFTs[i].token_id)) return true;

  return false;
}

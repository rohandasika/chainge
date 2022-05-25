import { useViewerRecord, useViewerConnection } from "@self.id/framework";

import { getNftContract } from "./NFTutils";

export async function verify(inputs) {
  const { nftId, date } = inputs;

  const nftContract = await getNftContract();
}

//fetch all NFTs from Ceramic Stream
//get action from smart contract
//create new ceramic entry & update stream
//update verified NFTs

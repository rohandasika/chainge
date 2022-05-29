import Button from "@mui/material/Button";

import {
  getNftContract,
  createNftMetadata,
  getAllNFTs,
} from "../utils/NFTutils";
import { MUMBAI_URL, CERAMIC_ENDPOINT } from "../utils/constants";

export default function Minter(props) {
  async function mintNFT() {
    try {
      // get the contract and create the NFT metadata
      const nftContract = await getNftContract();
      const NftStream = await createNftMetadata();

      // submit token URI to the contract
      const url = CERAMIC_ENDPOINT + NftStream.id + "/content";
      let nftTx = await nftContract.createToken(url);
      console.log("Mining...", nftTx.hash);

      await nftTx.wait();

      console.log(
        "Mined! See transaction here: " + MUMBAI_URL + `${nftTx.hash}`
      );

      // Update list of all minted NFTs for display
      getAllNFTs(props.addr, props.updateNFTs);
    } catch (error) {
      console.log("Error minting NFT", error);
    }
  }

  return (
    <Button variant="contained" onClick={mintNFT}>
      Mint
    </Button>
  );
}

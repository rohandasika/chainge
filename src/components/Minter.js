import Button from "@mui/material/Button";

import { getNftContract, getAllNFTs } from "../utils/NFTutils";
import { NFT_COUNT, MUMBAI_URL, PINATA_URL } from "../utils/constants";

export default function Minter(props) {
  async function mintNFT() {
    try {
      const nftContract = await getNftContract();

      const randomInt = Math.floor(Math.random() * NFT_COUNT) + 1;
      const url = PINATA_URL + `${randomInt}.json`;

      let nftTx = await nftContract.createToken(url);
      console.log("Mining...", nftTx.hash);

      await nftTx.wait();

      console.log(
        "Mined! See transaction here: " + MUMBAI_URL + `${nftTx.hash}`
      );
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

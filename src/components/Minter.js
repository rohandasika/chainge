import Button from "@mui/material/Button";

import {
  getNftContract,
  getAllNFTs,
  createNFT,
  updateTokenMapping,
} from "../utils/NFTutils";
import { MUMBAI_URL } from "../utils/constants";

export default function Minter(props) {
  async function mintNFT() {
    try {
      const nftContract = await getNftContract();
      const [tokenId, NFT] = await createNFT();

      // const url = NFT.id.toUrl() + "/content";
      const url = `https://ceramic-private-clay.3boxlabs.com/api/v0/streams/${NFT.id}/content`;

      await updateTokenMapping(tokenId, NFT.id.toString());

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

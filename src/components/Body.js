import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Minter from "./Minter";
import MintedNFTs from "./MintedNFTs";
import Verifier from "./Verifier";
import VerifiedNFTs from "./VerifiedNFTs";

export default function Body(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
      >
        <Grid item>
          <Grid container direction="column">
            <Minter addr={props.addr} updateNFTs={props.updateNFTs}></Minter>
            <MintedNFTs
              addr={props.addr}
              nfts={props.mintedNFTs}
              updateNFTs={props.updateNFTs}
            ></MintedNFTs>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container direction="column">
            <Verifier
              mintedNFTs={props.mintedNFTs}
              verifiedNFTs={props.verifiedNFTs}
              updateVerifiedNFTs={props.updateVerifiedNFTs}
            ></Verifier>
            <VerifiedNFTs
              verifiedNFTs={props.verifiedNFTs}
              updateVerifiedNFTs={props.updateVerifiedNFTs}
            ></VerifiedNFTs>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

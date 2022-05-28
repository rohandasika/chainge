import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import Minter from "./Minter";
import MintedNFTs from "./MintedNFTs";
import Verifier from "./Verifier";
import VerifiedNFTs from "./VerifiedNFTs";

export default function Home(props) {
  return (
    <Container maxWidth="100%">
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={12}
      >
        <Grid item xs>
          <h1>Mint new action</h1>
          <Minter addr={props.addr} updateNFTs={props.updateNFTs}></Minter>

          <MintedNFTs
            addr={props.addr}
            nfts={props.mintedNFTs}
            updateNFTs={props.updateNFTs}
            verifiedNFTs={props.verifiedNFTs}
          ></MintedNFTs>
        </Grid>

        <Grid item xs>
          <h1>Verify completed actions</h1>
          <Verifier
            addr={props.addr}
            mintedNFTs={props.mintedNFTs}
            verifiedNFTs={props.verifiedNFTs}
            updateVerifiedNFTs={props.updateVerifiedNFTs}
          ></Verifier>

          <VerifiedNFTs
            addr={props.addr}
            verifiedNFTs={props.verifiedNFTs}
            updateVerifiedNFTs={props.updateVerifiedNFTs}
          ></VerifiedNFTs>
        </Grid>
      </Grid>
    </Container>
  );
}

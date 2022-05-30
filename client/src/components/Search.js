import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useState } from "react";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { Caip10Link } from "@ceramicnetwork/stream-caip10-link";

import MintedNFTs from "./MintedNFTs";
import OthersVerifiedNFTs from "./OthersVerifiedNFTs";

export default function Search() {
  const [inputs, setInputs] = useState({});
  const [status, setStatus] = useState("");
  const [did, setDID] = useState("");
  const [searchMintedNFTs, setSearchMintedNFTs] = useState([]);
  const [searchVerifiedNFTs, setSearchVerifiedNFTs] = useState([]);

  const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  function updateSearchVerifiedNFTs(nfts) {
    setSearchVerifiedNFTs(nfts);
  }

  async function getCaip10Link() {
    const accountID = inputs.toAddr + "@eip155:80001";
    const link = await Caip10Link.fromAccount(ceramic, accountID);
    setDID(link.did);
  }

  // get all NFTs that have been minted by the person you're searching for
  // and the ones that have been verified by the person you're searching for
  // once the CAIP10 link is established, the model will be refreshed by itself
  async function getAllNFTs(event) {
    event.preventDefault();
    setSearchVerifiedNFTs([]);

    await getCaip10Link();
  }

  return (
    <Container>
      <Container align="center">
        <form onSubmit={getAllNFTs}>
          <TextField
            variant="outlined"
            label="address"
            type="string"
            name="toAddr"
            value={inputs.toAddr || ""}
            onChange={handleChange}
          />

          <Button variant="contained" type="submit">
            Search Chaingemakers
          </Button>
        </form>
        {"user's address: " + inputs.toAddr}
        <br></br>
        {"user's DID: " + did}
      </Container>

      <br></br>
      <br></br>

      <Container maxWidth="100%">
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={12}
        >
          <Grid item xs>
            <h1>All actions</h1>
            <MintedNFTs
              addr={inputs.toAddr}
              nfts={searchMintedNFTs}
              updateNFTs={setSearchMintedNFTs}
              verifiedNFTs={searchVerifiedNFTs}
            ></MintedNFTs>
          </Grid>

          <Grid item xs>
            <h1>Completed actions</h1>

            <OthersVerifiedNFTs
              addr={inputs.toAddr}
              searchVerifiedNFTs={searchVerifiedNFTs}
              updateSearchVerifiedNFTs={updateSearchVerifiedNFTs}
              did={did}
            ></OthersVerifiedNFTs>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}

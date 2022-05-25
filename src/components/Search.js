import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";

import { useState } from "react";
import { useViewerRecord } from "@self.id/framework";

export default function Search(props) {
  const [inputs, setInputs] = useState({});

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  // console.log(profile);
  async function findIdentity(event) {
    event.preventDefault();
    try {
    } catch (error) {
      console.log("Error minting NFT", error);
    }
    setInputs({});
  }

  return (
    <Container>
      <form onSubmit={findIdentity}>
        <TextField
          variant="outlined"
          label="address"
          type="string"
          name="address"
          value={inputs.address || ""}
          onChange={handleChange}
        ></TextField>

        <Button variant="contained" type="submit">
          Search for user
        </Button>
      </form>
    </Container>
  );
}

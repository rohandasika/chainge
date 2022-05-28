import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useState } from "react";
import { useViewerRecord } from "@self.id/framework";
import { updateTimesDone, getTileDataFromTokenID } from "../utils/NFTutils";

export default function Verifier(props) {
  const [inputs, setInputs] = useState({});
  const verifiedNFTsCeramic = useViewerRecord("ChaingeVerification");

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  function updateVerifiedNFTs(newAction) {
    let currentlyOnCeramic = verifiedNFTsCeramic.content;
    let verifiedActions;
    console.log(currentlyOnCeramic);

    if (currentlyOnCeramic === null) {
      verifiedActions = [newAction];
    } else {
      verifiedActions = currentlyOnCeramic.verifiedActions;
      verifiedActions.push(newAction);
    }

    props.updateVerifiedNFTs(verifiedActions);
    console.log(verifiedActions);

    return { verifiedActions };
  }

  async function verifyAction(event) {
    event.preventDefault();

    try {
      let token_id = parseInt(inputs.token_id);

      await updateTimesDone(props.addr, token_id);
      const tileData = await getTileDataFromTokenID(props.addr, token_id);

      console.log(tileData);

      const newAction = {
        token_id: token_id,
        action: tileData.name,
        date: inputs.date,
      };

      const nullVerifiedActions = { verifiedActions: [] };

      // Use these when actually writing to Ceramic
      let updatedNFTs = updateVerifiedNFTs(newAction);
      console.log(updatedNFTs);
      await verifiedNFTsCeramic.set(updatedNFTs);

      // Use this when resetting Ceramic
      // await verifiedNFTsCeramic.set(nullVerifiedActions);
    } catch (error) {
      console.log("Error minting NFT", error);
    }

    setInputs({});
  }

  return (
    <div>
      <form onSubmit={verifyAction}>
        <TextField
          variant="outlined"
          label="NFT Token ID"
          type="number"
          name="token_id"
          value={inputs.token_id || ""}
          onChange={handleChange}
        />

        <TextField
          variant="outlined"
          label="Date"
          type="text"
          placeholder="yyyy-mm-dd"
          name="date"
          value={inputs.date || ""}
          onChange={handleChange}
        />

        <Button variant="contained" type="submit">
          Verify Action
        </Button>
      </form>
    </div>
  );
}

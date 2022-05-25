import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useState } from "react";
import { useViewerRecord } from "@self.id/framework";

export default function Verifier(props) {
  const [inputs, setInputs] = useState({});
  const verifiedNFTsCeramic = useViewerRecord("ChaingeVerification");

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  function findAction(token_id) {
    for (let i = 0; i < props.mintedNFTs.length; i++) {
      if (token_id === props.mintedNFTs[i][0]) return props.mintedNFTs[i][1];
    }
  }

  function updateVerifiedNFTs(nftCompleteAction) {
    let nftAction = verifiedNFTsCeramic.content.nftAction;
    nftAction.push(nftCompleteAction);

    props.updateVerifiedNFTs(nftAction);
    return { nftAction };
  }

  // console.log(profile);
  async function verifyAction(event) {
    event.preventDefault();
    try {
      let token_id = parseInt(inputs.nftId);
      let action = findAction(token_id);

      const nftCompleteAction = {
        nftID: inputs.nftId,
        action: action,
        date: inputs.date,
      };
      const nullAction = {
        nftAction: [
          {
            nftID: "0",
            action: "",
            date: "2000-01-01",
          },
        ],
      };
      let updatedNFTs = updateVerifiedNFTs(nftCompleteAction);

      await verifiedNFTsCeramic.set(updatedNFTs);

      // console.log(verifiedNFTsCeramic);
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
          name="nftId"
          value={inputs.nftId || ""}
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

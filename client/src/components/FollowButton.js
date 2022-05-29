import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useState } from "react";
import CyberConnect, { Env, Blockchain } from "@cyberlab/cyberconnect";

const cyberConnect = new CyberConnect({
  namespace: "CyberConnect",
  env: Env.PRODUCTION,
  chain: Blockchain.ETH,
  provider: window.ethereum,
});

export default function FollowButton() {
  const [inputs, setInputs] = useState({});
  const [status, setStatus] = useState("");

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  async function findFriend(event) {
    event.preventDefault();

    try {
      await cyberConnect.connect(inputs.toAddr);
      setStatus(`Success: you're following ${inputs.toAddr}!`);
    } catch (error) {
      console.error(error.message);
      setStatus(error.message);
    }
  }

  return (
    <div>
      <form onSubmit={findFriend}>
        <TextField
          variant="outlined"
          label="address"
          type="string"
          name="toAddr"
          value={inputs.toAddr || ""}
          onChange={handleChange}
        />

        <Button variant="contained" type="submit">
          Find a friend!
        </Button>
      </form>
      {status}
    </div>
  );
}

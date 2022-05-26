import Button from "@mui/material/Button";

import CyberConnect, { Env, Blockchain } from "@cyberlab/cyberconnect";

const cyberConnect = new CyberConnect({
  namespace: "CyberConnect",
  env: Env.PRODUCTION,
  chain: Blockchain.ETH,
  provider: window.ethereum,
});

export default function FollowButton() {
  const handleOnClick = async () => {
    // Prompt to enter the address
    const address = prompt("Enter the ens/address to follow:");

    try {
      await cyberConnect.connect(address);
      alert(`Success: you're following ${address}!`);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Button variant="contained" onClick={handleOnClick}>
      Find a friend!
    </Button>
  );
}

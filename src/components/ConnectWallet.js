import Button from "@mui/material/Button";

import { useState, useEffect } from "react";
import { EthereumAuthProvider, useViewerConnection } from "@self.id/framework";

import { devChainId, mumbaiChainId } from "../utils/constants";

const localhostChainId = `0x${Number(devChainId).toString(16)}`;

export default function ConnectWallet(props) {
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [connection, connect, disconnect] = useViewerConnection();

  // Checks if wallet is connected to the correct network
  async function checkCorrectNetwork() {
    let chainId = await window.ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain:" + chainId);

    if (chainId !== mumbaiChainId && chainId !== localhostChainId) {
      setCorrectNetwork(false);
    } else {
      setCorrectNetwork(true);
    }
  }

  // Check if connected on load
  useEffect(() => {
    checkCorrectNetwork();
  }, []);

  async function clickDisconnect() {
    disconnect();
    props.setConn(false);
  }

  async function clickConnect() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await connect(new EthereumAuthProvider(window.ethereum, accounts[0]));
    props.setAddr(accounts[0]);
    props.setConn(true);
    console.log(window.ethereum);
  }

  return correctNetwork === false ? (
    "Please switch to Mumbai testnet"
  ) : connection.status === "connected" ? (
    <div>
      <Button variant="contained" onClick={clickDisconnect}>
        Disconnect
      </Button>
    </div>
  ) : (
    <Button variant="contained" onClick={clickConnect}>
      Connect
    </Button>
  );
}

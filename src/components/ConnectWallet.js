import Button from "@mui/material/Button";

import { useState, useEffect } from "react";
import { EthereumAuthProvider, useViewerConnection } from "@self.id/framework";
import { devChainId, mumbaiChainId } from "../utils/constants";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { Caip10Link } from "@ceramicnetwork/stream-caip10-link";

const localhostChainId = `0x${Number(devChainId).toString(16)}`;
const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");

export default function ConnectWallet(props) {
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [connection, connect, disconnect] = useViewerConnection();

  // Checks if wallet is connected to the correct network
  async function checkCorrectNetwork() {
    let chainId = await window.ethereum.request({ method: "eth_chainId" });
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

  useEffect(() => {
    if (connection.status === "connected") {
      createCaip10Link();
    }
  }, [connection]);

  // Once the connection is established, setup a caip10 link
  // to link the wallet to the Ceramic DID
  async function createCaip10Link() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const authProvider = new EthereumAuthProvider(window.ethereum, accounts[0]);

    const accountId = await authProvider.accountId();
    console.log(accountId);
    console.log(accountId.toString());
    console.log(connection.selfID.id);
    const accountLink = await Caip10Link.fromAccount(
      ceramic,
      accountId.toString()
    );
    await accountLink.setDid(connection.selfID.id, authProvider);

    console.log(accountLink);
  }

  // to use if accidentally I link a 2nd wallet to the same DID
  async function unlinkCurrentAddress() {
    // First, we need to create an EthereumAuthProvider with the account currently selected
    // The following assumes there is an injected `window.ethereum` provider
    const addresses = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const authProvider = new EthereumAuthProvider(
      window.ethereum,
      addresses[0]
    );

    // Retrieve the CAIP-10 account from the EthereumAuthProvider instance
    const accountId = await authProvider.accountId();

    // Load the account link based on the account ID
    const accountLink = await Caip10Link.fromAccount(
      ceramic,
      accountId.toString()
    );

    // Finally, unlink the DID from the account using the EthereumAuthProvider instance
    await accountLink.clearDid(authProvider);
  }

  // Connect/discoonect wallet
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

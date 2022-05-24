import { useState, useEffect } from "react";
import { EthereumAuthProvider, useViewerConnection } from "@self.id/framework";

const mumbaiChainId = "0x13881";
const devChainId = 1337;
const localhostChainId = `0x${Number(devChainId).toString(16)}`;

export default function ConnectWallet(props) {
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [connection, connect, disconnect] = useViewerConnection();

  // Checks if wallet is connected
  async function checkIfWalletConnected() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length !== 0) {
        console.log("found authorized account: ", accounts[0]);
        props.setAddr(accounts[0]);
      } else {
        console.log("no authorized account found");
      }
    } else {
      console.log("Metamask not detected");
    }
  }

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
    checkIfWalletConnected();
    checkCorrectNetwork();
  }, []);

  return correctNetwork === false ? (
    "Please connect to Mumbai testnet"
  ) : connection.status === "connected" ? (
    <div>
      <button
        id="walletButton"
        onClick={() => {
          disconnect();
        }}
      >
        Disconnect
      </button>
      <br></br>
      {connection.selfID.id}
      <br></br>
      {String(props.addr).substring(0, 6) +
        "..." +
        String(props.addr).substring(38)}
    </div>
  ) : "ethereum" in window ? (
    <button
      disabled={connection.status === "connecting"}
      onClick={async () => {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await connect(new EthereumAuthProvider(window.ethereum, accounts[0]));
        props.setConn(true);
      }}
    >
      Connect
    </button>
  ) : (
    <p>
      An injected Ethereum provider such as{" "}
      <a href="https://metamask.io/">MetaMask</a> is needed to authenticate.
    </p>
  );
}

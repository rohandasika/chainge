import { useEffect } from "react";

const mumbaiChainId = "0x13881";
const devChainId = 1337;
const localhostChainId = `0x${Number(devChainId).toString(16)}`;

export default function ConnectWallet(props) {
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
      props.setNet(false);
    } else {
      props.setNet(true);
    }
  }

  // Triggered by button to connect to wallet
  async function connectToWallet() {
    try {
      if (!window.ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);

      if (chainId !== mumbaiChainId && chainId !== localhostChainId) {
        alert("You are not connected to the Mumbai Testnet!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Found account", accounts[0]);
      props.setAddr(accounts[0]);
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  }

  // Check if connected on load
  useEffect(() => {
    checkIfWalletConnected();
    checkCorrectNetwork();
  }, []);

  return (
    <button id="walletButton" onClick={connectToWallet}>
      {props.addr !== "" && props.corrNet ? (
        "Connected: " +
        String(props.addr).substring(0, 6) +
        "..." +
        String(props.addr).substring(38)
      ) : (
        <span>Connect Wallet</span>
      )}
    </button>
  );
}

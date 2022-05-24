import "./App.css";

import { useState } from "react";

import ConnectWallet from "./components/ConnectWallet";
import Minter from "./components/Minter";
import MintedNFTs from "./components/MintedNFTs";
import { Provider } from "@self.id/framework";

export default function App({ children }) {
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [status, setStatus] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [connected, setConnected] = useState(false);

  async function setAccount(addr) {
    setCurrentAccount(addr);
  }

  async function getConnected(value) {
    setConnected(value);
  }

  async function updateNFTs(nfts) {
    setMintedNFTs(nfts);
  }

  return (
    <div className="Minter">
      <Provider client={{ ceramic: "testnet-clay" }}>{children}</Provider>
      <div>
        <ConnectWallet
          addr={currentAccount}
          setAddr={setAccount}
          setConn={getConnected}
        ></ConnectWallet>

        <Minter
          addr={currentAccount}
          connected={connected}
          updateNFTs={updateNFTs}
        ></Minter>
      </div>
      <br></br>
      <div>
        <MintedNFTs nfts={mintedNFTs}></MintedNFTs>
      </div>
    </div>
  );
}

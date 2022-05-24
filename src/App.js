import "./App.css";

import { useState } from "react";

import ConnectWallet from "./components/ConnectWallet";
import Minter from "./components/Minter";
import MintedNFTs from "./components/MintedNFTs";

export default function App() {
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [status, setStatus] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  async function setAccount(addr) {
    setCurrentAccount(addr);
  }

  async function setNetwork(value) {
    setCorrectNetwork(value);
  }

  async function updateNFTs(nfts) {
    setMintedNFTs(nfts);
  }

  return (
    <div className="Minter">
      <div>
        <ConnectWallet
          addr={currentAccount}
          corrNet={correctNetwork}
          setAddr={setAccount}
          setNet={setNetwork}
        ></ConnectWallet>

        <Minter
          addr={currentAccount}
          corrNet={correctNetwork}
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

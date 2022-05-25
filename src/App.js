import "./App.css";

import { useState } from "react";
import { Provider } from "@self.id/framework";

import MenuBar from "./components/MenuBar";
import Body from "./components/Body";

import { aliases } from "./utils/constants";

export default function App({ children }) {
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [verifiedNFTs, setVerifiedNFTs] = useState([]);
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

  async function updateVerifiedNFTs(nfts) {
    setVerifiedNFTs(nfts);
    // console.log(nfts);
  }

  return (
    <div>
      <Provider client={{ ceramic: "testnet-clay", aliases }}>
        <MenuBar
          addr={currentAccount}
          setAddr={setAccount}
          setConn={getConnected}
          updateNFTs={updateNFTs}
        ></MenuBar>

        {connected && (
          <Body
            addr={currentAccount}
            connected={connected}
            mintedNFTs={mintedNFTs}
            updateNFTs={updateNFTs}
            verifiedNFTs={verifiedNFTs}
            updateVerifiedNFTs={updateVerifiedNFTs}
          ></Body>
        )}
      </Provider>
    </div>
  );
}

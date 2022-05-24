import "./App.css";

import { useState } from "react";
import { Provider } from "@self.id/framework";

import ConnectWallet from "./components/ConnectWallet";
import Minter from "./components/Minter";
import MintedNFTs from "./components/MintedNFTs";
import UserProfile from "./components/UserProfile";

const aliases = {
  definitions: {
    basicProfile:
      "kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic",
  },
  schemas: {
    BasicProfile:
      "ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio",
  },
  tiles: {},
};

export default function App({ children }) {
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [status, setStatus] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [connected, setConnected] = useState(false);
  const [did, setDID] = useState("");

  async function setAccount(addr) {
    setCurrentAccount(addr);
  }

  async function getConnected(value) {
    setConnected(value);
  }

  async function updateNFTs(nfts) {
    setMintedNFTs(nfts);
  }

  async function updateDID(did) {
    setDID(did);
  }

  return (
    <div className="Minter">
      <Provider client={{ ceramic: "testnet-clay", aliases }}>
        {children}
        <div>
          <ConnectWallet
            addr={currentAccount}
            setAddr={setAccount}
            setConn={getConnected}
            setDID={updateDID}
          ></ConnectWallet>

          <Minter
            addr={currentAccount}
            connected={connected}
            updateNFTs={updateNFTs}
          ></Minter>
        </div>
        <br></br>

        <MintedNFTs nfts={mintedNFTs}></MintedNFTs>

        <UserProfile did={did}></UserProfile>
      </Provider>
    </div>
  );
}

import "./App.css";
import MenuBar from "./components/MenuBar";
import Home from "./components/Home";
import Friends from "./components/Friends";
import Search from "./components/Search";

import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "@self.id/framework";
import { aliases } from "./utils/constants";

export default function App({ children }) {
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [verifiedNFTs, setVerifiedNFTs] = useState([]);
  // const [status, setStatus] = useState("");
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
        <br></br>
        <br></br>

        {connected && (
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  addr={currentAccount}
                  connected={connected}
                  mintedNFTs={mintedNFTs}
                  updateNFTs={updateNFTs}
                  verifiedNFTs={verifiedNFTs}
                  updateVerifiedNFTs={updateVerifiedNFTs}
                ></Home>
              }
            ></Route>
            <Route path="friends" element={<Friends></Friends>}></Route>
            <Route
              path="search"
              element={<Search addr={currentAccount}></Search>}
            ></Route>
          </Routes>
        )}
      </Provider>
    </div>
  );
}

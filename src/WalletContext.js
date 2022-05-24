import { createContext } from "react";

const WalletContext = createContext({
  walletAddress: "",
  setWalletAddress: () => {},
});

export default WalletContext;

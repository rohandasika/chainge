export const NFT_COUNT = 5;
export const mumbaiChainId = "0x13881";
export const devChainId = 1337;

export const nftContractAddress = "0xAF6DD90b4562BA12f3B1aeaae404a4709253DF14";
export const DEMO_ADDRESS = "0x148d59faf10b52063071eddf4aaf63a395f2d41c";

export const PINATA_URL =
  "https://gateway.pinata.cloud/ipfs/QmSFB1nTnbBPWZ11tmcpetH2yDa5RGvE4QKvrh1aJs34eE/";
export const MUMBAI_URL = "https://mumbai.polygonscan.com/tx/";
export const OPENSEA_URL = `https://testnets.opensea.io/assets/mumbai/${nftContractAddress}/`;
export const CYBERCONNECT_ENDPOINT = "https://api.cybertino.io/connect/";

export const aliases = {
  definitions: {
    basicProfile:
      "kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic",
    ChaingeVerification:
      "kjzl6cwe1jw1464skew763l3skk3rn8nh4szd81gpoic7x1epzq1ke42qyz4nnd",
  },
  schemas: {
    BasicProfile:
      "ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio",
    ChaingeVerification:
      "ceramic://k3y52l7qbv1fry495920ecsm6e13fyrli2s0bkhu3twx8yixpp3uqabis0mt6pcsg",
  },
  tiles: {},
};

export const nullAction = {
  nftAction: [
    {
      nftID: "0",
      action: "",
      date: "2000-01-01",
    },
  ],
};

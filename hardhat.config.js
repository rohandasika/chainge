require("dotenv").config({ path: __dirname + "/.env" });
require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/166b143e29f84d2da0b368cc93f66a09",
      accounts: [
        "cfe7b31f84da00c28552776a9e3045f5b94028b8acdfe6db91a5ba87ba0da65d",
      ],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

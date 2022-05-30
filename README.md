# Chainge: the chain of change

Chainge is a web3 app that empowers users to create change around themselves and to encourage their communities to do the same. Users can mint an NFT which contains an "act of kindness" that they must do and continue the chain by transferring the token to their friends. This project was built for the EthShanghai 2022 hackathon.

<img  src="chainge-logos.jpeg" />

## Contents

- [How it Works](#how-it-works)
- [Technologies Used](#tech-used)
- [Bounties](#bounties)
- [Setup Instructions](#setup-instructions)

### How it Works

### Technologies Used

- Network: [Polygon Mumbai](https://polygon.technology/)
- Smart contract development: Truffle
- RPC endpoints: Infura
- Front-end hosting and NFT image storage: Arweave
- Social connections: CyberConnect
- User profiles & Dynamic NFT metadata: Ceramic
- Front-end library: Create React App
- UI library: Material UI React

### Bounties

#### Bounty 1: [BUIDL For Social Good On Web3 With Infura And Truffle with a Layer 2 Solution](https://gitcoin.co/issue/28876)

text

#### Bounty 2: [Build Best Social Dapps With CyberConnect](https://gitcoin.co/issue/28881)

text

#### Bounty 3: [Build A DApp Using Arweave](https://gitcoin.co/issue/28889)

The [image](https://ugnie2vqerzywroilo3dk4lerfv2xxidwfxxy2w5koozrtkwhq.arweave.net/oZqCarAkc4tFyFu2NXFki_Wur3QOxb3xq3VOdmM1WPE) for each NFT that is minted is stored on Arweave, using ArDrive. Further, using `arkb` and `bundlr`, the frontend of the app is deployed to the permaweb 🐘 as well. I would have used Arweave to host _all_ the NFT metadata, but since the times that an action has been completed must be incremented on every verification, I chose to go with Ceramic for the dynamic NFT metadata.

#### Bounty 4: [Polygon Track 3 (Open Track)](https://gitcoin.co/issue/28870)

Chainge is built and tested fully on the Polygon Mumbai test network. Since this is an application in which we want the tokens to be frequently transferred between people, it has to be deployed on a fast network with low fees.

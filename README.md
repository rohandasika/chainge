# Chainge: the chain of change

Chainge is a web3 dApp that empowers users to create change around themselves and to encourage their communities to do the same. Users can mint an NFT containing an "act of kindness" which they must do and then continue the chain by transferring the token to their friends. This project was conceptualized and built for the [EthShanghai 2022](https://hackathon.ethshanghai.org/) hackathon.

<img src="chainge-logos.jpeg" | width=100/>

## Contents

- [How it Works](#how-it-works)
- [Technologies Used](#tech-used)
- [Bounties](#bounties)
- [Guide](#guide)

### How it Works

### Technologies Used

- Network: [Polygon Mumbai](https://polygon.technology/)
- Smart contract development: [Truffle](https://trufflesuite.com/)
- RPC endpoints: [Infura](https://infura.io/)
- Front-end hosting & NFT image storage: [Arweave](https://www.arweave.org/)
- Social connections: [CyberConnect](https://cyberconnect.me/)
- User profiles & Dynamic NFT metadata: [Ceramic](https://ceramic.network/)
- Front-end library: [Create React App](https://create-react-app.dev/)
- UI library: [Material UI React](https://mui.com/material-ui/getting-started/installation/)

### Bounties

#### Bounty 1: [BUIDL For Social Good On Web3 With Infura And Truffle with a Layer 2 Solution](https://gitcoin.co/issue/28876)

The project's entire development was done through a combination of using Truffle as a dev environment with Infura endpoints, amongst others. I started by using a combination of the [Truffle React Box](https://trufflesuite.com/boxes/react/) and [Truffle Polygon Box](https://trufflesuite.com/boxes/polygon/). However, I ran into a few configuration issues with _actually_ deploying using a combination of these tools, as detailed in this [Discord thread](https://discord.com/channels/969606926868570162/973945098746335252/980448997892296704).

Ultimately, I was able to get the following combinations working...

- Truffle + Infura Rinkeby `wss://` endpoint
- Truffle + Matic Vigil `http://` and `wss://` endpoints
- Hardhat + Infura Mumbai `http://` endpoint

In the end, the app was deployed using Truffle and the Matic Vigil `wss://` endpoint. There was a lot of online discussion in the Truffle forums about using only the Infura `wss://` endpoints (instead of `http://`), but unfortunately, Infura _only_ has a `http://` for the Polygon Mumbai testnet.

#### Bounty 2: [Build Best Social Dapps With CyberConnect](https://gitcoin.co/issue/28881)

Building a social dApp like this without CyberConnect isn't possible. The purpose is to find friends to share tokens with and view each other's progress, and I used CyberConnect's SDK to incorporate the "Follow" Button. With this, users can clearly see who follows them, who they follow, and use those addresses to search for what acts of kindness they have completed.

#### Bounty 3: [Build A DApp Using Arweave](https://gitcoin.co/issue/28889)

The [image](https://ugnie2vqerzywroilo3dk4lerfv2xxidwfxxy2w5koozrtkwhq.arweave.net/oZqCarAkc4tFyFu2NXFki_Wur3QOxb3xq3VOdmM1WPE) for each NFT that is minted is stored on Arweave, using ArDrive. Using `arkb` and `bundlr`, the frontend of the [app is deployed to the permaweb](https://yyfyrtzye2u2lxcwy6n4pr2cfh5ucrqsl5mopvouauv6unym.arweave.net/xguIzzgmqaXcV-sebx8dCKft_BRhJfWOfV1AUr6jcMY/) 🐘 as well. I would have used Arweave to host _all_ the NFT metadata, but I chose to go with Ceramic instead to support dynamic NFT metadata. Each time an 'act of kindness' is completed, a counter in the metadata must be incremented.

#### Bounty 4: [Polygon Track 3 (Open Track)](https://gitcoin.co/issue/28870)

Chainge is built and tested fully on the Polygon Mumbai test network. Since this is an application in which we want the NFTs to be frequently transferred between people, it must be deployed on a fast network with low fees.

### Guide

A guide on how to develop an application with these components (both to be helpful to the reader, and to be a reminder for myself!)

#### Setup

#### Create and deploy Smart Contract

#### Create the Ceramic streams

#### Deploy front-end on Arweave

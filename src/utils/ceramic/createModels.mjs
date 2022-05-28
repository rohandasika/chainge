import { writeFile } from "node:fs/promises";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays";

import { chaingeVerificationSchema, nftMetadataSchema } from "./schemas.mjs";

// run glaze:did create and get the outputted seed
const key = fromString(
  "3dae22d9616a4ff17871a581c43b3e76cceacc6e4434a340315802108fcf3a9c",
  "base16"
);

// Create and authenticate the project's DID
const did = new DID({
  provider: new Ed25519Provider(key),
  resolver: getResolver(),
});
await did.authenticate();

// Create the Ceramic obj and model manager
const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
ceramic.did = did;
const manager = new ModelManager({ ceramic });

// Create schemas on Ceramic and get their IDs
const chaingeVerificationSchemaID = await manager.createSchema(
  "ChaingeVerification",
  chaingeVerificationSchema
);
const nftMetadataSchemaID = await manager.createSchema(
  "nftMetadata",
  nftMetadataSchema
);

// Create definitions using schema IDs
await manager.createDefinition("ChaingeVerification", {
  name: "Chainge Verifier",
  description: "Verification service for your Chainges",
  schema: manager.getSchemaURL(chaingeVerificationSchemaID),
});
await manager.createDefinition("nftMetadata", {
  name: "NFT Metadata",
  description: "Metadata for NFTs",
  schema: manager.getSchemaURL(nftMetadataSchemaID),
});

// Deploy the data models from the ModelManager
const model = await manager.deploy();
await writeFile("./model.json", JSON.stringify(model));

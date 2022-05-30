import { writeFile } from "node:fs/promises";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays";

// run glaze:did create and get the outputted seed
const key = fromString(
  "3dae22d9616a4ff17871a581c43b3e76cceacc6e4434a340315802108fcf3a9c",
  "base16"
);
// NFT metadata
export const nftMetadataSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  title: "nftMetadata",
  properties: {
    token_id: {
      type: "integer",
    },
    name: {
      type: "string",
    },
    image: {
      type: "string",
    },
    traits: {
      type: "array",
      items: {
        type: "object",
        properties: {
          trait_type: {
            type: "string",
          },
          value: {
            type: ["integer", "string"],
          },
        },
      },
    },
  },
};

// NFT verification model to track when a user has completed the task
export const chaingeVerificationSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  title: "ChaingeVerification",
  properties: {
    verifiedActions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          token_id: {
            type: "number",
            default: "",
          },
          action: {
            type: "string",
            default: "",
          },
          date: {
            type: "string",
            format: "date",
            default: "",
          },
        },
      },
    },
  },
};

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
await writeFile("./dataModels.json", JSON.stringify(model));

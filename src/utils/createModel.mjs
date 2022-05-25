// import ChaingeVerification from "./ChaingeVerification.json" assert { type: "json" };
import { writeFile } from "node:fs/promises";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays";

// The key must be provided as an environment variable
const key = fromString(
  "026e1b87ec8ea5d7436b7d28bde7d26255012c346d705255df829523e605b658",
  "base16"
);

const ChaingeVerification = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  title: "ChaingeVerification",
  properties: {
    nftAction: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nftID: {
            type: "string",
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
// Create and authenticate the DID
const did = new DID({
  provider: new Ed25519Provider(key),
  resolver: getResolver(),
});
await did.authenticate();

// Connect to Clay network
const API_URL = "https://ceramic-clay.3boxlabs.com";

// Create the Ceramic object
const ceramic = new CeramicClient(API_URL);
ceramic.did = did;

// Create a manager for the model
const manager = new ModelManager({ ceramic });

// Create the Schema and retreive the ID
const ChaingeVerificationSchemaID = await manager.createSchema(
  "ChaingeVerification",
  ChaingeVerification
);
// Create the definition using the schema ID
await manager.createDefinition("ChaingeVerification", {
  name: "Chainge Verifier",
  description: "Verification service for your Chainges",
  schema: manager.getSchemaURL(ChaingeVerificationSchemaID),
});

// Deploy the data model from the ModelManager
const model = await manager.deploy();

await writeFile("./model.json", JSON.stringify(model));

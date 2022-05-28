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

export const tokenMappingSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    tokens: {
      type: "array",
      items: {
        type: "object",
        properties: {
          token_id: {
            type: "number",
          },
          nft_streamID: {
            type: "string",
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
    nftAction: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nftID: {
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

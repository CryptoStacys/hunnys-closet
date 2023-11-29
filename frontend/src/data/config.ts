let mode: string = "prod"; // "dev" | "prod"

let thumbnailPath: string = "layers_300x300_composite";

// Key to save recently used colors into local storage
const localStorageKey = "hunnys-dollys-color";
const localStorageToken = "hunnys-dollys-token";

let basePath: string = "",
  serverPath: string,
  layersPath: string,
  itemsPath: string,
  hunnysAddress: string,
  dollysAddress: string,
  chainID: number;

// DEV ENVIRONMENT
if (mode === "dev") {
  serverPath = "http://192.168.173.5:8001"; // php
  serverPath = "http://192.168.173.5:8001"; // hunnys-server put in your own IP for testing
  basePath = "/"; // react public folder
  // hunnysAddress = "0xA87953C5eB363e1354e3E6061B3e7116854E1bFa"; // GOERLI OLD
  // closetAddress = "0xFBC56b6a79E76CecA94F405A9D1C24c8B9eB4F42"; // GOERLI OLD
  hunnysAddress = "0xBF6C58774835f745507B776f6c66232357EBA03C"; // GOERLI
  dollysAddress = "0xeA45d09A45F4dDC7a9aA12a77ecc8694B9027aaD"; // GOERLI
  chainID = 5; // GOERLI
}

// LIVE TEST ENVIRONMENT
if (mode === "test") {
  serverPath = "http://82.180.130.139:8001"; // node server
  basePath = "/"; // react public folder
  hunnysAddress = "0xBF6C58774835f745507B776f6c66232357EBA03C"; // GOERLI
  dollysAddress = "0xeA45d09A45F4dDC7a9aA12a77ecc8694B9027aaD"; // GOERLI
  chainID = 5; // GOERLI
}

// PRODUCTION ENVIRONMENT
if (mode === "prod") {
  serverPath = "http://82.180.130.139:8001";
  basePath = "/"; // react public folder
  // basePath = "https://hunnys-web.s3.us-east-2.amazonaws.com/"; // possibly AWS for production
  hunnysAddress = "0x5dfeb75abae11b138a16583e03a2be17740eaded"; // ethereum mainnet
  dollysAddress = "0xC8465f21E35AfD1De06A81D932392C47b1BEA42A"; // ethereum mainnet
  chainID = 1; // ethereum mainnet
}

// UNIVERSAL
layersPath = `${basePath}layers_600x600/`;

const attributes = [
  "Background",
  "Skin",
  "Eyebrows",
  "Hat",
  "Eyes",
  "Face Sticker",
  "Piercing",
  "Mouth",
  "Hair Style",
  "Accessory",
  "Outfit",
  "Hand",
  "Tattoo",
  "Bodysuit",
  "Frame",
  "Undergarment",
];

const hunnysColors: any = {
  common: "#A4A4A4",
  uncommon: "#2BC97E",
  rare: "#4B57FF",
  epic: "#4BB7FF",
  legendary: "#FFA54B",
  mythic: "#7B2BFF",
  immortal: "#FF2626",
  relic: "#774A2D",

  purple: "#9e63ff",
  yellow: "#ffd54b",
  orange: "#a26106",
  blue: "#700cf5",
  gray: "#aaa",
  black: "#111",
};

export {
  attributes,
  localStorageKey,
  hunnysColors,
  mode,
  thumbnailPath,
  localStorageToken,
  serverPath,
  layersPath,
  hunnysAddress,
  dollysAddress as closetAddress,
  chainID,
};

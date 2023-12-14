import Jimp from "jimp";
import fs from "fs";
import path from "path";

const basepath = "src/img/";
const input = "sincos_300x";
const output = "sincos_300x_composite4";
const extension = ".jpg";

function createFolders(data) {
  fs.mkdirSync(path.join(basepath, output), { recursive: true });
  Object.keys(data).map((category) => {
    fs.mkdirSync(path.join(basepath, output, category), { recursive: true });
  });
}

// purple 1 6e007f, pink 2 ea00b7 , blue 3 5c38ff, light purple 4 bf6df9, light pink 5 fc6bff
const layerColors = [
  "#6e007f", // C1
  "#ea00b7", // C2
  "#5c38ff", // C3
  "#bf6df9", // C4
  "#fc6bff", // C5
  "#ff4766", // C6
];

const defaultColors = ["#f00", "#00f", "#0f0"];

function getOrders() {
  const collection = fs.readFileSync("src/data/collection_sincos.json");
  const data = JSON.parse(collection).attributes;
  // delete data["Background"];

  // Prepare folder structure
  createFolders(data);

  const orders = [];
  Object.entries(data).map((entry) => {
    const [category, traits] = entry;
    const inPath = path.join(basepath, input, category);
    const outPath = path.join(basepath, output, category);
    // create category folder
    fs.mkdirSync(outPath, { recursive: true });

    Object.entries(traits)
      // take voodoo eyes out of loop until it's fixed
      .filter((entry) => {
        const [trait, info] = entry;
        if (trait === "VoodooEyes") return false;
        if (trait === "SpaceEyes") return false;
        return true;
      })
      .map((entry) => {
        const [trait, info] = entry;
        const layers = [];
        let prefix = ["", ""];

        // Background and skincolor
        let suffix = "";
        if (category != "Background" && category != "Skin") {
          suffix = "_L";
        }

        // const color = "#f03";
        layers.push(["src/img/sincos_300x/Colors/White.png", "none"]);
        //
        layers.push(["src/img/sincos_300x/Body/Base_Merged_BW.png", "none"]);

        // If 2 part trait
        if (info.parts == 2 || category == "Eyes") {
          // Eyes are named Left/Right instead of the usual _Back _Front
          if (category == "Eyes") {
            prefix = ["Left", "Right"];
          } else {
            prefix = ["_Back", "_Front"];
          }

          // LAYER STANDARD COLORS
          // Loop through all the colors
          for (let k = 1; k <= info.colors; k++) {
            layers.push([
              path.join(inPath, `${trait}${prefix[0]}_C${k}.png`),
              layerColors[k], // add special Layer colors
              // "none",
            ]);
          }

          // Then add Lineart
          layers.push([
            path.join(inPath, `${trait}${prefix[0]}${suffix}.png`),
            "none",
            // "#fff",
          ]);
        }

        for (let k = 1; k <= info.colors; k++) {
          layers.push([
            path.join(inPath, `${trait}${prefix[1]}_C${k}.png`),
            layerColors[k], // add special Layer colors
            // "none",
          ]);
        }

        layers.push([
          path.join(inPath, `${trait}${prefix[1]}${suffix}.png`),
          "none",
          // "#fff",
        ]);

        orders.push({
          layers: layers,
          to: path.join(outPath, `${trait}${extension}`),
        });
      });
  });
  return orders;
}

async function composite(i, orders) {
  const layers = orders[i].layers;
  const to = orders[i].to;

  // Read all images
  for (let i = 0; i < layers.length; i++) {
    const layer = await Jimp.read(layers[i][0]);
    // Potential coloring in happening here
    if (layers[i][1] !== "none") {
      console.log("coloring in", layers[i]);
      // layer.mix({ color: color, amount: 100 });
      layer.color([{ apply: "mix", params: [layers[i][1], 100] }]);
    }
    layers[i] = layer;
  }

  // Build composite image
  for (let i = 1; i < layers.length; i++) {
    layers[0] = await layers[0].composite(layers[i], 0, 0);
  }

  console.log(i, orders[i].to);
  // Write image
  layers[0].quality(60).write(to, () => {
    if (i < orders.length - 1) {
      composite(i + 1, orders);
    } else {
      console.log("DONE");
    }
  });
}
composite(0, getOrders());

// BACKGROUND
// METAL WINGS (ACCESSORY)
// HAT (BACK)
// SKIN (BASE)
// HAIR (BACK)
// BACKPACK STRAPS RIGHT (ACCESSORY)
// FACE STICKERS
// EYEBROWS
// EYE LEFT
// ACCESSORY (BACKPACK)
// OUTFIT
// ACCESSORY (DEFAULT)
// BACKPACK STRAPS LEFT (ACCESSORY)
// HAIR (FRONT / DEFAULT)
// HAT (FRONT / DEFAULT)
// ACCESSORY (ON TOP)
// PIERCING
// MOUTH
// SEPTUM (PIERCING)
// EYE RIGHT

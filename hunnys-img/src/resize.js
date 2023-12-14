import Jimp from "jimp";
import getFiles from "./getFiles.js";

const size = 300;
const from = "sincos_3000x";
const to = `sincos_${size}x`;
const width = size;
const height = size;
const files = getFiles(from);

function resize(i = 0) {
  step = performance.now();
  const file = files[i];
  const toPath = file.replace(from, to);
  Jimp.read(file)
    .then((img) => {
      return (
        img
          .resize(width, height) // resize
          //.quality(60) // set JPEG quality
          .write(toPath)
      );
    })
    .then(() => {
      let now = performance.now();
      const timeBetween = (now - step) / 1000;
      const timeTotal = (now - start) / 1000;
      const estimate = (files.length - i - 1) * timeBetween;

      console.log(
        `Resized ${i + 1}/${files.length} - ${timeBetween.toFixed(
          2
        )}s/${timeTotal.toFixed(2)}s - estimated ${estimate.toFixed(
          2
        )}s - ${file}`
      );
      if (i < files.length - 1) {
        resize(i + 1);
      } else {
        console.log(
          `Done with set - ${((performance.now() - start) / 1000).toFixed(2)}s`
        );
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

const start = performance.now();
let step = 0;
resize();

/*

node src/resize 

*/

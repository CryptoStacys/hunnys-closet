import Jimp from "jimp";

const width = 300;
const height = 300;

Jimp.read("./src/img/base.png")
  .then((img) => {
    return (
      img
        // .resize(width, height) // resize
        .greyscale()
        .color([
          { apply: "lighten", params: [50] },
          // { apply: "darken", params: [100] },
          // { apply: "mix", params: ["#00f", 100] },
          // { apply: "xor", params: ["#f00"] },
        ])
        .write("./src/img/test4.png")
    ); // save
  })
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.error(err);
  });

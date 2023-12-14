import Jimp from "jimp";
Jimp.read("src/img/base_grey.png")
  .then((img) => {
    return (
      img
        .resize(300, 300) // resize
        // .quality(60) // set JPEG quality
        // .greyscale() // set greyscale
        .write("src/img/base_grey_300x.png")
    ); // save
  })
  .catch((err) => {
    console.error(err);
  });

import { useState, useRef, useEffect } from "react";
import { getLayers } from "./getLayers";
import { Loader } from "../Loader/Loader";
import { motion } from "framer-motion";
import { Token, Layer } from "../../data/global";
import SecondaryButton from "../DollEditor/SecondaryButton";
import { useCancellablePromise } from "./cancellablePromise";

import { fabric } from 'fabric';

export default function Render(props: { token: Token | any; download?: boolean; dollyId?: any; }) {
  const width = 600;
  const height = 600;

  const [done, doneSet] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState('');
  const { cancellablePromise } = useCancellablePromise();

  // loading animation
  const variants = {
    open: { opacity: 1, transition: { duration: 0 } },
    closed: { opacity: 0, transition: { duration: 0.4 } },
  };

  useEffect(() => {
    const canvas = new fabric.Canvas('canvas', {
      width: width,
      height: height
    });

    renderCanvas(canvas);

    return () => {
      let objs: any = canvas.getObjects();
      for (let i = 0; i < objs.length; i++) {
        canvas.remove(objs[i]);
        objs[i].dispose();
      }
      canvas.dispose();
    };
  }, [props.token]);

  async function renderCanvas(canvas: any) {

    let formattedLayers = await cancellablePromise(getLayers(props.token));
    let apiImages = await cancellablePromise(loadLocalLayers(formattedLayers));
    let formattedImages = formatLoadedImages(apiImages);

    canvas.add(...formattedImages);

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });

    setImageDataUrl(dataURL);

    doneSet(true);
  }

  // function imageExists(pathObj: any){
  //   return new Promise(async resolve => {
  //     let fileExists = false;
  //     if(pathObj.hasOwnProperty('pattern')) {
  //       let pattern: any = await isImageFound(pathObj.pattern);
  //       let srcImg: any = await isImageFound(pathObj.src);

  //       if(pattern && srcImg) {
  //         fileExists = true;
  //       } else {
  //         console.log('image not found: ', pathObj.src);
  //       }
  //     } else {
  //       let srcImg: any = await isImageFound(pathObj.src);
  //       if(srcImg) {
  //         fileExists = true;
  //       } else {
  //         console.log('image not found: ', pathObj.src);
  //       }
  //     }

  //     resolve(fileExists)

  //   })
  // }

  // function checkLayers(layers: any) {
  //   return new Promise(async resolve => {
  //     let newLayers = [];

  //     for (let i = 0; i < layers.length; i++) {
  //       let fileExists = await imageExists(layers[i]);
  //       if(fileExists) {
  //         newLayers.push(layers[i]);
  //       }

  //     }

  //     resolve(newLayers);
  //   })
  // }

  // function isImageFound(imageName: any) {
  //   return new Promise(async resolve => {
  //     // let fileExists = true;
  //     let res = fetch(`http://localhost:3000${imageName}`).then(response => {
  //       if(response.status !== 200) {
  //         // console.log('hi');
  //       }
  //       return response;
  //     }).catch((error) => {
  //       console.log(error)
  //       return false;
  //     });

  //     let result = !res? false: true;

  //     resolve(result);
  //   })
  // }


  function download() {
    const link = document.createElement("a");
    link.href = imageDataUrl;
    link.download = "Dolly.png"; // Specify the filename for the downloaded image
    link.click(); // Trigger the download
  }

  function urlContentToDataUri(url: any) {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise(callback => {
        let reader = new FileReader();

        reader.onload = function () {
          callback(this.result)
        };
        reader.readAsDataURL(blob);
      }));
  }



  //////////////////////////////////////////////////// Fabric rebuffle

  function formatLoadedImages(loadedImages: any) {
    let result = [];

    for (let i = 0; i < loadedImages.length; i++) {
      let match = loadedImages.find((elm: any) => elm.id === i);
      let img = match.base64.img;

      img.selectable = false;

      result.push(img);
    }

    return result;
  }

  function createFilledImage(srcImage: any, maskImage: any, i: any) {
    return new Promise(async resolve => {
      const maskFilter = new fabric.Image.filters.BlendImage({
        image: maskImage.img,
        mode: 'mask'
      });

      srcImage.img.filters.push(maskFilter);

      srcImage.img.applyFilters();

      resolve({ img: srcImage.img, id: i });
    })
  }

  //load images
  function loadLocalLayers(layers: any) {
    return new Promise(async resolve => {
      let promises = [];

      for (let i = 0; i < layers.length; i++) {
        if (!layers[i].hasOwnProperty('pattern')) {
          promises.push(loadLayer(layers[i].src, i));
        } else {
          promises.push(loadMaskLayers(layers[i], i));
        }
      }

      let result = await cancellablePromise(Promise.all(promises));

      resolve(result);
    })
  }

  function loadMaskLayers(obj: any, id: any) {
    return new Promise(async resolve => {

      let srcImg: any = await cancellablePromise(loadLayer(obj.pattern, id));
      let maskImg: any = await cancellablePromise(loadLayer(obj.src, id));

      let filledImage = await createFilledImage(srcImg.base64, maskImg.base64, id);

      resolve({ id: id, base64: filledImage });
    })
  }

  function loadLayer(path: any, id: any) {
    return new Promise(async resolve => {
      let img = await cancellablePromise(getLocalImageData(path));

      resolve({ id: id, base64: img });
    });
  }

  function getLocalImageData(path: any) {
    return new Promise(function (resolve) {
      // new fabric.Image.fromURL('http://localhost:3000' + path, function (oImg: any, err: any) {
        fabric.Image.fromURL(path, function (oImg: any) {
          if (!oImg) {
              console.log('error on load:', path);
          }
          resolve({ img: oImg });
      });
    })
  }

  //////////////////////////////////////////////////// Fabric rebuffle end



  async function downloadHD() {
    let dataUri: any = await urlContentToDataUri(`https://publicrattyb.s3.us-east-2.amazonaws.com/${props.dollyId}.png`);
    const link = document.createElement("a");
    link.href = dataUri; // TODO: Add AWS LINK TO DOLLY HERE
    link.download = `Dolly#${props.dollyId}.png`; // Specify the filename for the downloaded image
    link.click(); // Trigger the download
  }

  return (
    <div className="relative  w-full h-full shadow-md bg-white rounded-lg">
      {/* optional loading animation */}
      <motion.div
        animate={done ? "closed" : "open"}
        variants={variants}
        className="z-50 rounded-lg absolute w-full h-full bg-white"
      >
        <Loader text="Rendering..." />
      </motion.div>
      {imageDataUrl && <img className="relative z-10 rounded-lg aspect-square w-full" src={imageDataUrl} alt="Canvas Image" />}
      {props.download &&
        <div className="bg-white rounded-lg py-2 px-4 shadow-lg mt-2">
          <div className="grid grid-cols-1">
            <SecondaryButton onClick={download}>Download</SecondaryButton>
            {/* <SecondaryButton onClick={downloadHD}>Download HD</SecondaryButton> */}
          </div>
        </div>
      }
    </div>
  );
}

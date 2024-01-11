import { useState, useRef, useEffect } from "react";
import { getLayers } from "./getLayers";
import { Loader } from "../Loader/Loader";
import { motion } from "framer-motion";
import { Token, Layer } from "../../data/global";
import SecondaryButton from "../DollEditor/SecondaryButton";
import { saveAs } from 'file-saver';

// import fs from 'fs';

export default function Render(props: {
  onImageLoad: any; token: Token | any; download?: boolean; dollyId?: any; 
}) {
  const [done, doneSet] = useState(false);

  // loading animation
  const variants = {
    open: { opacity: 1, transition: { duration: 0 } },
    closed: { opacity: 0, transition: { duration: 0.4 } },
  };

  const canvasRef = useRef(document.createElement("canvas")); // create a canvas for typescript
  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

  const width = 600;
  const height = 600;

  // Onload and whenever token changes -> rerender image
  useEffect(() => {
    doneSet(false);
    loadImage();
  }, [props.token]);

  function getCanvas(width: number, height: number): any {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    return [canvas, context];
  }

  async function loadImage() {
    const layers = await getLayers(props.token);
    // console.log("Render > layers:", layers);
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

    //unequip All fix - clear canvas context before each render
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    
    // let checkedLayers: any = await checkLayers(layers);
    // draw(ctx, checkedLayers);

    draw(ctx, layers);
  }

  function imageExists(pathObj: any){
    return new Promise(async resolve => {
      let fileExists = false;
      if(pathObj.hasOwnProperty('pattern')) {
        let pattern: any = await isImageFound(pathObj.pattern);
        let srcImg: any = await isImageFound(pathObj.src);

        if(pattern && srcImg) {
          fileExists = true;
        } else {
          console.log('image not found: ', pathObj.src);
        }
      } else {
        let srcImg: any = await isImageFound(pathObj.src);
        if(srcImg) {
          fileExists = true;
        } else {
          console.log('image not found: ', pathObj.src);
        }
      }

      resolve(fileExists)

    })
  }

  function checkLayers(layers: any) {
    return new Promise(async resolve => {
      let newLayers = [];

      for (let i = 0; i < layers.length; i++) {
        let fileExists = await imageExists(layers[i]);
        if(fileExists) {
          newLayers.push(layers[i]);
        }
        
      }

      resolve(newLayers);
    })
  }

  function isImageFound(imageName: any) {
    return new Promise(async resolve => {
      // let fileExists = true;
      let res = fetch(`http://localhost:3000${imageName}`).then(response => {
        if(response.status !== 200) {
          // console.log('hi');
        }
        return response;
      }).catch((error) => {
        console.log(error)
        return false;
      });

      let result = !res? false: true;

      resolve(result);
    })
  }

  function draw(ctx: CanvasRenderingContext2D | null, layers: Layer[]): void {
    const imgs: any = [];
    let loaded = 0;

    for (let i = 0; i < layers.length; i++) {

      (async () => {
        // load image data
        const img = new Image();
        // Prevent error: "The canvas has been tainted by cross-origin data."
        // img.crossOrigin = "use-credentials";
        // img.crossOrigin = "Anonymous";
        // img.crossOrigin = "";
        // img.crossOrigin = "*";
        img.src = layers[i].src!;

        // built in promise, wait until loaded
        let isError = await img.decode().catch((encodingError) => {
          // console.log("Error:", encodingError);
          return true;
        });

        // let loadedImg = await loadLocalImage(img);
        if(isError) {
          // console.log('image not found: ', img.src);
          doneSet(true);
          return;
        }

        // create virtual canvas
        const [canvas, context] = getCanvas(width, height);

        // draw image on canvas
        context!.drawImage(img, 0, 0);

        // get image data to be able to manipulate colors
        const imgData = context!.getImageData(0, 0, width, height);

        // only runs if layer has a custom color
        if (layers[i].hasOwnProperty("color")) {
          // loop through all pixels and change color
          for (let j = 0; j < imgData.data.length; j += 4) {
            imgData.data[j] = layers[i].color!.r;
            imgData.data[j + 1] = layers[i].color!.g;
            imgData.data[j + 2] = layers[i].color!.b;
          }
        }

        // if there is a pattern, take the color values from the pattern and write them onto the layer
        if (layers[i].hasOwnProperty("pattern")) {
          // create virtual canvas
          const [patternCanvas, patternContext] = getCanvas(width, height);

          // load pattern image
          const patternImg = new Image();
          patternImg.src = layers[i].pattern!;
          await patternImg.decode().catch((encodingError) => {
            console.log("Error:", encodingError);
          });

          // draw pattern
          patternContext!.drawImage(patternImg, 0, 0);

          // get pattern data
          const patternData = patternContext!.getImageData(0, 0, width, height);

          // copy rgb values from pattern onto the original layer, while keeping alpha value intact (masking)
          for (let j = 0; j < imgData.data.length; j += 4) {
            imgData.data[j] = patternData.data[j];
            imgData.data[j + 1] = patternData.data[j + 1];
            imgData.data[j + 2] = patternData.data[j + 2];
          }
        }

        // draw the image data back onto the canvas
        context!.putImageData(imgData, 0, 0);

        // convert virtual canvas to image format so it can be layered onto the final canvas
        const canvasDataImg = canvas.toDataURL("image/png");
        const newImg = new Image();
        newImg.src = canvasDataImg;

        // await newImg.decode()
        await newImg.decode().catch((encodingError) => {
          console.log("Error:", encodingError);
        });
        // add image layer to render list
        imgs[i] = newImg;
        loaded++;

        if (loaded >= layers.length) {
          // console.log("finished loading");
          for (let j = 0; j < layers.length; j++) {
            ctx!.drawImage(imgs[j], 0, 0);
          }
          // when done, change state to disable loading animation
          doneSet(true);
        }
      })();
    }
  }

  function download() {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
  
    // Create a new window or tab
    const imageWindow = window.open('', '_blank');
    
    // Check if the new window was successfully created
    if (imageWindow) {
      // Write HTML content that displays the image
      imageWindow.document.write(`<html><head><title>Download Dolly</title></head><body><img src="${dataURL}" alt="Dolly Image" style="max-width: 100%; height: auto;"></body></html>`);
      // Optional: Include instructions for downloading
      imageWindow.document.title = "Right-click or long-press to save the image";
    } else {
      // Handle cases where the new window could not be opened
      alert('Unable to open the image in a new tab. Please check your popup settings.');
    }
  }
  


  useEffect(() => {
    // Call the callback function when the image is rendered
    if (done) {
      const dataURL = canvasRef.current.toDataURL("image/png");
      props.onImageLoad?.(dataURL);
    }
  }, [done, props]);

  function urlContentToDataUri(url: any) {
    return  fetch(url)
              .then(response => response.blob())
              .then(blob => new Promise(callback => {
                let reader = new FileReader();

                reader.onload = function() { 
                  callback(this.result) 
                };
                reader.readAsDataURL(blob);
              }));
  }

  

  async function downloadHD() {
    let dataUri: any = await urlContentToDataUri(`https://hunnyscloset.s3.us-east-2.amazonaws.com/dollys/${props.dollyId}.png`) ;
    const link = document.createElement("a");
    link.href = dataUri; // TODO: Add AWS LINK TO DOLLY HERE
    link.download =`Dolly#${props.dollyId}.png`; // Specify the filename for the downloaded image
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
      <canvas
        height={height}
        width={width}
        className="relative z-10 rounded-lg aspect-square w-full"
        ref={canvasRef}
      ></canvas>
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

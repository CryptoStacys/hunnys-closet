import fabricLib from 'fabric';
import crypto from 'crypto';
const fabric = fabricLib.fabric;
const loadCounter = {}; // This will keep track of our load attempts
fabric.Object.prototype.objectCaching = false;
// const fabric = require("fabric").fabric;

const FabricService = {
    createImage: function (loadedImages) {
        return new Promise(async resolve => {
            let canvas = new fabric.Canvas("canvas");
            canvas.setWidth(800);
            canvas.setHeight(800);

            for (let i = 0; i < loadedImages.length; i++) {
                canvas = await FabricService.addImageToCanvas(loadedImages[i], canvas);
            }

            let base64 = canvas.toDataURL({ format: "png" });
            let base64Data = base64.replace(/^data:image\/png;base64,/, "");

            canvas.remove(...canvas.getObjects());
            canvas.renderAll();

            canvas = null;

            resolve(base64Data);
        })
    },
    addImageToCanvas: function (path, canvas) {
        return new Promise(async resolve => {
            let img;
            if (path.hasOwnProperty('base64')) {
                img = await FabricService.loadImage(path.base64);
            } else {
                img = await FabricService.loadFilterdImage(path);
            }

            canvas.add(img);
            canvas.renderAll();

            img = null;

            resolve(canvas);
        })
    },
    loadFilterdImage: function (data) {
        return new Promise(async resolve => {
            let images = await FabricService.getMaskImages(data);

            let srcClone = await FabricService.createCloneImg(images.srcImg);

            let maskFilter = new fabric.Image.filters.BlendImage({
                image: images.maskImg,
                mode: 'mask'
            });

            srcClone.filters.push(maskFilter)
            srcClone.applyFilters();

            resolve(srcClone);
        })
    },
    getMaskImages: function (data) {
        return new Promise(async resolve => {
            // Color image
            let srcImg = await FabricService.loadImage(data.srcImg);

            // Mask Image
            let maskImg = await FabricService.loadImage(data.maskImg);

            resolve({ srcImg, maskImg });
        })
    },
    createCloneImg: function (srcImg) {
        return new Promise(resolve => {
            srcImg.clone(function (imgClone) {
                resolve(imgClone);
            })
        })
    },
    loadImage: function (path) {
        return new Promise((resolve, reject) => {
            // Create a hash of the path
            const hash = crypto.createHash('sha256').update(path).digest('hex');
            // Or, if using crypto-js or another library:
            // const hash = sha256(path).toString();

            // Increment our counter each time this path's hash is attempted
            if (!loadCounter[hash]) {
                loadCounter[hash] = 1;
            } else {
                loadCounter[hash]++;
            }

            new fabric.Image.fromURL(path, function (oImg) {
                if (oImg.getElement() == null) {
                    reject(new Error(`Failed to load image with hash: ${hash}`));
                } else {
                    resolve(oImg);
                }
            });
        });
    }
   


};

export default FabricService;
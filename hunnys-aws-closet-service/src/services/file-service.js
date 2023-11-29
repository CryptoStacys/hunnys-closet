// let ApiService = require('./api-service.js');
// let LayerService = require('./layer-service.js');
// let FabricService = require('./fabric-service.js');
// const fs = require("fs");

import ApiService from "./api-service.js";
import LayerService from "./layer-service.js";
import FabricService from "./fabric-service.js";
import fs from "fs";

import path from 'path';
import { fileURLToPath } from 'url';

const FileService = {
    createFiles: function (cloneData) {
        console.log("Starting createFiles...");
        return new Promise(async function (resolve) {
            await FileService.createImageFile(cloneData);
            await FileService.createMetadataFile(cloneData);
            console.log("Finished createFiles for token_id:", cloneData.token_id);
            resolve('Success');
        })
    },
    createImageFile: function (cloneData) {
        console.log("Starting createImageFile for token_id:", cloneData.token_id);
        return new Promise(async function (resolve) {
            let layers = LayerService.createLayers(cloneData.attributes);
            let loadedImages = await ApiService.loadAllImages(layers);
            let newImageBaseString = await FabricService.createImage(loadedImages);

            await FileService.saveImage(cloneData.token_id, newImageBaseString);

            console.log('Image created id: ', cloneData.token_id);
            
            resolve();
        })
    },
    createMetadataFile: function (cloneData) {
        console.log("Starting createMetadataFile for token_id:", cloneData.token_id);
        return new Promise(async function (resolve) {
            let attributes = [];

            for (let i = 0; i < cloneData.attributes.length; i++) {
                attributes.push({
                    trait_type: cloneData.attributes[i].attribute,
                    value: cloneData.attributes[i].name
                });
            }

            let result = {
                name: 'Hunnys Dollys #' + cloneData.token_id,
                description: 'Hunnys Dollys',
                image: 'https://hunnys.s3.us-east-2.amazonaws.com/dollys/' + cloneData.token_id + '.png',
                attributes: attributes
            }

            await FileService.saveMetadata(cloneData.token_id, result);
            console.log('Metadata created for token_id: ', cloneData.token_id);

            resolve();
        })
    },
    saveImage: function (id, baseString) {
        console.log("Starting saveImage for id:", id);
        
        return new Promise(function (resolve) {
            fs.writeFile('data/img/' + id + '.png', baseString, "base64", function () {
                console.log('Image saved id:', id);
                resolve();
            });
        })
    },
    saveMetadata: function (id, item) {
        console.log("Starting saveMetadata for id:", id);

        const __filename = fileURLToPath(import.meta.url);
        console.log("Current directory:", __filename);

        return new Promise(function (resolve) {
            fs.writeFile('data/metadata/' + id, JSON.stringify(item), {}, function () {
                console.log('Metadata saved id:', id);
                resolve();
            });
        })
    },
};

export default FileService;
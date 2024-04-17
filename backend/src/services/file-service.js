import ApiService from "./api-service.js";
import LayerService from "./layer-service.js";
import FabricService from "./fabric-service.js";
import fs from "fs/promises"; // Use promise-based fs module

const FileService = {
    async createFiles(cloneData) {
        console.log("Starting createFiles...");
        try {
            await this.createImageFile(cloneData);
            await this.createMetadataFile(cloneData);
            console.log("Finished createFiles for token_id:", cloneData.token_id);
            return 'Success';
        } catch (error) {
            console.error("Error in createFiles:", error);
            throw error;  // Ensure errors are not swallowed
        }
    },

    async createImageFile(cloneData) {
        console.log("Starting createImageFile for token_id:", cloneData.token_id);
        try {
            const layers = LayerService.createLayers(cloneData.attributes);
            const loadedImages = await ApiService.loadAllImages(layers);
            const newImageBaseString = await FabricService.createImage(loadedImages);

            await this.saveImage(cloneData.token_id, newImageBaseString);
            console.log('Image created id: ', cloneData.token_id);
        } catch (error) {
            console.error("Error in createImageFile:", error);
            throw error;
        }
    },

    async createMetadataFile(cloneData) {
        console.log("Starting createMetadataFile for token_id:", cloneData.token_id);
        try {
            const attributes = cloneData.attributes.map(attr => ({
                trait_type: attr.attribute,
                value: attr.name
            }));
    
            const result = {
                name: cloneData.name || `Hunnys Dollys #${cloneData.token_id}`, // Use the custom name or default to the existing format
                description: 'Hunnys Dollys',
                image: `https://hunnyscloset.s3.us-east-2.amazonaws.com/dollys/${cloneData.token_id}.png`,
                attributes
            };
    
            await this.saveMetadata(cloneData.token_id, result);
            console.log('Metadata created for token_id: ', cloneData.token_id);
        } catch (error) {
            console.error("Error in createMetadataFile:", error);
            throw error;
        }
    },
    

    async saveImage(id, baseString) {
        console.log("Starting saveImage for id:", id);
        try {
            await fs.writeFile(`data/img/${id}.png`, baseString, "base64");
            console.log('Image saved id:', id);
        } catch (error) {
            console.error("Error saving image:", error);
            throw error;
        }
    },

    async saveMetadata(id, item) {
        console.log("Starting saveMetadata for id:", id);
        try {
            await fs.writeFile(`data/metadata/${id}`, JSON.stringify(item));
            console.log('Metadata saved id:', id);
        } catch (error) {
            console.error("Error saving metadata:", error);
            throw error;
        }
    }
};

export default FileService;

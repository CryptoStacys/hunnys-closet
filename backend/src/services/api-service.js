import fetch from 'node-fetch';

const ApiService = {
    async getDataById(tokenId) {
        try {
            const response = await fetch(
                `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/getCloneData?tokenIds[]=${tokenId}`,
                { method: 'GET' }
            );
            return await response.json();
        } catch (err) {
            console.error('Error fetching data by ID:', err);
            throw err;
        }
    },

    async loadAllImages(layers) {
        try {
            const promises = layers.map((layer, i) => 
                layer.hasOwnProperty('pattern') ? 
                this.loadMaskLayers(i, layer) : 
                this.loadImage(i, layer.src)
            );
            
            const results = await Promise.all(promises);
            return results.filter(layer => 
                (layer.base64 && layer.base64 !== '') ||
                (layer.srcImg !== '' && layer.maskImg !== '')
            );
        } catch (err) {
            console.error('Error loading all images:', err);
            throw err;
        }
    },

    async loadMaskLayers(id, obj) {
        try {
            const [srcImg, maskImg] = await Promise.all([
                this.loadImage(id, obj.pattern),
                this.loadImage(id, obj.src)
            ]);
            return { id, srcImg: srcImg.base64, maskImg: maskImg.base64 };
        } catch (err) {
            console.error('Error loading mask layers:', err);
            throw err;
        }
    },

    async loadImage(id, path) {
        try {
            const img = await this.getImageData(path);
            return { id, base64: img };
        } catch (err) {
            console.error('Error loading image:', err);
            throw err;
        }
    },

    async getImageData(path) {
        try {
            const response = await fetch(
                `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/getImage?path=${path}`,
                { method: 'GET' }
            );
            return await response.json();
        } catch (err) {
            console.error('Error getting image data:', err);
            throw err;
        }
    },

    async getMetaData(path, tokenId) {
        try {
            const response = await fetch(path, { method: 'GET' });
            const json = await response.json();
            return { id: tokenId, data: json };
        } catch (err) {
            console.error('Error getting metadata:', err);
            throw err;
        }
    },

    async getMetaDataAsText(path, tokenId) {
        try {
            const response = await fetch(path);
            const text = await response.text();
            return { id: tokenId, data: text };
        } catch (err) {
            console.error('Error getting metadata as text:', err);
            throw err;
        }
    },

    async saveChangedToken(newToken) {
        try {
            const formData = new URLSearchParams({
                key: "auSZ873hsa2kasOsD27u",
                token_id: newToken.token_id.toString(),
                data: JSON.stringify({
                    token: newToken.attributes,
                    name: ''  // TODO: naming the token
                })
            });

            const response = await fetch(
                `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/saveToken`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            return await response.json();
        } catch (err) {
            console.error('Error saving changed token:', err);
            throw err;
        }
    }
};

export default ApiService;

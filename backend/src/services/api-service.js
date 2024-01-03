import fetch from 'node-fetch';

const ApiService = {
    getDataById: function (tokenId) {
        return new Promise(function (resolve) {
            fetch(`https://closetapi.hunnysnft.com/wordpress/wp-json/hunnys-closet/v1/getCloneData?tokenIds[]=${tokenId}`, { method: 'GET' })
                .then(response => resolve(response.json()))
                .catch(err => console.error(err));
            // let testData = '{"token_id":12,"data":[{"tokenId":"141","name":"LimeGreen","attribute":"Background","rarity":"common","baseColor":["green"],"colorsAmount":0,"colorsApplied":[],"tags":[],"parts":[]},{"tokenId":"141","name":"Alien","attribute":"Skin","rarity":"rare","baseColor":[],"colorsAmount":0,"colorsApplied":[],"tags":[],"parts":[]},{"tokenId":"141","name":"Gentle","attribute":"Eyebrows","rarity":"common","baseColor":[],"colorsAmount":0,"colorsApplied":[],"tags":[],"parts":[]},{"tokenId":"6002","name":"BabyBunny","attribute":"Hat","rarity":"rare","baseColor":[],"colorsAmount":1,"colorsApplied":["RedOrange3"],"tags":[],"parts":[]},{"tokenId":"141","name":"DiamondEyes","attribute":"Eyes","rarity":"relic","baseColor":[],"colorsAmount":0,"colorsApplied":[],"tags":[],"parts":[]},{"tokenId":"141","name":"ClubMakeup","attribute":"Face Sticker","rarity":"rare","baseColor":[],"colorsAmount":0,"colorsApplied":[],"tags":[],"parts":[]},{"tokenId":"141","name":"Empty","attribute":"Piercing","rarity":"common","baseColor":[],"colorsAmount":0,"colorsApplied":[],"tags":[],"parts":[]},{"tokenId":"141","name":"Tongue","attribute":"Mouth","rarity":"common","baseColor":[],"colorsAmount":1,"colorsApplied":["White"],"tags":[],"parts":[]},{"tokenId":"141","name":"SharpBob","attribute":"Hair Style","rarity":"uncommon","baseColor":[],"colorsAmount":1,"colorsApplied":["White"],"tags":["noEarring"],"parts":2},{"tokenId":"141","name":"DiamondDropPendant","attribute":"Accessory","rarity":"relic","baseColor":[],"colorsAmount":1,"colorsApplied":["Grey4"],"tags":[],"parts":[]},{"tokenId":"141","name":"CuteApron","attribute":"Outfit","rarity":"rare","baseColor":[],"colorsAmount":2,"colorsApplied":["Grey1","Grey4"],"tags":[],"parts":[]}]}';
            // resolve(JSON.parse(testData));
        })
    },
    loadAllImages: function (layers) {
        return new Promise(async resolve => {
            let promises = [];
      
            for (let i = 0; i < layers.length; i++) {
              if (!layers[i].hasOwnProperty('pattern')) {
            //   if (typeof layers[i] === 'string') {
                // promises.push(ApiService.loadImage(i, layers[i]));
                promises.push(ApiService.loadImage(i, layers[i].src));
              } else {    
                promises.push(ApiService.loadMaskLayers(i, layers[i]));
              }
            }
      
            let result = await Promise.all(promises);

            // filter empty images out
            let filteredLayers = [];
            for (let i = 0; i < result.length; i++) {
                if(result[i].hasOwnProperty('base64')) {
                    if(result[i].base64 !== '') {
                        filteredLayers.push(result[i]);
                    }
                } else {
                    if(result[i].srcImg !== '' && result[i].maskImg !== '') {
                        filteredLayers.push(result[i]);
                    }
                }

            }

            // resolve(result);
            resolve(filteredLayers);
          })
    },
    loadMaskLayers: function (id, obj) {
        return new Promise(async resolve => {
    
            let srcImg = await ApiService.loadImage(id, obj.pattern);
            let maskImg = await ApiService.loadImage(id, obj.src);
            // let maskImg = await ApiService.loadImage(id, obj.pattern);

            resolve({ id: id, srcImg: srcImg.base64, maskImg: maskImg.base64 })
        })
    },
    loadImage: function (id, path) {
        return new Promise(async resolve => {
            let img = await ApiService.getImageData(path);

            resolve({ id: id, base64: img});
        })
    },
    getImageData: function (path) {
        return new Promise(function (resolve) {
            fetch(`https://closetapi.hunnysnft.com/wordpress/wp-json/hunnys-closet/v1/getImage?path=${path}`, { method: 'GET' })
                .then(response => resolve(response.json()))
                .catch(err => console.error(err));
        })
    },
    getMetaData: function (path, tokenId) {
        return new Promise(function (resolve) {
            fetch(path, { method: 'GET' })
                .then(response => response.json())
                .then(json => resolve({id: tokenId, data: json}))
                .catch(err => console.error(err));
        })
    },
    getMetaDataAsText: function (path, tokenId) {
        return new Promise(function (resolve, reject) {
          fetch(path)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.text();
            })
            .then(text => {
              try {
                // Replace unescaped newlines with properly escaped ones
                const correctedText = text.replace(/\n/g, "\\n");
                const json = JSON.parse(correctedText);
                resolve({ id: tokenId, data: json });
              } catch (error) {
                reject(`Error parsing JSON for token ID ${tokenId}: ${error}`);
              }
            })
            .catch(err => reject(`Error fetching metadata for token ID ${tokenId}: ${err}`));
        })
      },
    saveChangedToken: function (newToken) {
        return new Promise(function (resolve) {
            let formData = new URLSearchParams();

            formData.append("key", "auSZ873hsa2kasOsD27u");
            formData.append("token_id", newToken.token_id.toString());
            formData.append("data", JSON.stringify({
                token: newToken.attributes,
                name: '', // TODO naming the token
            }));

            fetch(`https://closetapi.hunnysnft.com/wordpress/wp-json/hunnys-closet/v1/saveToken`, {
                method: "post",
                body: formData,
              })
                .then(response => response.json())
                .then(json => resolve(json))
                .catch(err => console.error(err));
        })
    }

};


export default ApiService;
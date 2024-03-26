import fs from "fs"; 
import ApiService from './api-service.js';

const TokenService = {
    loadConfig: function (path) {
        return new Promise(function (resolve) {
            fs.readFile(path, 'utf8', function (err, file) {
                resolve(JSON.parse(file));
              });
        })
    },
    getAllCollectionsData: function (collections) {
        return new Promise(async function (resolve) {
            let result = [];

            for (let i = 0; i < collections.length; i++) {
                let data = await TokenService.getCollectionData(collections[i]);
                result.push(data);
            }

            resolve(result);
        })

    },
    getCollectionData: function (collection) {
        return new Promise(async function (resolve) {
            let result = [];
            let configTokenData = await TokenService.loadConfig(`src/configs/${collection.config.tokenConfigPath}`);
            let configTraitsData = await TokenService.loadConfig(`src/configs/${collection.config.traitsConfigPath}`);
            let collectionConfig = await TokenService.loadConfig(`src/configs/collections-config.json`);
            let defaultConfigTraitsData = await TokenService.loadConfig(`src/configs/${collectionConfig.defaultTraitsConfigPath}`);

            collection.tokens = await TokenService.arregateTokenData(collection.config, collection.tokens);

            switch (collection.config.originID) {
                case 1:
                    //   "name": "Hunnys 10k",
                    result = TokenService.getSelectiveTraits(collection.config, collection.tokens, configTokenData, configTraitsData, defaultConfigTraitsData);
                    break;
                case 2:
                    //  "name": "Hunnys OG",
                    result = TokenService.getAllTraits(collection.config, collection.tokens, configTokenData, configTraitsData);
                    break;
                case 3:
                    //    "name": "Hunnys Seasonal",
                    result = TokenService.getSelectiveTraits(collection.config, collection.tokens, configTokenData, configTraitsData, defaultConfigTraitsData);
                    break;
                case 5:
                    // "name": "Hunnys Stacys",
                    result = TokenService.getAllTraits(collection.config, collection.tokens, configTokenData, configTraitsData);
                    break;
                case 6:
                    //   "name": "Hunnys 10k All Holders",
                    result = TokenService.getAllTraits(collection.config, collection.tokens, configTokenData, configTraitsData);
                    break;
                case 7:
                    //  "name": "Old Hunnys Closet Shop",
                    result = TokenService.getSelectiveTraits(collection.config, collection.tokens, configTokenData, configTraitsData, defaultConfigTraitsData);
                    break;
                case 8:
                    //   "name": "Fame Lady Society",
                    result = TokenService.getAllTraits(collection.config, collection.tokens, configTokenData, configTraitsData);
                    break;
                case 9:
                    //  "name": "New Hunnys Closet Shop",
                    result = TokenService.getSelectiveTraits(collection.config, collection.tokens, configTokenData, configTraitsData, defaultConfigTraitsData);
                    break;
                case 10:
                    //   "name": "MetaVixens",
                    result = TokenService.getAllTraits(collection.config, collection.tokens, configTokenData, configTraitsData);
                    break;
                default:
                    break;
            }

            resolve(result);
        })

    },
    getSelectiveTraits: function (config, data, configTokenData, configTraitsData, defaultConfigTraitsData) {
        let result = {
            tokens: [],
            traits: [],
            colors: []
        };
    
        // Counter for Hunnys tokens
        let hunnysCount = 0;

        for (let i = 0; i < data.length; i++) {
            let tokenId = config.idMapping ? data[i].id : parseInt(data[i].id);
            let tokenMatch = configTokenData.find((ele) => { return ele.tokenId === tokenId });

            // match found
            if(tokenMatch) {

                // add to tokens
                result.tokens.push({
                    token_id: tokenMatch.tokenId,
                    origin_id: config.originID,
                    origin_name: config.name,
                    img_url: data[i].img_url,
                    attributes: tokenMatch.attributes
                });

                // add traits 
                for (let k = 0; k < tokenMatch.attributes.length; k++) {
                    // if trait is Dye don't add it as trait only add the color
                    if(tokenMatch.attributes[k].trait_type === 'Dye') {     
                        result.colors.push(tokenMatch.attributes[k].value);
                    } else {  // add the whole trait                                            

                        let layerTraits = configTraitsData.attributes.find((ele) => { return ele.name === tokenMatch.attributes[k].trait_type });

                        if(layerTraits === undefined) continue;

                        let defaultLayerTraits = defaultConfigTraitsData.attributes.find((ele) => { return ele.name === tokenMatch.attributes[k].trait_type });
                        let defaultTraitMatch = defaultLayerTraits.traits.find((ele) => { return ele.name === tokenMatch.attributes[k].value });
                        
                        if(defaultTraitMatch) continue;

                        try {
                            let traitMatch = layerTraits.traits.find((ele) => { return ele.name === tokenMatch.attributes[k].value });
            
                            if (!traitMatch) {
                                console.warn(`No trait match found for attribute: ${tokenMatch.attributes[k].value} in OriginID: ${config.originID}`);
                                continue;  // Skip to next iteration
                            }

                        if (!traitMatch) {
                            console.warn(`No trait match found for attribute: ${tokenMatch.attributes[k].value}`);
                            continue;  // This will skip the current iteration and proceed to the next one
                        }
    
                        result.traits.push({
                            name: tokenMatch.attributes[k].value,
                            attribute: tokenMatch.attributes[k].trait_type,
                            origin_id: config.originID,
                            origin_name: config.name,
                            colors: traitMatch.colors || 0,
                            colorsApplied: [],
                            rarity: traitMatch.rarity || "common",
                            parts: traitMatch.parts || 0,
                            tags: traitMatch.tags || [],
                            token_id: traitMatch.token_id || "none"
                        });
    
                        if((tokenMatch.attributes[k].colors || []).length > 0) {
                            for (let j = 0; j < tokenMatch.attributes[k].colors.length; j++) {
                                result.colors.push(tokenMatch.attributes[k].colors[j]);
                                
                            }
                        }
                    } catch (error) {
                        console.error(`Error processing trait for token ID ${tokenId}: ${error}`);
                    }
                }
                
            }
            
        }
        
    }

return result;
},
    getAllTraits: function (config, data, configTokenData, configTraitsData) {
        let result = {
            tokens: [],
            traits: [],
            colors: []
        }

        if(data.length > 0) {
            // add tokens
            for (let i = 0; i < data.length; i++) {
                let tokenId = config.idMapping ? data[i].id : parseInt(data[i].id);
                let tokenMatch = configTokenData.find((ele) => { return ele.tokenId === tokenId });
    
                if(tokenMatch) {
                    result.tokens.push({
                        token_id: tokenMatch.tokenId,
                        origin_id: config.originID,
                        origin_name: config.name,
                        img_url: data[i].img_url,
                        attributes: tokenMatch.attributes
                    });
                }
            }

            // add traits
            for (let k = 0; k < configTraitsData.attributes.length; k++) {
                for (let o = 0; o < configTraitsData.attributes[k].traits.length; o++) {
                    if(configTraitsData.attributes[k].name === 'Dye') {
                        result.colors.push(configTraitsData.attributes[k].traits[o].name);
                    } else {
                        result.traits.push({
                            name: configTraitsData.attributes[k].traits[o].name,
                            attribute: configTraitsData.attributes[k].name,
                            origin_id: config.originID,
                            origin_name: config.name,
                            colors: configTraitsData.attributes[k].traits[o].colors || 0,
                            colorsApplied: [],
                            rarity: configTraitsData.attributes[k].traits[o].rarity || "common",
                            parts: configTraitsData.attributes[k].traits[o].parts || 0,
                            tags: configTraitsData.attributes[k].traits[o].tags || [],
                            token_id: configTraitsData.attributes[k].traits[o].token_id || "none"
                        });
                    }
                }
                
            }
        }

        return result;
    },
    getDefaultData: function (collectionConfig) {
        return new Promise(async function (resolve) {
            let configTraitsData = await TokenService.loadConfig(`src/configs/${collectionConfig.defaultTraitsConfigPath}`);

            let result = {
                tokens: [],
                traits: [],
                colors: []
            };

            for (let k = 0; k < configTraitsData.attributes.length; k++) {
                for (let o = 0; o < configTraitsData.attributes[k].traits.length; o++) {
                    if(configTraitsData.attributes[k].name === 'Dye') {
                        result.colors.push(configTraitsData.attributes[k].traits[o].name);
                    } else {
                        result.traits.push({
                            name: configTraitsData.attributes[k].traits[o].name,
                            attribute: configTraitsData.attributes[k].name,
                            origin_id: 0,
                            origin_name: 'default',
                            colors: configTraitsData.attributes[k].traits[o].colors || 0,
                            colorsApplied: [],
                            rarity: configTraitsData.attributes[k].traits[o].rarity || "common",
                            parts: configTraitsData.attributes[k].traits[o].parts || 0,
                            tags: configTraitsData.attributes[k].traits[o].tags || [],
                            token_id: configTraitsData.attributes[k].traits[o].token_id || "none"
                        });
                    }
                }
                
            }

            resolve(result);
        })
    },
    mapTokenIds: function (tokens, config) {
        return new Promise(async function (resolve) {
            let promises = [];
            
            for (let i = 0; i < tokens.length; i++) {
                let dataReq;

                if(config.hasStaticMetaPath) {
                   dataReq = ApiService.getMetaData(`${config.meta_url}${tokens[i].id}`, tokens[i].id); 
                } else {
                    let formattedUrl = TokenService.formatDynamicMetaUrl(tokens[i].tokenUrl);
                    dataReq = ApiService.getMetaDataAsText(`${formattedUrl}`, tokens[i].id);
                }
                promises.push(dataReq);
            }

            let data = await Promise.all(promises);
            data = TokenService.filterMappedMeta(config, data);

            for (let l = 0; l < tokens.length; l++) {
                const match = data.find((ele) => { return ele.id === tokens[l].id });
                
                tokens[l].id = match.mappedId;
            }
            
            resolve(tokens);
        })
    },
    arregateResponse: function (collectionData, dollys) {
        let result = {
            dollys: [],
            tokens: [],
            traits: [],
            colors: [],
            skin_colors: [],
            rewardStatus: ""  // Add this line to initialize rewardStatus
        };
        
        // dollys
        for (let m = 0; m < dollys.length; m++) {
            result.dollys.push(dollys[m][0]);
        }
    
        for (let i = 0; i < collectionData.length; i++) {
    
            // tokens
            for (let j = 0; j < collectionData[i].tokens.length; j++) {
                result.tokens.push(collectionData[i].tokens[j]);
            }
    
            // traits
            for (let k = 0; k < collectionData[i].traits.length; k++) {
                result.traits.push(collectionData[i].traits[k]);
    
                if(collectionData[i].traits[k].attribute === 'Skin') {
                    result.skin_colors.push(collectionData[i].traits[k].name);
                }
            }
    
            // colors
            for (let o = 0; o < collectionData[i].colors.length; o++) {
                result.colors.push(collectionData[i].colors[o]);
            }
        }
    
        result.colors = [...new Set(result.colors)];
    
        // Determine Hunnys count
        let hunnysCount = result.tokens.filter(token => token.origin_id === 1).length;
    
        // Determine Reward Status based on hunnysCount
        if (hunnysCount >= 12) {
            result.rewardStatus = "Royal Bunny";
        } else if (hunnysCount >= 7) {
            result.rewardStatus = "Bunny Duke";
        } else if (hunnysCount >= 3) {
            result.rewardStatus = "Bunny Knight";
        } else if (hunnysCount >= 1) {
            result.rewardStatus = "Bunny";
        } else if (hunnysCount <= 0) {
            result.rewardStatus = "None";
        }
    
        return result;
    },
    arregateTraitResponse: function (collectionData) {
            let result = {
                traits: [],
                colors: [],
                skin_colors: []
            };
            

            for (let i = 0; i < collectionData.length; i++) {

                // triats
                for (let k = 0; k < collectionData[i].traits.length; k++) {
                    result.traits.push(collectionData[i].traits[k]);

                    if(collectionData[i].traits[k].attribute === 'Skin') {
                        result.skin_colors.push(collectionData[i].traits[k].name);
                    }
                }

                // colors
                for (let o = 0; o < collectionData[i].colors.length; o++) {
                    result.colors.push(collectionData[i].colors[o]);
                }
            }

            result.colors = [...new Set(result.colors)];

            return result;
    },
    getStaticImageUrl: function (tokens, config) {
        return new Promise(async function (resolve) {
            let result = [];
            let promises = [];

            for (let i = 0; i < tokens.length; i++) {
                let tokenCopy = !config.hasStaticMetaPath ? tokens[i] : { id: tokens[i] };
                result.push(tokenCopy);
                promises.push(ApiService.getMetaData(`${config.meta_url}${tokenCopy.id}`, tokenCopy.id));
            }
            
            result = await Promise.all(promises);

            for (let l = 0; l < result.length; l++) {
                const match = result.find((ele) => { return ele.id === result[l].id });
                result[l].img_url = match.data.image;
            }

            resolve(result);
        })
            
    },
    getDynamicImageUrl: function (tokens) {
        return new Promise(async function (resolve) {
            let promises = [];

            for (let i = 0; i < tokens.length; i++) {
                let formattedUrl = TokenService.formatDynamicMetaUrl(tokens[i].tokenUrl);
                let dataReq = ApiService.getMetaDataAsText(`${formattedUrl}`, tokens[i].id);
                promises.push(dataReq);
            }

            let data = await Promise.all(promises);
            data = TokenService.filterImageData(data)

            for (let l = 0; l < tokens.length; l++) {
                const match = data.find((ele) => { return ele.id === tokens[l].id });
                tokens[l].img_url = match.data;
                
            }

            resolve(tokens);
        })
    },
    formatDynamicMetaUrl: function(path) {
        let formattedUrl = path;
        if(path.includes('ipfs://')) {
            formattedUrl = path.replace("ipfs://", "https://rarity.mypinata.cloud/ipfs/");
        } else if(path.includes('/ipfs/')) {
            formattedUrl = path.split("/ipfs/").pop();
            formattedUrl = "https://rarity.mypinata.cloud/ipfs/" + formattedUrl;
        }

        return formattedUrl;
    },
    filterImageData: function(tokens) {
        for (let i = 0; i < tokens.length; i++) {
            let url = tokens[i].data;
            if(tokens[i].data.includes('"image"')){
                url = tokens[i].data.split('"image":"').pop().split('",')[0]; 
            }

            tokens[i].data = url;
        }

        return tokens;
    },
    filterMappedMeta: function(config, tokens) {
        for (let i = 0; i < tokens.length; i++) {
            let mappedId;
            if(config.hasStaticMetaPath){
                mappedId = tokens[i].data.original_token_id;
            } else {
                mappedId = tokens[i].data.split('"original_token_id":"').pop().split('",')[0];
            }

            tokens[i].mappedId = mappedId;
        }

        return tokens;
    },
    arregateTokenData: function(config, tokens) {
        return new Promise(async function (resolve) {
            let result = [];

            if(config.hasStaticMetaPath) {
                result = await TokenService.getStaticImageUrl(tokens, config)
            } else {
                result = await TokenService.getDynamicImageUrl(tokens)
            }

            if(config.idMapping) {
                result = await TokenService.mapTokenIds(result, config);
            }

            resolve(result);
        })
    },

    /// get all trait functions
    getAllData: function (collections) {
        return new Promise(async function (resolve) {
            let result = [];

            for (let i = 0; i < collections.length; i++) {
                let data = await TokenService.getAllCollectionData(collections[i]);
                result.push(data);
            }

            resolve(result);
        })

    },
    getAllCollectionData: function (collection) {
        return new Promise(async function (resolve) {
            let result = [];
            let configTokenData = await TokenService.loadConfig(`src/configs/${collection.tokenConfigPath}`);
            let configTraitsData = await TokenService.loadConfig(`src/configs/${collection.traitsConfigPath}`);

            switch (collection.originID) {
                case 1:
                    //   "name": "Hunnys 10k",
                    result = TokenService.getTraits(collection, configTraitsData);

                    for (let i = 0; i < configTokenData.length; i++) {
                        for (let k = 0; k < configTokenData[i].attributes.length; k++) {
                            if(configTokenData[i].attributes[k].colors.length > 0) {

                                for (let m = 0; m < configTokenData[i].attributes[k].colors.length; m++) {
                                    result.colors.push(configTokenData[i].attributes[k].colors[m]);
                                    
                                }
                            }

                            
                        }
                        
                    }

                    break;
                case 2:
                    //  "name": "Hunnys OG",
                    result = TokenService.getTraits(collection, configTraitsData);
                    break;
                case 3:
                    //    "name": "Hunnys Seasonal",
                    result = TokenService.getTraits(collection, configTraitsData);
                    break;
                case 5:
                    // "name": "Hunnys Stacys",
                    result = TokenService.getTraits(collection, configTraitsData);
                    break;
                case 6:
                    //   "name": "Hunnys 10k All Holders",
                    result = TokenService.getTraits(collection, configTraitsData);
                    break;
                case 7:
                    //  "name": "Hunnys Closet Shop",
                    result = TokenService.getTraits(collection, configTraitsData);
                    break;
                case 8:
                    //  "name": "Fame Lady Society",
                    result = TokenService.getTraits(collection, configTraitsData);
                    break;
                case 9:
                    //  "name": "New Hunnys Closet Shop",
                    result = TokenService.getTraits(collection, configTraitsData);
                    break;
                case 10:
                    //  "name": "MetaVixens",
                    result = TokenService.getTraits(collection, configTraitsData);
                    break;
                default:
                    break;
            }

            resolve(result);
        })

    },
    getTraits: function (config, configTraitsData) {
        let result = {
            traits: [],
            colors: []
        }

        // add traits
        for (let k = 0; k < configTraitsData.attributes.length; k++) {
            for (let o = 0; o < configTraitsData.attributes[k].traits.length; o++) {
                if(configTraitsData.attributes[k].name === 'Dye') {
                    result.colors.push(configTraitsData.attributes[k].traits[o].name);
                } else {
                    result.traits.push({
                        name: configTraitsData.attributes[k].traits[o].name,
                        attribute: configTraitsData.attributes[k].name,
                        origin_id: config.originID,
                        origin_name: config.name,
                        colors: configTraitsData.attributes[k].traits[o].colors || 0,
                        colorsApplied: [],
                        rarity: configTraitsData.attributes[k].traits[o].rarity || "common",
                        parts: configTraitsData.attributes[k].traits[o].parts || 0,
                        tags: configTraitsData.attributes[k].traits[o].tags || [],
                        token_id: configTraitsData.attributes[k].traits[o].token_id || "none"
                    });
                }
            }
            
        }

        return result;
    },


};

export default TokenService;
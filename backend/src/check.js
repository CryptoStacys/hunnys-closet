import CheckDollysService from './services/check-dollys-service.js';
import ContractService from './services/contract-service.js';
import FileService from './services/file-service.js';
import AwsService from './services/aws-service.js';
import TokenService from './services/token-service.js';
import ApiService from './services/api-service.js';

const CheckController = {
    checkDollys: function () {
        return new Promise(async (resolve) => {
            try {
            // Stacy Keys
            let infuraObj = { 
                polygon: "https://polygon-mainnet.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac",
                mainnet: "https://mainnet.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac",
                goerli: "https://goerli.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac"
            };
         //     Rat Account A Keys
         //  let infuraObj = { 
         //       polygon: "https://polygon-mainnet.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac",
         //       mainnet: "https://mainnet.infura.io/v3/5239f83d36634330bd900f94158cf76e",
         //       goerli: "https://goerli.infura.io/v3/5239f83d36634330bd900f94158cf76e"
         //   };
         //     Rat Account B Keys
         //  let infuraObj = { 
         //       polygon: "https://polygon-mainnet.infura.io/v3/c6a0213e06df4189bbb84a64086a38ae",
         //       mainnet: "https://mainnet.infura.io/v3/c6a0213e06df4189bbb84a64086a38ae",
         //       goerli: "https://goerli.infura.io/v3/c6a0213e06df4189bbb84a64086a38ae"
         //   };

            let tokensWithOwner = await CheckDollysService.getTokensWithOwner(infuraObj);
            let dollysData = await CheckDollysService.getDollysData(tokensWithOwner);

            await CheckController.validateTokens(tokensWithOwner, dollysData, infuraObj);

            resolve();
        } catch (error) {
            console.error(`Error in checkDollys function: ${error.message}`);
            throw error;
        }
        })
    },
    validateTokens: function (tokensWithOwner, dollysData, infuraObj) {
        return new Promise(async (resolve) => {
            try {
            
            // loop through each owner
            for (let i = 0; i < tokensWithOwner.length; i++) {
                // get all owned tokens for that owner
                let ownedTokens = await ContractService.getOwnedTokens(tokensWithOwner[i].owner, infuraObj);

                // loop through each tokenId from that owner
                for (let j = 0; j < tokensWithOwner[i].ids.length; j++) {
                    let checkedToken = {
                        gotChanged: false,
                        newToken: {}
                    };

                    // try to find saved php data to that id
                    let matchedMetaData = dollysData.find((ele)=> { return parseInt(ele.id) === parseInt(tokensWithOwner[i].ids[j]) });

                    if(matchedMetaData && matchedMetaData.token[0].attributes !== '') {
                        //  if we got saved php api data check that with currently owned traits
                        checkedToken = CheckController.checkOwnedTokenTraits(matchedMetaData.token[0], ownedTokens);
                    } else {
                        // if no php api data is saved create empty dolly to that dollyId
                        checkedToken.gotChanged = true;
                        checkedToken.newToken = await CheckController.createEmptyDolly(tokensWithOwner[i].ids[j]);
                    }

                    if(checkedToken.gotChanged) {
                        // create new files if token got changed
                        let filesCreated = await FileService.createFiles(checkedToken.newToken);

                        if(filesCreated === 'Success') {
                            // upload to aws and save new token on php api
                            await AwsService.updateFiles([checkedToken.newToken.token_id]);

                            await ApiService.saveChangedToken(checkedToken.newToken);
                        }
                    }
                }
            }

            resolve();
        } catch (error) {
            console.error(`Error in validateTokens function: ${error.message}`);
            throw error;
        }
        })
    },
    checkOwnedTokenTraits: function(matchedMetaData, ownedTokens) {
        try {
        let result = {
            gotChanged: false,
            newToken: {}
        };

        for (let i = 0; i < (matchedMetaData.attributes || []).length; i++) {

            // dont check empty traits
            if(matchedMetaData.attributes[i].name !== 'Empty') {
                let traitMatch = ownedTokens.traits.find((ele) => { return ((ele.name === matchedMetaData.attributes[i].name) && (ele.attribute === matchedMetaData.attributes[i].attribute) && (ele.origin_id === matchedMetaData.attributes[i].origin_id))})
                
                if(!traitMatch){
                    result.gotChanged = true;

                    let emptyTrait = ownedTokens.traits.find((ele) => { return ((ele.name === 'Empty') && (ele.attribute === matchedMetaData.attributes[i].attribute) && (ele.origin_id === 0))})
                    matchedMetaData.attributes[i] = emptyTrait;
                }
            } 
        }

        result.newToken = matchedMetaData;

        return result;
    } catch (error) {
        console.error(`Error in checkOwnedTokenTraits function: ${error.message}`);
        throw error;
    }
    },
    createEmptyDolly: function (tokenId) {
        return new Promise(async (resolve) => {
            try {
            let result = {
                token_id: tokenId,
                attributes: []
            };

            let collectionConfig = await TokenService.loadConfig(`src/configs/collections-config.json`);
            let defaultTraitsData = await TokenService.loadConfig(`src/configs/${collectionConfig.defaultTraitsConfigPath}`);
            let rightLayerOrder = collectionConfig.layer_order.sort((a,b) => a.layerId - b.layerId);

            for (let i = 0; i < rightLayerOrder.length; i++) {
                switch (rightLayerOrder[i].name) {
                    case "Skin":
                        let defaultSkinTraits = defaultTraitsData.attributes.find((ele) => { return ele.name === rightLayerOrder[i].name});
                        let skinTrait = defaultSkinTraits.traits.find((ele) => { return ele.name === 'Basic Strawberry Whipped Cream'});
                        skinTrait.attribute = rightLayerOrder[i].name;
                        result.attributes.push(skinTrait);
                        break;
                    case "Eyes":
                        let defaultEyeTraits = defaultTraitsData.attributes.find((ele) => { return ele.name === rightLayerOrder[i].name});
                        let eyeTrait = defaultEyeTraits.traits.find((ele) => { return ele.name === 'Almond'});
                        eyeTrait.attribute = rightLayerOrder[i].name;
                        eyeTrait.colorsApplied = ["HunnysPurple1"];
                        result.attributes.push(eyeTrait);
                        break;
                    case "Mouth":
                        let defaultMouthTraits = defaultTraitsData.attributes.find((ele) => { return ele.name === rightLayerOrder[i].name});
                        let mouthTrait = defaultMouthTraits.traits.find((ele) => { return ele.name === 'Pout'});
                        mouthTrait.attribute = rightLayerOrder[i].name;
                        mouthTrait.colorsApplied = ["HunnysPurple1"];
                        result.attributes.push(mouthTrait);
                        break;
                    case "Undergarment":
                        let defaultUnderTraits = defaultTraitsData.attributes.find((ele) => { return ele.name === rightLayerOrder[i].name});
                        let underTrait = defaultUnderTraits.traits.find((ele) => { return ele.name === 'Frilly Bra'});
                        underTrait.attribute = rightLayerOrder[i].name;
                        underTrait.colorsApplied = ["HunnysPurple1"];
                        result.attributes.push(underTrait);
                        break;
                
                    default:
                        let defaultAttributeTraits = defaultTraitsData.attributes.find((ele) => { return ele.name === rightLayerOrder[i].name});
                        let emptyTrait = defaultAttributeTraits.traits.find((ele) => { return ele.name === 'Empty'});
                        emptyTrait.attribute = rightLayerOrder[i].name;
                        result.attributes.push(emptyTrait);
                        break;
                }


                // if(rightLayerOrder[i].name !== "Skin") {
                //     let defaultAttributeTraits = defaultTraitsData.attributes.find((ele) => { return ele.name === rightLayerOrder[i].name});
                //     let emptyTrait = defaultAttributeTraits.traits.find((ele) => { return ele.name === 'Empty'});
                //     emptyTrait.attribute = rightLayerOrder[i].name;
                //     result.attributes.push(emptyTrait);
                // }
            }

            resolve(result);
        } catch (error) {
            console.error(`Error in createEmptyDolly function: ${error.message}`);
            throw error;
        }
        })
    },

};

export default CheckController;
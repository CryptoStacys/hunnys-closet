import ChainService from './chain-service.js';
import CloneService from './clone-service.js';
import TokenService from './token-service.js';


const ContractService = {
    getAllTraitData: function () {
        return new Promise(async function (resolve) {
            let collectionConfig = await TokenService.loadConfig(`src/configs/collections-config.json`);
            // collection Data
            let allCollectionData = await TokenService.getAllData(collectionConfig.collections);

            // default Data
            let defaultData = await TokenService.getDefaultData(collectionConfig);
            allCollectionData.push(defaultData);

            let result = TokenService.arregateTraitResponse(allCollectionData);

            resolve(result);
        })
    },
    getOwnedTokens: function (wallet, infuraObj) {
        return new Promise(async function (resolve) {
            let collectionConfig = await TokenService.loadConfig(`src/configs/collections-config.json`);
            console.log("Collection Config:", collectionConfig); // Debugging
            // collection Data
            let allTokens = await ContractService.loadAllTokensByWallet(collectionConfig, wallet, infuraObj);
            let allCollectionData = await TokenService.getAllCollectionsData(allTokens);
    
            // default Data
            let defaultData = await TokenService.getDefaultData(collectionConfig);
            allCollectionData.push(defaultData);
    
            // dolly data
            let dollysData = await ContractService.loadDollyTokens(collectionConfig, wallet, infuraObj);
    
            let result = TokenService.arregateResponse(allCollectionData, dollysData);
    
            resolve(result);
        })
    },
    loadAllTokensByWallet: function (collectionConfig, wallet, infuraObj) {
        return new Promise(async resolve => {
            console.log("Collection Config:", collectionConfig); // Debugging
            console.log("Collections Array:", collectionConfig.collections); // Debugging
    
            let promises = [];
      
            for (let i = 0; i < collectionConfig.collections.length; i++) {
                promises.push(ChainService.getCollectionTokens(collectionConfig.collections[i], wallet, infuraObj));
            }
      
            let result = await Promise.all(promises);
      
            resolve(result);
        })
    },
    loadDollyTokens: function (collectionConfig, wallet, infuraObj) {
        return new Promise(async resolve => {
            // wallet = '0x8BcE73136814D9592432DbA70F5E3BF7Fd9023F8';
            let abi = await ChainService.loadAbi(`src/abis/hunnys-dollys-abi.json`);
            let ids = await ChainService.requestContract(collectionConfig.dollysContract, wallet, abi, infuraObj.mainnet);
            // let ids = await ChainService.requestContract(collectionConfig.dollysContract, wallet, abi, infuraObj.goerli);
            let data = await CloneService.getCloneData(ids); 
      
            resolve(data);
        })
    },

};

export default ContractService;
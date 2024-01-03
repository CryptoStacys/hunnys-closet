import Web3 from "web3";
import fs from "fs";
import TokenService from './token-service.js';


const ChainService = {
    getCollectionTokens: function (config, wallet, infuraObj) {
        return new Promise(async function (resolve) {
            let tokens = [];
            let abi;
             // Casa Keys
            let infuraUrl = config.chain === "polygon" ? infuraObj.polygon : infuraObj.mainnet;
            // let infuraUrl = config.chain === "polygon" ? "https://polygon-mainnet.infura.io/v3/ca9e3d59483343c2b41780ea1c4aaa5f" : "https://mainnet.infura.io/v3/ca9e3d59483343c2b41780ea1c4aaa5f";

            switch (config.originID) {
                case 1:
                 //   "name": "Hunnys 10k",
                    abi = await ChainService.loadAbi(`src/abis/hunnys-10k-abi.json`);
                    tokens = await ChainService.requestContract(config.contract, wallet, abi, infuraUrl);
                    break;
                case 2:
                //  "name": "Hunnys OG",
                    abi = await ChainService.loadAbi(`src/abis/hunnys-ogs-abi.json`);
                    tokens = await ChainService.requestContract(config.contract, wallet, abi, infuraUrl);
                    break;
                case 3:
                //    "name": "Hunnys Seasonal",
                    abi = await ChainService.loadAbi(`src/abis/hunnys-seasons-abi.json`);
                    tokens = await ChainService.requestSeasonsContract(config.contract, wallet, abi, infuraUrl);
                    tokens = await ChainService.arregateMetaPathToToken(tokens, config);
                    break;
                case 5:
                    // "name": "Hunnys Stacys",
                    abi = await ChainService.loadAbi(`src/abis/hunnys-stacys-abi.json`);
                    tokens = await ChainService.requestContract(config.contract, wallet, abi, infuraUrl);
                    break;
                case 6:
                //   "name": "Hunnys 10k All Holders",
                    abi = await ChainService.loadAbi(`src/abis/hunnys-10k-all-holders-abi.json`);
                    tokens = await ChainService.requestContract(config.contract, wallet, abi, infuraUrl);
                    break;
                case 8:
                //  "name": "Fame Lady Society",
                    abi = await ChainService.loadAbi(`src/abis/fame-lady-society-abi.json`);
                    tokens = await ChainService.requestContract(config.contract, wallet, abi, infuraUrl, config.originID);
                    break;
                case 9:
                //  "name": "Hunnys Closet Shop",
                    abi = await ChainService.loadAbi(`src/abis/new-hunnys-closet-shop-abi.json`);
                    tokens = await ChainService.requestSeasonsContract(config.contract, wallet, abi, infuraUrl);
                    tokens = await ChainService.arregateMetaPathToToken(tokens, config);
                    break;
                default:
                    break;
            }

            resolve({
                config,
                tokens
            });
        })
    },
    loadAbi: function (path) {
        return new Promise(function (resolve) {
            fs.readFile(path, 'utf8', function (err, file) {
                resolve(JSON.parse(file));
            });
        })
    },
    requestContract: function (contractAddr, wallet, abi, infuraUrl, originID) {
        return new Promise(async resolve => {
            let web3 = new Web3(infuraUrl);
            let contract = new web3.eth.Contract(abi, contractAddr);
            let tokens;
    
            if (originID === 8) { // 8 is the originID for Fame Lady Society
                let balance = await contract.methods.balanceOf(wallet).call();
                tokens = balance > 0 ? [1] : [];
            } else {
                tokens = await contract.methods.tokensOfOwner(wallet).call();
            }
    
            resolve(tokens);
        })
    },
        
    requestSeasonsContract: function (contractAddr, wallet, abi, infuraUrl) {
        return new Promise(async resolve => {
            let tempResult = [];
            let result = [];
            let walletArray = [];
            let ids = [];

            let web3 = new Web3(infuraUrl);
            let contract = new web3.eth.Contract(abi, contractAddr);

            for (let i = 0; i < 200; i++) {
                walletArray.push(wallet);
                ids.push(i);
            }

            let tokens = await contract.methods.balanceOfBatch(walletArray, ids).call();

            for (let i = 0; i < tokens.length; i++) {
                if (parseInt(tokens[i]) > 0) {
                    tempResult.push(i);
                }
            }

            // let urlPromises = [];
            // for (let i = 0; i < tempResult.length; i++) {
            //     urlPromises.push(ChainService.getTokenUrl(contract, tempResult[i]));
                
            // }

            // result = await Promise.all(urlPromises);

            resolve(tempResult);
        })
    },
    getTokenUrl: function (contract, id) {
        return new Promise(async resolve => {
            let data = await contract.methods.uri(id).call();
            resolve({
                id,
                tokenUrl: data
            });
        });
    },
    arregateMetaPathToToken: function(tokens, config){
        return new Promise(async resolve => {
            let result = [];
            let tokenData = await TokenService.loadConfig(`src/configs/${config.tokenConfigPath}`);

            for (let i = 0; i < tokens.length; i++) {
                let match = tokenData.find((ele) => { return ele.tokenId === tokens[i]});
                if(match) {
                    result.push({
                        id: tokens[i],
                        tokenUrl: match.metaPath
                    });
                }
            }

            resolve(result);
        })
    }

};

export default ChainService;
import Web3 from "web3";
import fs from "fs";
import TokenService from './token-service.js';

const ChainService = {
    // Load ABI from a file
    loadAbi: function (path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, file) => {
                if (err) reject(err);
                else resolve(JSON.parse(file));
            });
        });
    },

    // Request tokens owned by a wallet for a given contract
    requestContract: function (contractAddr, wallet, abi, infuraUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                const web3 = new Web3(infuraUrl);
                const contract = new web3.eth.Contract(abi, contractAddr);
                const tokens = await contract.methods.tokensOfOwner(wallet).call();
                resolve(tokens);
            } catch (error) {
                reject(error);
            }
        });
    },

    // Request tokens for contracts that use balanceOfBatch (e.g., seasons contracts)
    requestSeasonsContract: function (contractAddr, wallet, abi, infuraUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                let tempResult = [];
                let walletArray = [];
                let ids = [];

                const web3 = new Web3(infuraUrl);
                const contract = new web3.eth.Contract(abi, contractAddr);

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

                resolve(tempResult);
            } catch (error) {
                reject(error);
            }
        });
    },

    // Get URL for a specific token
    getTokenUrl: function (contract, id) {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await contract.methods.uri(id).call();
                resolve({
                    id,
                    tokenUrl: data
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    // Request tokens for shop-like contracts
    requestShopContract: function (contractAddr, wallet, abi, infuraUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = [];

                const web3 = new Web3(infuraUrl);
                const contract = new web3.eth.Contract(abi, contractAddr);

                let tokens = await contract.methods.tokensOfOwner(wallet).call();

                let urlPromises = tokens.map(tokenId => this.getTokenUrl(contract, tokenId));
                result = await Promise.all(urlPromises);

                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    },

    // Aggregate metadata path to tokens
    arregateMetaPathToToken: function(tokens, config){
        return new Promise(async (resolve, reject) => {
            try {
                let result = [];
                console.log(`CHAINSERVICE 102 Loading token data from: src/configs/${config.tokenConfigPath}`);
                let tokenData = await TokenService.loadConfig(`src/configs/${config.tokenConfigPath}`);

                for (let i = 0; i < tokens.length; i++) {
                    let match = tokenData.find((ele) => ele.tokenId === tokens[i]);
                    if(match) {
                        result.push({
                            id: tokens[i],
                            tokenUrl: match.metaPath
                        });
                    }
                }

                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    },

    // Unified method to get all tokens owned by a wallet from multiple contracts
    getCollectionTokens: async function (configDirPath, wallet, infuraObj) {
        let tokens = new Set();
        try {
            const contractConfigs = await TokenService.loadConfig(configDirPath);
            console.log("Contract Configs:", contractConfigs, "Is Array:", Array.isArray(contractConfigs)); // Debugging
            for (const config of contractConfigs) {
                const infuraUrl = config.chain === "polygon" ? infuraObj.polygon : infuraObj.mainnet;
                const abi = await this.loadAbi(`src/abis/${config.abiFile}`);
                let contractTokens = [];

                if (config.type === 'seasons') {
                    contractTokens = await this.requestSeasonsContract(config.contract, wallet, abi, infuraUrl);
                } else if (config.type === 'shop') {
                    contractTokens = await this.requestShopContract(config.contract, wallet, abi, infuraUrl);
                } else {
                    contractTokens = await this.requestContract(config.contract, wallet, abi, infuraUrl);
                }

                contractTokens.forEach(token => tokens.add(token));
            }
        } catch (error) {
            console.error("Error in getCollectionTokens: ", error);
        }
        return Array.from(tokens);
    }
};

export default ChainService;

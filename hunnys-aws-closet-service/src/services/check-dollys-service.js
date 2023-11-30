import Web3 from "web3";
import ChainService from './chain-service.js';
import TokenService from './token-service.js';
import ApiService from "./api-service.js";


const CheckDollysService = {
    getTokensWithOwner: function (infuraObj) {
        return new Promise(async function (resolve) {
            let collectionConfig = await TokenService.loadConfig(`src/configs/collections-config.json`);
            let abi = await ChainService.loadAbi(`src/abis/hunnys-dollys-abi.json`);

            // Stacys Keys
            let tokenIdsWithOwner = await CheckDollysService.requestContractTokensWithOwner(collectionConfig.dollysContract, abi, infuraObj.mainnet);
            // let tokenIdsWithOwner = await CheckDollysService.requestContractTokensWithOwner(collectionConfig.dollysContract, abi, "https://goerli.infura.io/v3/ca9e3d59483343c2b41780ea1c4aaa5f");
            
            let result = [];

            for (let i = 0; i < tokenIdsWithOwner.length; i++) {
                let resultMatchIndex = result.findIndex((ele)=> {return ele.owner === tokenIdsWithOwner[i].owner });
                if(resultMatchIndex !== -1) {
                    result[resultMatchIndex].ids.push(tokenIdsWithOwner[i].id);
                } else {
                    result.push({
                        owner: tokenIdsWithOwner[i].owner,
                        ids: [tokenIdsWithOwner[i].id]
                    });
                }
            }

            resolve(result);
        })
    },
    requestContractTokensWithOwner: function (contractAddr, abi, infuraUrl) {
        return new Promise(async resolve => {
            let result = [];
            let promises = [];
            let web3 = new Web3(infuraUrl);
            let contract = new web3.eth.Contract(abi, contractAddr);

            let totalSupply = await contract.methods.totalSupply().call(); 

            for (let i = 0; i < parseInt(totalSupply); i++) {
                promises.push(CheckDollysService.getOwnerById(contract, i));
            }

            result = await Promise.all(promises);

            resolve(result);
        })
    },
    getOwnerById: function (contract, id) {
        return new Promise(async resolve => {
            let owner = await contract.methods.ownerOf(id).call();
            resolve({
                id,
                owner
            });
        });
    },


    getDollysData: function (ownerWithIds) {
        return new Promise(async resolve => {
            let result = [];
            let promises = [];


            for (let i = 0; i < ownerWithIds.length; i++) {

                let count = 0;
                for (let j = 0; j < ownerWithIds[i].ids.length; j++) {
                    count = count + 1;
                    promises.push(CheckDollysService.requestDollyData(ownerWithIds[i].ids[j]));

                    if(count >= 10) {
                        let tempData = await Promise.all(promises);
                        result = result.concat(tempData);
                        count = 0;
                        promises = [];
                    } else if(j === ownerWithIds[i].ids.length -1) {
                        let tempData = await Promise.all(promises);
                        result = result.concat(tempData);
                        count = 0;
                        promises = [];
                    }
                }
            }

            // result = await Promise.all(promises);

            resolve(result);
        });
    },
    requestDollyData: function (id) {
        return new Promise(async resolve => {
            let token = await ApiService.getDataById(id);
            resolve({
                id: id,
                token: token
            });
        });
    },

};

export default CheckDollysService;
import ContractService from './services/contract-service.js';

const DollysController = {
    getData: function (wallet) {
        return new Promise(async (resolve) => {
            try {
            // Casa Keys
            // let infuraObj = { 
            //     polygon: "https://polygon-mainnet.infura.io/v3/ca9e3d59483343c2b41780ea1c4aaa5f",
            //     mainnet: "https://mainnet.infura.io/v3/ca9e3d59483343c2b41780ea1c4aaa5f",
            //     goerli: "https://goerli.infura.io/v3/ca9e3d59483343c2b41780ea1c4aaa5f"
            // };

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

            let infuraObj = { 
                polygon: "https://polygon-mainnet.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac",
                mainnet: "https://mainnet.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac",
                goerli: "https://goerli.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac"
            };

            let ownedTokens = await ContractService.getOwnedTokens(wallet, infuraObj);

            resolve(ownedTokens);
        } catch (error) {
            console.error(`Error in getData function: ${error.message}`);
            throw error;
        }
        })
    }

};

export default DollysController;
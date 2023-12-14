import ContractService from './services/contract-service.js';

const TraitController = {
    getTraits: function () {
        return new Promise(async (resolve) => {
            try {
            // Casa Keys
            // let infuraObj = { 
            //     polygon: "https://polygon-mainnet.infura.io/v3/ca9e3d59483343c2b41780ea1c4aaa5f",
            //     mainnet: "https://mainnet.infura.io/v3/ca9e3d59483343c2b41780ea1c4aaa5f",
            //     goerli: "https://goerli.infura.io/v3/ca9e3d59483343c2b41780ea1c4aaa5f"
            // };

            let allTraits = await ContractService.getAllTraitData();

            resolve(allTraits);

        } catch (error) {
            console.error(`Error in getTraits function: ${error.message}`);
            throw error;
        }
        })
    }

};

export default TraitController;
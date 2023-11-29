import ApiService from './api-service.js';

const CloneService = {
    getCloneData: async function (tokenIds) {
        const BATCH_SIZE = 100;  // Adjust this value based on what your server can handle
        const DELAY_BETWEEN_BATCHES = 1000;  // 500 milliseconds delay

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        let data = [];

        for (let i = 0; i < tokenIds.length; i += BATCH_SIZE) {
            const batch = tokenIds.slice(i, i + BATCH_SIZE);
            const promises = batch.map(tokenId => ApiService.getDataById(tokenId));
            const results = await Promise.allSettled(promises);

            // Extracting the successful values and adding them to the data array
            const successfulData = results
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);
            data = [...data, ...successfulData];

            // If there are more batches to process, sleep for a while
            if (i + BATCH_SIZE < tokenIds.length) {
                await sleep(DELAY_BETWEEN_BATCHES);
            }
        }

        return data;
    }
};

export default CloneService;

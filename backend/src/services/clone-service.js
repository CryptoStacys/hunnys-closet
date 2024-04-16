import ApiService from './api-service.js';

const CloneService = {
    getCloneData: async function (tokenIds) {
        const BATCH_SIZE = 150;  
        const DELAY_BETWEEN_BATCHES = 1000;  
        const RETRY_LIMIT = 3; // Number of retries

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        let data = [];
        let retries = new Map();

        for (let i = 0; i < tokenIds.length; i += BATCH_SIZE) {
            const batch = tokenIds.slice(i, i + BATCH_SIZE);
            let promises = batch.map(tokenId => ApiService.getDataById(tokenId));
            let results = await Promise.allSettled(promises);

            for (let j = 0; j < results.length; j++) {
                const result = results[j];
                if (result.status === 'fulfilled') {
                    data.push(result.value);
                } else {
                    const tokenId = batch[j];
                    const currentRetryCount = retries.get(tokenId) || 0;
                    if (currentRetryCount < RETRY_LIMIT) {
                        retries.set(tokenId, currentRetryCount + 1);
                        batch.push(tokenId); // Add failed token for retry
                    }
                }
            }

            if (i + BATCH_SIZE < tokenIds.length || retries.size > 0) {
                await sleep(DELAY_BETWEEN_BATCHES);
            }
        }

        return data;
    }
};

export default CloneService;


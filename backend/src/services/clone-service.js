import ApiService from './api-service.js';

const CloneService = {
    getCloneData: async function (tokenIds) {
        const BATCH_SIZE = 100;  
        const DELAY_BETWEEN_BATCHES = 200;  
        const RETRY_LIMIT = 3; // Number of retries

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        let data = [];
        let retries = new Map();

        console.log(`Starting to fetch data for ${tokenIds.length} tokens.`);

        for (let i = 0; i < tokenIds.length; i += BATCH_SIZE) {
            const batch = tokenIds.slice(i, i + BATCH_SIZE);
            console.log(`Processing batch from ${i} to ${i + batch.length - 1}, batch size: ${batch.length}`);

            let promises = batch.map(tokenId => ApiService.getDataById(tokenId));
            let results = await Promise.allSettled(promises);

            let batchFailures = 0;

            for (let j = 0; j < results.length; j++) {
                const result = results[j];
                if (result.status === 'fulfilled') {
                    data.push(result.value);
                } else {
                    const tokenId = batch[j];
                    const currentRetryCount = retries.get(tokenId) || 0;
                    retries.set(tokenId, currentRetryCount + 1);

                    if (currentRetryCount < RETRY_LIMIT) {
                        batch.push(tokenId); // Add failed token for retry
                        console.log(`Retrying token ${tokenId}, attempt ${currentRetryCount + 1}`);
                    } else {
                        console.log(`Failed to retrieve token ${tokenId} after ${RETRY_LIMIT} attempts.`);
                    }
                    batchFailures++;
                }
            }

            console.log(`Batch completed with ${batchFailures} failures.`);
            
            if (i + BATCH_SIZE < tokenIds.length || retries.size > 0) {
                await sleep(DELAY_BETWEEN_BATCHES);
            }
        }

        console.log(`Completed all batches. Successfully retrieved data for ${data.length} tokens.`);
        if (retries.size > 0) {
            console.log(`Failed to retrieve data for ${retries.size} tokens after retries.`);
        }

        return data;
    }
};

export default CloneService;

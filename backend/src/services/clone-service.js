import ApiService from './api-service.js';

const CloneService = {
    getCloneData: async function (tokenIds) {
        const BATCH_SIZE = 40;  // Reduced batch size
        const DELAY_BETWEEN_BATCHES = 200;  
        const RETRY_LIMIT = 3;

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        let data = [];
        let retries = new Map();

        console.log(`Starting to fetch data for ${tokenIds.length} tokens.`);

        for (let i = 0; i < tokenIds.length; i += BATCH_SIZE) {
            const batchIndices = i + BATCH_SIZE < tokenIds.length ? i + BATCH_SIZE : tokenIds.length;
            const batch = tokenIds.slice(i, batchIndices);
            console.log(`Processing batch from ${i} to ${batchIndices - 1}, batch size: ${batch.length}`);

            let promises = batch.map(tokenId => ApiService.getDataById(tokenId));
            let results = await Promise.allSettled(promises);

            for (let j = 0; j < results.length; j++) {
                const result = results[j];
                const tokenId = batch[j];
                if (result.status === 'fulfilled') {
                    data.push(result.value);
                } else if (result.reason && retries.get(tokenId) < RETRY_LIMIT) {
                    console.log(`Retrying token ${tokenId}, attempt ${retries.get(tokenId) + 1}`);
                    retries.set(tokenId, (retries.get(tokenId) || 0) + 1);
                    tokenIds.push(tokenId); // Add to the end of the list for retry
                } else {
                    console.log(`Failed to retrieve token ${tokenId} after maximum retries.`);
                }
            }

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

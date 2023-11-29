import CloneService from './services/clone-service.js';
import FileService from './services/file-service.js';
import AwsService from './services/aws-service.js';


const UpdateTokens = {
    update: function (tokenIds) {
        return new Promise(async (resolve) => {
            try {
            // get clone data
            let cloneData = await CloneService.getCloneData(tokenIds);
            let updateIds = [];
            
            for (let i = 0; i < cloneData.length; i++) {
                let filesCreated = await FileService.createFiles(cloneData[i][0]);

                if(filesCreated === 'Success') {
                    updateIds.push(cloneData[i][0].token_id);
                }
            }

            await AwsService.updateFiles(updateIds);

            console.log('Copied');

            resolve('Success');
        } catch (error) {
            console.error(`Error in update function: ${error.message}`);
            reject(error); // Rejecting the promise with the error for better error handling on the caller side
        }
        })
    }

};

export default UpdateTokens;
import awsCli from 'aws-cli-js';

const from = "data/";
const to = "s3://hunnyscloset/dollys/";
const fileType = '.png';
const cred = {
    "Credentials": {
        "AccessKeyId": "AKIAWFXRVD22QQIVJ4GO",
        "SecretAccessKey": "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"
    }
}

const Options = awsCli.Options;
const Aws = awsCli.Aws;

const options = new Options(
    /* accessKey    */ cred.Credentials.AccessKeyId,
    /* secretKey    */ cred.Credentials.SecretAccessKey
);

const aws = new Aws(options);

const AwsService = {
    updateFiles: function (ids) {
        console.log("Starting updateFiles...");
        return new Promise(async resolve => {
            let updateProms = [];
            
            for (let i = 0; i < ids.length; i++) {
                console.log("Updating files for id:", ids[i]);
                updateProms.push(AwsService.copyFile(`${from}metadata/${ids[i]}`, `${to}${ids[i]}`)); // Meta
                updateProms.push(AwsService.copyFile(`${from}img/${ids[i]}${fileType}`, `${to}${ids[i]}${fileType}`)); // Image
            }

            await Promise.all(updateProms);
            console.log("Finished updating all files.");
            resolve();
        })
    },
    copyFile: function (fromFilePath, toFilePath) {
        console.log(`Copying file from ${fromFilePath} to ${toFilePath}...`);
        return new Promise(resolve => {
            aws.command(`s3 cp ${fromFilePath} ${toFilePath} --acl public-read`).then(function (data) {
                console.log(`File copied successfully from ${fromFilePath} to ${toFilePath}`);
                resolve();
            }).catch(function(error){
                console.log(`Error copying file from ${fromFilePath} to ${toFilePath}:`, error);
            });
        })
    }

};

export default AwsService;

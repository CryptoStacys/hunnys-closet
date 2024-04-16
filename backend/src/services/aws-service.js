import awsCli from 'aws-cli-js';

const from = "data/";
const to = "s3://hunnyscloset/dollys/";
const fileType = '.png';
const cred = {
    "Credentials": {
        "AccessKeyId": "AKIAWFXRVD227KHSL6OU",
        "SecretAccessKey": "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"
    }
}

const Options = awsCli.Options;
const Aws = awsCli.Aws;
const options = new Options();
const aws = new Aws(options);

const AwsService = {
    async updateFiles(ids) {
        console.log("Starting updateFiles...");
        try {
            const updatePromises = ids.flatMap(id => [
                this.copyFile(`${from}metadata/${id}`, `${to}${id}`),
                this.copyFile(`${from}img/${id}${fileType}`, `${to}${id}${fileType}`)
            ]);

            await Promise.all(updatePromises);
            console.log("Finished updating all files.");
        } catch (error) {
            console.error("Error updating files:", error);
            throw error;
        }
    },

    async copyFile(fromFilePath, toFilePath) {
        console.log(`Copying file from ${fromFilePath} to ${toFilePath}...`);
        try {
            const result = await aws.command(`s3 cp ${fromFilePath} ${toFilePath} --acl public-read`);
            console.log(`File copied successfully from ${fromFilePath} to ${toFilePath}`);
            return result;
        } catch (error) {
            console.error(`Error copying file from ${fromFilePath} to ${toFilePath}:`, error);
            throw error;
        }
    }
};

export default AwsService;

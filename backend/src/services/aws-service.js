import awsCli from 'aws-cli-js';

const from = "data/";
const to = "s3://hunnyscloset/dollys/";
const fileType = '.png';

const Options = awsCli.Options;
const Aws = awsCli.Aws;

// Let's set our AWS credentials and region (if needed) here.
// You can enhance security by using AWS profiles and environment variables.
const options = new Options(
  process.env.AWS_ACCESS_KEY_ID,
  process.env.AWS_SECRET_ACCESS_KEY,
  process.env.AWS_DEFAULT_REGION,
);

const aws = new Aws(options);

const AwsService = {
    updateFiles: async function (ids) {
        console.log("Starting updateFiles...");
        let updateProms = ids.flatMap(id => [
          this.copyFile(`${from}metadata/${id}`, `${to}${id}`), // Meta
          this.copyFile(`${from}img/${id}${fileType}`, `${to}${id}${fileType}`), // Image
        ]);

        await Promise.all(updateProms);
        console.log("Finished updating all files.");
    },
    copyFile: function (fromFilePath, toFilePath) {
        console.log(`Copying file from ${fromFilePath} to ${toFilePath}...`);
        return aws.command(`s3 cp ${fromFilePath} ${toFilePath} --acl public-read`).then(function (data) {
            console.log(`File copied successfully from ${fromFilePath} to ${toFilePath}`);
        }).catch(function(error){
            console.log(`Error copying file from ${fromFilePath} to ${toFilePath}:`, error);
        });
    }
};

export default AwsService;
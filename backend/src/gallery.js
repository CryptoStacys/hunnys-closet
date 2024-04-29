import { config, S3 } from 'aws-sdk';

// Configure AWS SDK
config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'us-east-2',
});

const s3 = new S3();

async function getValidNFTs(bucketName, prefix) {
  const params = {
    Bucket: bucketName,
    Prefix: prefix,
  };

  try {
    const s3Data = await s3.listObjectsV2(params).promise();
    const objects = s3Data.Contents;

    // Filter out valid NFTs that have both image and metadata
    const validNFTs = objects.reduce((acc, current) => {
      const baseName = current.Key.replace(/(\.png)$/, '');
      if (acc[baseName]) {
        acc[baseName].push(current.Key);
      } else {
        acc[baseName] = [current.Key];
      }
      return acc;
    }, {});

    return Object.values(validNFTs).filter(nft => nft.length === 2);
  } catch (error) {
    console.error('Error fetching from S3:', error);
    return [];
  }
}

// Example usage
const bucketName = 'hunnyscloset.s3.us-east-2.amazonaws.com';
const prefix = 'dollys/';
getValidNFTs(bucketName, prefix).then(console.log);

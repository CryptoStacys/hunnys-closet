// pages/api/getPresignedUrl.js
import AWS from 'aws-sdk';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Extract UUID and fileName from request body
      const { uuid, fileName = 'Profile.png' } = req.body;
      const filePath = `accounts/${uuid}/${fileName}`;

      AWS.config.update({
        region: 'us-east-2',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });

      const s3 = new AWS.S3();
      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filePath,
        Expires: 60, // Adjust as per your requirement
        ACL: 'public-read',
      };

      const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);

      res.status(200).json({ url: uploadUrl, filePath });
    } catch (error) {
      console.error('Error generating S3 signed URL', error);
      res.status(500).json({ error: 'Error generating S3 signed URL' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
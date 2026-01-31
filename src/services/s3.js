const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

async function uploadPDFToS3(pdfBuffer, fileName) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `invoices/${fileName}`,
    Body: pdfBuffer,
    ContentType: 'application/pdf',
    ACL: 'public-read'
  };
  
  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
}

module.exports = { uploadPDFToS3 };
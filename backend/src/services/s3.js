const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

async function uploadPDFToS3(pdfBuffer, fileName) {
  const key = `invoices/${fileName}`;
  
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: pdfBuffer,
    ContentType: 'application/pdf'
  };
  
  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });
    
    const presignedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 * 24 * 7 });
    
    return presignedUrl;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
}

module.exports = { uploadPDFToS3 };
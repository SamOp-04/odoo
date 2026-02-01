const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
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

/**
 * Upload image to S3
 * @param {Buffer} imageBuffer - Image file buffer
 * @param {string} fileName - Original filename
 * @param {string} mimeType - Image mime type (image/jpeg, image/png, etc.)
 * @returns {Promise<string>} - S3 URL of uploaded image
 */
async function uploadImageToS3(imageBuffer, fileName, mimeType) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = fileName.split('.').pop();
  const key = `products/${timestamp}-${randomString}.${fileExtension}`;
  
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: imageBuffer,
    ContentType: mimeType
  };
  
  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    
    // Generate a presigned URL with maximum expiration (7 days - AWS limit)
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });
    
    const presignedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 604800 }); // 7 days (max allowed)
    
    return presignedUrl;
  } catch (error) {
    console.error('S3 image upload error:', error);
    throw error;
  }
}

/**
 * Upload multiple images to S3
 * @param {Array} images - Array of {buffer, fileName, mimeType}
 * @returns {Promise<Array<string>>} - Array of S3 URLs
 */
async function uploadMultipleImages(images) {
  try {
    const uploadPromises = images.map(image => 
      uploadImageToS3(image.buffer, image.fileName, image.mimeType)
    );
    
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Multiple images upload error:', error);
    throw error;
  }
}

/**
 * Delete image from S3
 * @param {string} imageUrl - Full S3 URL of the image
 * @returns {Promise<boolean>} - Success status
 */
async function deleteImageFromS3(imageUrl) {
  try {
    // Extract key from URL
    const urlParts = imageUrl.split('.com/');
    if (urlParts.length < 2) {
      throw new Error('Invalid S3 URL');
    }
    
    const key = urlParts[1];
    
    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: key
    };
    
    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);
    
    return true;
  } catch (error) {
    console.error('S3 image deletion error:', error);
    throw error;
  }
}

/**
 * Delete multiple images from S3
 * @param {Array<string>} imageUrls - Array of S3 URLs
 * @returns {Promise<boolean>} - Success status
 */
async function deleteMultipleImages(imageUrls) {
  try {
    const deletePromises = imageUrls.map(url => deleteImageFromS3(url));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error('Multiple images deletion error:', error);
    throw error;
  }
}

module.exports = { 
  uploadPDFToS3, 
  uploadImageToS3,
  uploadMultipleImages,
  deleteImageFromS3,
  deleteMultipleImages
};
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { parse } = require('querystring');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wedding_photos',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

const upload = multer({ storage: storage }).array('files');

exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        try {
            await new Promise((resolve, reject) => {
                upload(event, context, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Files uploaded successfully!' }),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error uploading files', error }),
            };
        }
    }
    return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
};

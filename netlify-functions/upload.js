const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { buffer } = require('micro');
const { Readable } = require('stream');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage }).array('files');

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        try {
            const bodyBuffer = await buffer(event);
            const files = JSON.parse(bodyBuffer.toString());

            const uploadPromises = files.map(file => {
                const stream = Readable.from(Buffer.from(file.content, 'base64'));
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: 'wedding_photos' },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    stream.pipe(uploadStream);
                });
            });

            const results = await Promise.all(uploadPromises);
            const urls = results.map(result => result.secure_url);

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Files uploaded successfully!', urls }),
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

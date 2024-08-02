const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async () => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'wedding_photos/',
            max_results: 100,
        });

        const images = result.resources.map(img => ({
            url: img.secure_url,
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(images),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error retrieving images', error }),
        };
    }
};

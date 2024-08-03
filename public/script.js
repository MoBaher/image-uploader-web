document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const files = document.getElementById('fileInput').files;
    const fileArray = Array.from(files).map(file => ({
        name: file.name,
        content: await fileToBase64(file),
    }));

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ files: fileArray }),
    });

    const result = await response.json();
    document.getElementById('message').textContent = result.message || 'Upload successful!';
    fetchImages();
});

async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

async function fetchImages() {
    const response = await fetch('/api/images');
    const images = await response.json();
    const gallery = document.getElementById('imageGallery');
    gallery.innerHTML = '';

    images.forEach(image => {
        const img = document.createElement('img');
        img.src = image.url;
        gallery.appendChild(img);
    });
}

// Load images on page load
fetchImages();

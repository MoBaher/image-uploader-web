document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const files = document.getElementById('fileInput').files;
    const formData = new FormData();

    for (const file of files) {
        formData.append('files', file);
    }

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    document.getElementById('message').textContent = result.message || 'Upload successful!';
    fetchImages();
});

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

document.addEventListener('DOMContentLoaded', function () {
    let images = JSON.parse(localStorage.getItem('images')) || [];
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    let carouselIndex = 0;

    function initCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        items[carouselIndex].style.display = 'block';
        setInterval(() => {
            items[carouselIndex].style.display = 'none';
            carouselIndex = (carouselIndex + 1) % items.length;
            items[carouselIndex].style.display = 'block';
        }, 3000);
    }

    function displayImages() {
        fileList.innerHTML = '';
        images.forEach((image, index) => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');
            fileItem.innerHTML = `
                <img class="file-name" src="${image.src}" alt="Image">
                <textarea ${image.description ? 'readonly' : ''} placeholder="Add description">${image.description || ''}</textarea>
                <div class="icons">
                    <span class="check-icon" ${image.description ? 'style="display:none;"' : ''}>✔️</span>
                    <span class="delete-icon">❌</span>
                </div>
            `;
            fileItem.querySelector('.check-icon').addEventListener('click', () => {
                const description = fileItem.querySelector('textarea').value;
                image.description = description;
                localStorage.setItem('images', JSON.stringify(images));
                alert('Description added');
                displayImages();
            });
            fileItem.querySelector('.delete-icon').addEventListener('click', () => {
                images.splice(index, 1);
                localStorage.setItem('images', JSON.stringify(images));
                displayImages();
            });
            fileList.appendChild(fileItem);
        });
    }

    function handleFiles(files) {
        if (images.length + files.length > 5) {
            alert('You can upload a maximum of 5 images');
            return;
        }
        for (const file of files) {
            if (file.type.startsWith('image/') && file.size <= 1024 * 1024) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    images.push({ src: event.target.result, description: '' });
                    localStorage.setItem('images', JSON.stringify(images));
                    displayImages();
                };
                reader.readAsDataURL(file);
            } else {
                alert('Only image files under 1 MB are allowed');
            }
        }
    }

    dropzone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropzone.classList.remove('drag-over');
        handleFiles(event.dataTransfer.files);
    });

    dropzone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });

    initCarousel();
    displayImages();
});

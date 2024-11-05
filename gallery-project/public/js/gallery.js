document.addEventListener('DOMContentLoaded', () => {
    loadGallery('album', 1);

    // 카테고리 버튼 클릭 이벤트
    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.getAttribute('data-category');
            loadGallery(category, 1);
        });
    });

    // 페이지네이션 클릭 이벤트
    document.querySelectorAll('.pagination span').forEach(page => {
        page.addEventListener('click', () => {
            document.querySelectorAll('.pagination span').forEach(span => span.classList.remove('active'));
            page.classList.add('active');
            const category = document.querySelector('.category-button.active').getAttribute('data-category');
            const pageNum = parseInt(page.textContent);
            loadGallery(category, pageNum);
        });
    });

    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    let galleryImages = [];

    async function loadGallery(category, page) {
        const response = await fetch(`/api/gallery?category=${category}&page=${page}`);
        const images = await response.json();

        const galleryContainer = document.querySelector('.thumbnail-gallery');
        galleryContainer.innerHTML = '';

        images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.classList.add('thumbnail');
            thumbnail.innerHTML = `<img src="${image.url}" alt="${image.title}"><p>${image.title}</p>`;
            galleryContainer.appendChild(thumbnail);

            thumbnail.querySelector('img').addEventListener('click', () => {
                modal.style.display = 'flex';
                modalImg.src = image.url;
                currentIndex = index;
                galleryImages = images;
            });
        });
    }

    // Close 버튼 클릭 시 모달 닫기
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 이전 이미지 보기
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        modalImg.src = galleryImages[currentIndex].url;
    });

    // 다음 이미지 보기
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        modalImg.src = galleryImages[currentIndex].url;
    });

    // 키보드 화살표로 네비게이션
    document.addEventListener('keydown', (event) => {
        if (modal.style.display === 'flex') {
            if (event.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
                modalImg.src = galleryImages[currentIndex].url;
            } else if (event.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % galleryImages.length;
                modalImg.src = galleryImages[currentIndex].url;
            } else if (event.key === 'Escape') {
                modal.style.display = 'none';
            }
        }
    });

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadGallery('album', 1); // 기본 카테고리 및 페이지 로드

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

    // 모달 관련 요소 초기화
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    let galleryImages = [];

    // API를 통해 갤러리 불러오기
    async function loadGallery(category, page) {
        const response = await fetch(`/api/gallery?category=${category}&page=${page}`);
        const images = await response.json();

        const galleryContainer = document.querySelector('.thumbnail-gallery');
        galleryContainer.innerHTML = ''; // 기존 이미지를 지움

        images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.classList.add('thumbnail');
            thumbnail.innerHTML = `<img src="${image.url}" alt="${image.title}"><p>${image.title}</p>`;
            galleryContainer.appendChild(thumbnail);

            // 이미지 클릭 시 모달 열기
            thumbnail.querySelector('img').addEventListener('click', () => {
                modal.style.display = 'flex';
                modalImg.src = image.url;
                currentIndex = index;
                galleryImages = images; // 현재 카테고리의 이미지를 갱신
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

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle'); // 리스트 아이콘
    const menu = document.querySelector('.menu'); // 메뉴 컨테이너

    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('open'); // 메뉴 활성화/비활성화
    });
});

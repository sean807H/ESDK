let player;
let isPlayerReady = false;
let initialVideoLoaded = false;
const initialVideoId = '4cIniILXP7I';
const initialVideoTitle = "[COVER] 도겸 - HAPPY (원곡 : DAY6)";

// 유튜브 IFrame API가 준비되면 초기화
function onYouTubeIframeAPIReady() {
    console.log("YouTube IFrame API가 준비되었습니다.");
    initializePlayer();
}

// 유튜브 플레이어 초기화 함수
function initializePlayer() {
    if (!player) {
        player = new YT.Player('main-video-player', {
            height: '400',
            width: '100%',
            videoId: sessionStorage.getItem('currentVideoId') || initialVideoId,
            events: {
                'onReady': onPlayerReady,
            }
        });
    }
}

// 플레이어가 준비되었을 때 호출되는 함수
function onPlayerReady() {
    console.log("플레이어가 준비되었습니다.");
    isPlayerReady = true;
    loadInitialVideo();
}

// 초기 동영상을 로드하는 함수
function loadInitialVideo() {
    if (isPlayerReady && !initialVideoLoaded) {
        const savedVideoId = sessionStorage.getItem('currentVideoId') || initialVideoId;
        const savedVideoTitle = sessionStorage.getItem('currentVideoTitle') || initialVideoTitle;
        player.cueVideoById(savedVideoId);
        document.querySelector('.main-video-title').textContent = savedVideoTitle;
        initialVideoLoaded = true;
    }
}

// 썸네일을 클릭하면 큰 화면의 동영상이 변경되지만, 자동 재생되지 않음
function loadVideo(videoId, title) {
    if (isPlayerReady) {
        player.cueVideoById(videoId);
        document.querySelector('.main-video-title').textContent = title;
        sessionStorage.setItem('currentVideoId', videoId);
        sessionStorage.setItem('currentVideoTitle', title);
    }
}

// API 준비 여부 확인 및 초기화 대기
function checkYouTubeAPI() {
    if (window.YT && YT.Player) {
        initializePlayer();
    } else {
        setTimeout(checkYouTubeAPI, 500); // 0.5초마다 API 준비 여부 확인
    }
}

// DOM 로드 후 설정
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOMContentLoaded 이벤트가 발생했습니다.");
    
    // API 스크립트가 로드되지 않은 경우 스크립트 동적 추가
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        checkYouTubeAPI();
    } else {
        initializePlayer();
    }

    // 썸네일 클릭 이벤트 설정
    document.querySelectorAll('.thumbnail').forEach(function (element) {
        element.addEventListener('click', function () {
            const videoId = element.getAttribute('data-video-id');
            const title = element.getAttribute('data-title');
            loadVideo(videoId, title);
        });
    });
});

// 페이지 네이션 기능
function showPage(pageNumber) {
    const itemsPerPage = 4;
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail, index) => {
        const pageIndex = Math.floor(index / itemsPerPage) + 1;
        thumbnail.style.display = (pageIndex === pageNumber) ? 'block' : 'none';
    });
}

// 초기 페이지 설정
showPage(1);

// 페이지네이션 활성화
document.querySelectorAll('.pagination span').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.pagination span').forEach(span => span.classList.remove('active'));
        item.classList.add('active');
    });
});

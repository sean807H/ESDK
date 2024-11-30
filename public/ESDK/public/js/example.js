let player;
let isPlayerReady = false;
let initialVideoLoaded = false;
const initialVideoId = '4cIniILXP7I';
const initialVideoTitle = "[COVER] 도겸 - HAPPY (원곡 : DAY6)";

// YouTube IFrame API가 준비되었을 때 호출되는 함수
function onYouTubeIframeAPIReady() {
    console.log("YouTube IFrame API가 준비되었습니다.");
    if (window.YT && YT.Player) {
        initializePlayer();
    } else {
        console.error("YT.Player가 정의되지 않았습니다. API 로딩 상태를 확인해주세요.");
    }
}

// 유튜브 플레이어 초기화 함수
function initializePlayer() {
    if (!window.YT || !window.YT.Player) {
        console.error("YT.Player is not available. Check if the YouTube IFrame API is loaded.");
        return;
    }

    if (!player) {
        player = new YT.Player('main-video-player', {
            height: '400',
            width: '100%',
            videoId: sessionStorage.getItem('currentVideoId') || initialVideoId,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
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

// 플레이어 상태가 변경될 때 호출되는 함수
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        console.log("비디오가 재생 중입니다.");
    } else if (event.data === YT.PlayerState.PAUSED) {
        console.log("비디오가 일시 정지되었습니다.");
    }
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

// 동영상을 로드하는 함수
function loadVideo(videoId, title) {
    console.log("Loading video:", videoId, title);
    if (isPlayerReady) {
        player.cueVideoById(videoId);
        document.querySelector('.main-video-title').textContent = title;
        sessionStorage.setItem('currentVideoId', videoId);
        sessionStorage.setItem('currentVideoTitle', title);
    } else {
        console.log("플레이어가 준비되지 않았습니다.");
    }
}

// DOM 로드 후 설정
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOMContentLoaded 이벤트가 발생했습니다.");
    
    // YouTube API가 로드되지 않았다면 스크립트를 동적으로 추가
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        console.log("YouTube API 스크립트가 로드되었습니다.");
    } else {
        console.log("YouTube API 이미 로드됨");
        initializePlayer();
    }

    // 썸네일 갤러리 클릭 이벤트 설정
    document.querySelector('#thumbnail-gallery').addEventListener('click', function (event) {
        const element = event.target.closest('.thumbnail');
        if (element) {
            const videoId = element.getAttribute('data-video-id');
            const title = element.getAttribute('data-title');
            loadVideo(videoId, title);
        }
    });

    // 썸네일 갤러리 터치 이벤트 설정 (모바일용)
    document.querySelector('#thumbnail-gallery').addEventListener('touchstart', function (event) {
        const element = event.target.closest('.thumbnail');
        if (element) {
            const videoId = element.getAttribute('data-video-id');
            const title = element.getAttribute('data-title');
            loadVideo(videoId, title);
        }
    }, { passive: true });
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

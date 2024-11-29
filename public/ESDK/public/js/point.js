let player;
let shortsPlayer;
let isPlayerReady = false;
let currentMainVideoIndex = 0;
let currentShortsPage = 0;

// 유튜브 IFrame API가 준비되면 초기화
function onYouTubeIframeAPIReady() {
    player = new YT.Player('main-video-player', {
        height: '360',
        width: '640',
        videoId: '4cIniILXP7I',
        events: {
            'onReady': onPlayerReady,
        }
    });
}

function onPlayerReady() {
    isPlayerReady = true;
    loadMainVideo(currentMainVideoIndex);
}

// 쇼츠 동영상 리스트 불러오기
const shortsData = [
    { videoId: '6yQEEtQqp4E', thumbnail: 'https://img.youtube.com/vi/6yQEEtQqp4E/hqdefault.jpg' },
    { videoId: 'ZncpLsoxG1o', thumbnail: 'https://img.youtube.com/vi/ZncpLsoxG1o/hqdefault.jpg' },
    { videoId: 'crV5cSpvWKk', thumbnail: 'https://img.youtube.com/vi/crV5cSpvWKk/hqdefault.jpg' },
    { videoId: 'koGabvnDGxU', thumbnail: 'https://img.youtube.com/vi/koGabvnDGxU/hqdefault.jpg' },
    { videoId: 'ayjZqbEbTgg', thumbnail: 'https://img.youtube.com/vi/ayjZqbEbTgg/hqdefault.jpg' },
    { videoId: 'HxiyAg4mSw4', thumbnail: 'https://img.youtube.com/vi/HxiyAg4mSw4/hqdefault.jpg' },
    { videoId: 'CcW4zr5PmYs', thumbnail: 'https://img.youtube.com/vi/CcW4zr5PmYs/hqdefault.jpg' },
    { videoId: 'hAUjIfA5R0A', thumbnail: 'https://img.youtube.com/vi/hAUjIfA5R0A/hqdefault.jpg' }
];

// 쇼츠 동영상 리스트 불러오기
function loadYouTubeShorts() {
    const shortsContainer = document.getElementById('shorts-container');
    shortsContainer.innerHTML = ''; // 기존 내용을 초기화

    shortsData.forEach(short => {
        const img = document.createElement('img');
        img.src = short.thumbnail;
        img.alt = "YouTube Short";
        img.classList.add('short-thumbnail'); // 스타일을 위한 클래스 추가
        img.addEventListener('click', () => openShortsModal(short.videoId));
        shortsContainer.appendChild(img);
    });
}

// 쇼츠 모달 열기
function openShortsModal(videoId) {
    const modal = document.getElementById('shorts-modal');
    modal.style.display = 'flex';

    // YouTube IFrame API 준비 상태 확인
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        console.error('YouTube IFrame API is not ready.');
        return;
    }

    // 동적으로 크기 계산
    const playerSize = getPlayerSize();

    // 쇼츠 플레이어 초기화 또는 업데이트
    if (!shortsPlayer) {
        shortsPlayer = new YT.Player('shorts-video-player', {
            height: playerSize.height,
            width: playerSize.width,
            videoId: videoId
        });
    } else {
        shortsPlayer.setSize(playerSize.width, playerSize.height); // 플레이어 크기 업데이트
        shortsPlayer.cueVideoById(videoId);
    }
}

// 플레이어 크기 계산 함수
function getPlayerSize() {
    const width = window.innerWidth;

    if (width > 1024) {
        return { width: 470, height: 836 }; // Desktop
    } else if (width > 600) {
        return { width: 430, height: 770 }; // Tablet
    } else {
        return { width: 380, height: 680 }; // Mobile
    }
}

// 창 크기 변경 시 플레이어 크기 동적 업데이트
window.addEventListener('resize', () => {
    if (shortsPlayer) {
        const playerSize = getPlayerSize();
        shortsPlayer.setSize(playerSize.width, playerSize.height);
    }
});

// 쇼츠 모달 닫기
function closeShortsModal() {
    const modal = document.getElementById('shorts-modal');
    modal.style.display = 'none';
    if (shortsPlayer) {
        shortsPlayer.stopVideo();
    }
}

// 메인 동영상을 업데이트하는 함수
const mainVideos = [
    '4_eOMTwQUzo', '_Ee_FChMEAU', 'fjJ6V0UIFDY', 'k41Bk8NNr58', 'lPxbmawGISs', 'Mv-Lx5HaHXE'
];

function loadMainVideo(index) {
    if (isPlayerReady) {
        player.cueVideoById(mainVideos[index]);
        currentMainVideoIndex = index;
        updateIndicators();
    }
}

// 동그라미 버튼 상태 업데이트
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentMainVideoIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// 동그라미 버튼 생성
function createIndicators() {
    const indicatorsContainer = document.getElementById('video-indicators');
    indicatorsContainer.innerHTML = ''; // 기존 버튼 초기화
    mainVideos.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        indicator.addEventListener('click', () => loadMainVideo(index));
        indicatorsContainer.appendChild(indicator);
    });
    updateIndicators();
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    createIndicators();
    loadMainVideo(0); // 첫 번째 동영상 로드
});

// 페이지 로드 시 쇼츠와 큰 동영상 로드
document.addEventListener('DOMContentLoaded', () => {
    loadYouTubeShorts();

    // API 스크립트가 로드되지 않은 경우 동적으로 추가
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
        onYouTubeIframeAPIReady();
    }
});

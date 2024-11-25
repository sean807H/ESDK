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
    { videoId: 'Yf6GV_QYtMI', thumbnail: 'https://img.youtube.com/vi/Yf6GV_QYtMI/hqdefault.jpg' },
    { videoId: 'crV5cSpvWKk', thumbnail: 'https://img.youtube.com/vi/crV5cSpvWKk/hqdefault.jpg' },
    { videoId: 'koGabvnDGxU', thumbnail: 'https://img.youtube.com/vi/koGabvnDGxU/hqdefault.jpg' },
    { videoId: 'ayjZqbEbTgg', thumbnail: 'https://img.youtube.com/vi/ayjZqbEbTgg/hqdefault.jpg' },
    { videoId: 'HxiyAg4mSw4', thumbnail: 'https://img.youtube.com/vi/HxiyAg4mSw4/hqdefault.jpg' },
    { videoId: 'QINU2nxUjq8', thumbnail: 'https://img.youtube.com/vi/QINU2nxUjq8/hqdefault.jpg' },
    { videoId: 'hAUjIfA5R0A', thumbnail: 'https://img.youtube.com/vi/hAUjIfA5R0A/hqdefault.jpg' }
];

function loadYouTubeShorts() {
    const shortsContainer = document.getElementById('shorts-container');
    shortsContainer.innerHTML = ''; 
    const start = currentShortsPage * 4;
    const end = start + 4;
    shortsData.slice(start, end).forEach(short => {
        const img = document.createElement('img');
        img.src = short.thumbnail;
        img.alt = "YouTube Short";
        img.addEventListener('click', () => openShortsModal(short.videoId));
        shortsContainer.appendChild(img);
    });
}

// 쇼츠 모달 열기
function openShortsModal(videoId) {
    const modal = document.getElementById('shorts-modal');
    modal.style.display = 'flex';

    if (!shortsPlayer) {
        shortsPlayer = new YT.Player('shorts-video-player', {
            height: '836',
            width: '470',
            videoId: videoId
        });
    } else {
        shortsPlayer.cueVideoById(videoId);
    }
}

// 쇼츠 모달 닫기
function closeShortsModal() {
    const modal = document.getElementById('shorts-modal');
    modal.style.display = 'none';
    if (shortsPlayer) {
        shortsPlayer.stopVideo();
    }
}

// 다음 쇼츠 페이지 표시
function showNextShorts() {
    currentShortsPage = (currentShortsPage + 1) % 2;
    loadYouTubeShorts();
}

// 이전 쇼츠 페이지 표시
function showPrevShorts() {
    currentShortsPage = (currentShortsPage - 1 + 2) % 2;
    loadYouTubeShorts();
}

// 메인 동영상을 업데이트하는 함수
const mainVideos = [
    '4_eOMTwQUzo', '_Ee_FChMEAU', 'fjJ6V0UIFDY', 'k41Bk8NNr58', 'lPxbmawGISs', 'Mv-Lx5HaHXE'
];

function loadMainVideo(index) {
    if (isPlayerReady) {
        player.cueVideoById(mainVideos[index]);
        currentMainVideoIndex = index;
    }
}

// 큰 동영상에서 다음 동영상 로드
function loadNextVideo() {
    currentMainVideoIndex = (currentMainVideoIndex + 1) % mainVideos.length;
    loadMainVideo(currentMainVideoIndex);
}

// 큰 동영상에서 이전 동영상 로드
function loadPrevVideo() {
    currentMainVideoIndex = (currentMainVideoIndex - 1 + mainVideos.length) % mainVideos.length;
    loadMainVideo(currentMainVideoIndex);
}

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

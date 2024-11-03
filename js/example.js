let player;
let isPlayerReady = false;
let initialVideoLoaded = false;

// 초기 동영상 정보
const initialVideoId = '4cIniILXP7I';
const initialVideoTitle = "[COVER] 도겸 - HAPPY (원곡 : DAY6)";

// 유튜브 IFrame API가 준비되면 초기화
function onYouTubeIframeAPIReady() {
    console.log("YouTube IFrame API가 준비되었습니다."); // 로드 확인 로그
    player = new YT.Player('main-video-player', {
        height: '400',
        width: '100%',
        videoId: initialVideoId, // 초기 로드할 동영상 ID
        events: {
            'onReady': onPlayerReady,
        }
    });
}

// 플레이어가 준비되었을 때 호출되는 함수
function onPlayerReady(event) {
    console.log("플레이어가 준비되었습니다."); // 로드 확인 로그
    isPlayerReady = true;
    loadInitialVideo();
}

// 초기 동영상을 로드하는 함수
function loadInitialVideo() {
    if (isPlayerReady && !initialVideoLoaded) {
        player.cueVideoById(initialVideoId);
        document.querySelector('.main-video-title').textContent = initialVideoTitle;
        initialVideoLoaded = true;
        console.log("초기 동영상이 로드되었습니다."); // 초기 동영상 로드 확인
    }
}

// 썸네일을 클릭하면 큰 화면의 동영상이 변경되지만, 자동 재생되지 않음
function loadVideo(videoId, title) {
    if (isPlayerReady) {
        player.cueVideoById(videoId); // 큰 화면에 동영상을 로드하되 자동 재생하지 않음
        document.querySelector('.main-video-title').textContent = title; // 제목 업데이트
        console.log(`동영상이 로드되었습니다: ${title}`); // 썸네일 클릭 후 동영상 로드 확인
    }
}

// 썸네일 클릭 시 동영상 업데이트
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOMContentLoaded 이벤트가 발생했습니다."); // 로드 확인 로그
    
    // 초기 동영상을 DOM 로드 후 호출
    loadInitialVideo();
    
    // 썸네일 클릭 이벤트 설정
    document.querySelectorAll('.thumbnail').forEach(function (element) {
        element.addEventListener('click', function () {
            const videoId = element.getAttribute('data-video-id');
            const title = element.getAttribute('data-title');
            loadVideo(videoId, title); // 큰 화면의 동영상을 업데이트
        });
    });
});

// 페이지 네이션 기능
function showPage(pageNumber) {
    const itemsPerPage = 4; // 페이지 당 표시할 썸네일 수
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach((thumbnail, index) => {
        const pageIndex = Math.floor(index / itemsPerPage) + 1;
        thumbnail.style.display = (pageIndex === pageNumber) ? 'block' : 'none';
    });
}

// 초기 페이지 설정
showPage(1);

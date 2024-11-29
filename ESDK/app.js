const express = require('express');
const path = require('path');
const app = express();

// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname, 'public')));

// 기본 라우트 설정
app.get('/', (req, res) => {
  res.send('Hello from Vercel!');
});

// 서버리스 함수로 export
module.exports = (req, res) => {
  app(req, res);  // Express 서버 실행
};

// 1. 정적 파일 제공 설정 (public과 images 폴더)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// 2. HTML 파일 라우팅 설정
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gallery.html'));
});

app.get('/album', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'album.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

app.get('/example', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'example.html'));
});

app.get('/point', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'point.html'));
});

// 이미지 API 설정 (카테고리별 이미지 제공)
app.get('/api/gallery', (req, res) => {
    const category = req.query.category;
    const itemsPerPage = 9;
    const page = parseInt(req.query.page) || 1;

    // 각 카테고리에 맞는 경로 설정
    let categoryPath;
    if (category === 'album') {
        categoryPath = path.join(__dirname, 'images', 'album');
    } else if (category === 'photo') {
        categoryPath = path.join(__dirname, 'images', 'legendmkdir'); // 화보를 legendmkdir에 연결
    } else if (category === 'legend') {
        categoryPath = path.join(__dirname, 'images', 'legend');
    } else {
        return res.status(400).json({ error: '잘못된 카테고리입니다.' });
    }

    // 이미지 파일을 불러와 페이지네이션 적용
    fs.readdir(categoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: '해당 카테고리 이미지를 불러올 수 없습니다.' });
        }

        const startIndex = (page - 1) * itemsPerPage;
        const selectedFiles = files.slice(startIndex, startIndex + itemsPerPage);

        // 이미지 URL 목록 생성
        const images = selectedFiles.map(file => {
            // 각 카테고리에 따른 이미지 URL 설정
            const urlPath = category === 'photo' ? 'legendmkdir' : category;
            return {
                url: `/images/${urlPath}/${file}`,
                title: file.split('.')[0]
            };
        });

        res.json(images);
    });
});



// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

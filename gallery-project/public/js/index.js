const express = require('express');
const app = express();
const PORT = 3000;

// 정적 파일을 제공하기 위한 설정 (예: 이미지, CSS 파일 등)
app.use(express.static('public'));

// 기본 라우트 설정
app.get('/', (req, res) => {
    res.send('Eternal Sunshine Dokyeom');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

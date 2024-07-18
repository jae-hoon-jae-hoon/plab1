// Express
const express = require('express');
const app = express();

// Cors
const cors = require('cors');

// Dotenv
const dotenv = require("dotenv").config();

// Library
const cookieParser = require('cookie-parser');

// Middleware
app.use(express.json()); // 유저가 보낸 array/object 데이터를 출력해보기 위해 필요
app.use(cookieParser()); // 쿠키를 사용하기 쉽게 함. req로 받을때 객체형태로 변환, 쿠키삭제 편리
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
})); // 다른 도메인주소끼리 ajax 요청 주고받을 때 필요


// // jwt 인증 검사 미들웨어 -> 로그인기능이 필요한 곳(글쓰기 등)에서 해당 미들웨어 사용
// const authenticateJWT = (req, res, next) => {
//     const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
//     if (!token) {
//         return res.sendStatus(401);
//     }
//     const decoded = verifyAccessToken(token);
//     if (!decoded) {
//         return res.sendStatus(403);
//     }
//     req.user = decoded;
//     next();
// };
// // 보호된 엔드포인트
// app.get('/board/write', authenticateJWT, (req, res) => {
//     res.status(200).json({ message: `Hello, ${req.user.username}` });
//   });



// Routes
app.use('/api/member', require('./Routes/Member/member'))
app.use('/api/board', require('./Routes/Board/board'));


const PORT = 5000;
app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });
// Express
const express = require('express');
const app = express();

// Cors
const cors = require('cors');

// Dotenv
const dotenv = require("dotenv").config();

// Middleware
app.use(express.json()); // 유저가 보낸 array/object 데이터를 출력해보기 위해 필요
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
})); // 다른 도메인주소끼리 ajax 요청 주고받을 때 필요

// Routes
app.use('/api/member', require('./Routes/Member/member'))
// app.use('/api/board', require('./Routes/Board'));


const PORT = 5000;
app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });
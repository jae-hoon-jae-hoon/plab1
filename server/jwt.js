// Database
const db = require('./db');

// Library
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();

const ACCESS_SERCRET_KEY = process.env.JWT_ACCESS_KEY;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_KEY;


const generateAccessToken = ({ userNo }) => {
    return jwt.sign({ userNo }, ACCESS_SERCRET_KEY, { expiresIn: '15m' });
};
// const generateAccessToken = ({ userNo, userName }) => {
//     return jwt.sign({ userNo, userName }, ACCESS_SERCRET_KEY, { expiresIn: '15m' });
// };

const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SERCRET_KEY);
    // try {
    //     return jwt.verify(token, ACCESS_SERCRET_KEY);
    // } catch (error) {
    //     return error;
    // }
};

const generateRefreshToken = ({ userNo }) => {
    return jwt.sign({ userNo }, REFRESH_SECRET_KEY, { expiresIn: '12h' });
};
// const generateRefreshToken = ({ userNo, userName }) => {
//     return jwt.sign({ userNo, userName }, REFRESH_SECRET_KEY, { expiresIn: '12h' });
// };

const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET_KEY);
    // try {
    //     return jwt.verify(token, REFRESH_SECRET_KEY);
    // } catch (error) {
    //     return error;
    // }
};



module.exports = {
    generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken,
};
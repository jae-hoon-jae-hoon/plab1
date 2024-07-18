// Database
const db = require('./db');

// Library
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');

const ACCESS_SERCRET_KEY = 'your-secret-key';
const REFRESH_SECRET_KEY = 'your-secret-key2';



const generateAccessToken = ({ userNo, userName }) => {
    return jwt.sign({ userNo, userName }, ACCESS_SERCRET_KEY, { expiresIn: '1h' });
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SERCRET_KEY);
    // try {
    //     return jwt.verify(token, ACCESS_SERCRET_KEY);
    // } catch (error) {
    //     return error;
    // }
};

const generateRefreshToken = ({ userNo, userName }) => {
    return jwt.sign({ userNo, userName }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
};

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
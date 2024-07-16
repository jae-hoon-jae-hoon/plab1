// Database
const db = require('./db');

// Library
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');

const ACCESS_SERCRET_KEY = 'your-secret-key';
const REFRESH_SECRET_KEY = 'your-secret-key2';



const generateAccessToken = ({ userId, userName }) => {
    return jwt.sign({ userId, userName }, ACCESS_SERCRET_KEY, { expiresIn: '1h' });
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, ACCESS_SERCRET_KEY);
    } catch (error) {
        return null;
    }
};

const generateRefreshToken = ({ userId, userName }) => {
    return jwt.sign({ userId, userName }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_SECRET_KEY);
    } catch (error) {
        return null;
    }
};



module.exports = {
    generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken,
};
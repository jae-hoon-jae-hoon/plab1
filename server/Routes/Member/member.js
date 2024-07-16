const express = require('express');
const router = express.Router();

// Database
const db = require('./../../db');
const { formatDate } = require('../../common');

// Library
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, saveRefreshToken } = require('../../jwt');


/* 아이디 중복검사 */
router.post('/idDuplChk', (req, res) => {
    const { userId } = req.body
    let result = { success: false, message: '' }

    // Validation
    if (userId === '') {
        result.message = "Input Value Error"
        return res.status(400).json(result)
    }

    let duplSql = "SELECT * FROM MEMBER WHERE userId = ?"
    let duplParams = [userId]
    db.query(duplSql, duplParams, (err, results) => {
        if (err) {
            // console.log(err);
            result.message = "ID Dupl Check Error"
            return res.status(500).json(result)
        }

        if (results.length > 0) {
            result.message = "ID Dupl Check Fail"
            return res.json(result)
        }
        else {
            result.success = true
            result.message = "ID Dupl Check Success"
            return res.json(result)
        }
    })
})

/* 회원가입 */
router.post('/signup', async (req, res) => {
    const { userId, userPw, userPwChk, userName } = req.body

    let result = { success: false, message: '' }

    // Validation
    if (userId === '' || userPw === '' || userPwChk === '' || userName === '') {
        result.message = "Input Value Error"
        return res.status(400).json(result)
    }
    if (userPw !== userPwChk) {
        result.message = "Passwords do not match";
        return res.status(400).json(result);
    }

    // 아이디 중복검사
    let duplSql = "SELECT * FROM MEMBER WHERE userId = ?"
    let duplParams = [userId]
    db.query(duplSql, duplParams, (err, results) => {
        if (err) {
            // console.log(err);
            result.message = "ID Dupl Check Error"
            return res.status(500).json(result)
        }
        if (results.length > 0) {
            result.message = "ID Dupl Check Fail"
            return res.json(result)
        }
    })

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPw, salt);

    let regDate = formatDate();
    let insertSql = "INSERT INTO member (userId, userPw, userName, regDate) VALUES (?, ?, ?, ?)"
    let insertParams = [userId, hashedPassword, userName, regDate]
    db.query(insertSql, insertParams, (err, results) => {
        if (err) {
            // console.log(err);
            result.message = "ID Insert Error"
            return res.status(500).json(result)
        }

        result.success = true
        result.message = "User registered successfully"
        return res.status(201).json(result)
    })
})


/* 로그인 */
router.post('/login', (req, res) => {
    const { userId, userPw } = req.body

    let result = { success: false, message: '' }

    // Validation
    if (userId === '' || userPw === '') {
        result.message = "Input Value Error"
        return res.status(400).json(result)
    }

    // Login
    let loginSql = "SELECT * FROM MEMBER WHERE userId = ?";
    let loginParams = [userId]
    db.query(loginSql, loginParams, async (err, results) => {
        if (err) {
            // console.log(err);
            result.message = "Login DB Error"
            return res.status(500).json(result)
        }

        if (results.length == 0) {
            result.message = "Not Found User"
            return res.status(400).json(result)
        }

        try {
            let userData = results[0];
            const isMatch = await bcrypt.compare(userPw, userData.userPw);
            if (!isMatch) {
                result.message = "Invalid password";
                return res.status(400).json(result);
            }

            // jwt 저장
            // 1. access, refresh 토큰 생성
            // 2. refresh 토큰 DB저장
            // 3. access, refresh 모두 쿠키 등 브라우저 저장소에 저장!
            // 모든게 성공하면 로그인 성공
            // 하나라도 실패하면 로그인 실패

            // 1. access, refresh 토큰 생성
            let tokenData = { userId: userData.userId, userName: userData.userName }
            const accessToken = generateAccessToken(tokenData)
            const refreshToken = generateRefreshToken(tokenData)

            // 2. refresh 토큰 DB저장
            let regDate = formatDate();
            let sql = 'Insert Into token (refreshToken, regDate) VALUES (?, ?)'
            let params = [refreshToken, regDate]
            db.query(sql, params, (err, results) => {
                if (results.affectedRows !== 1) {
                    result.message = "RefreshToken DB Save Error";
                    return res.status(500).json(result);
                }
            })

            // 3. access, refresh 모두 쿠키 등 브라우저 저장소에 저장!
            res.cookie('accessToken', accessToken, {
                // secure: true,        // HTTPS에서만 전송
                secure: false,        // localhost라서 false로 처리
                httpOnly: true,      // JavaScript에서 접근 불가
                sameSite: 'Strict',  // 동일 사이트에서만 전송
                maxAge: 3600000      // 1시간 후 만료
            });
            res.cookie('refreshToken', refreshToken, {
                // secure: true,        // HTTPS에서만 전송
                secure: false,        // localhost라서 false로 처리
                httpOnly: true,      // JavaScript에서 접근 불가
                sameSite: 'Strict',  // 동일 사이트에서만 전송
                maxAge: 3600000 * 24 * 7
            });

            // 4. 로그인 성공
            result.success = true;
            result.message = "Login successful";
            result.userData = tokenData
            res.status(200).json(result);
        }
        catch (error) {
            // console.log(error);
            result.message = "Error during login";
            res.status(500).json(result);
        }
    })
})

/* 로그아웃 */
router.get('/logout', (req, res) => {
    // 쿠키 삭제
    // clearCookie 사용시 Cookie-parser 필요
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    // res.cookie('accessToken', '', { expires: new Date(0), httpOnly: true })
    // res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true })

    res.json({ success: true })
})

/* ⚽ 로그인 토큰검사 */

module.exports = router;
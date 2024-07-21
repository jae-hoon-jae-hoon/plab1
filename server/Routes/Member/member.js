const express = require('express');
const router = express.Router();

// Database
const db = require('./../../db');
const { formatDate } = require('../../common');

// Library
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../../jwt');


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
            let tokenData = { userNo: userData.userNo, userName: userData.userName }
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

/* 로그인 토큰검사 */
router.post('/authorization', (req, res) => {
    const { userNo, userName } = req.body;

    if(!userNo || !userName){
        return res.json({ success: false, error: 'No User Data' })
    }

    const accessToken = req.cookies.accessToken
    const refreshToken = req.cookies.refreshToken

    try {
        let verifyResult = verifyAccessToken(accessToken)

        // 1. accessToken 유효
        if (verifyResult.userNo === userNo && verifyResult.userName === userName) {
            return res.json({ success: true });
        }
        // 로그인정보 != 토큰정보
        else {
            return res.json({ success: false });
        }

    } catch (error) {
        // accessToken 만료
        if (error.name == 'TokenExpiredError') {

            // refreshToken DB 검사
            let sql = "SELECT * FROM token WHERE refreshToken = ?"
            let params = [refreshToken]
            const { values } = db.query(sql, params);

            // refreshToken DB에 없을때
            if (values.length == 0) {
                return res.json({ success: false, error: 'refreshToken DB Error' })
            }

            // refreshToken 검증
            try {
                const verifyRefreshResult = verifyRefreshToken(refreshToken)

                // 2. refreshToken 유효 -> 새 accessToken 발급 + 쿠키 갱신
                let newAccessToken = generateAccessToken(verifyRefreshResult)
                if (!newAccessToken) {
                    return res.json({ success: false, error: "new accessToken Error" });
                }

                // accessToken 쿠키 저장
                res.cookie(
                    'accessToken',
                    newAccessToken,
                    {
                        // secure: true,        // HTTPS에서만 전송
                        secure: false,        // localhost라서 false로 처리
                        httpOnly: true,      // JavaScript에서 접근 불가
                        sameSite: 'Strict',  // 동일 사이트에서만 전송
                        maxAge: 3600000      // 1시간 후 만료
                    }

                );

                console.log("accessToken 재발급");

                return res.json({ success: true });
            }
            // 3. refreshToken 만료 -> 로그인페이지로 이동
            catch (error) {
                // ⚽ refreshToken DB 삭제 - trigger로 regDate가 14일 이상 지난건 지우는 방법으로

                // 쿠키 삭제
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');

                return res.json({
                    success: false,
                    error: "refreshToken Value Error",
                });
            }

        }
        else {
            // 쿠키 삭제
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            return res.json({
                success: false
            });
        }
    }
})

module.exports = router;
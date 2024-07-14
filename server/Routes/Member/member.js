const express = require('express');
const router = express.Router();

// Database
const db = require('./../../db');

// Library
const dayjs = require('dayjs');
const bcrypt = require('bcrypt');


router.post('/idDuplChk', (req, res) => {
    const { userId } = req.body
    let result = { success: false, message: '' }

    // Validation
    if (userId === '') {
        result.message = "Input Value Error"
        return res.status(400).json(result)
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
        else {
            result.success = true
            result.message = "ID Dupl Check Success"
            return res.json(result)
        }
    })
})


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

    // DB에 비밀번호 암호화 후 저장
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPw, salt);

    let regDate = dayjs(new Date(), "YYYY-MM-DD HH:mm:ss");
    regDate = regDate.format("YYYY-MM-DD HH:mm:ss");

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

module.exports = router;
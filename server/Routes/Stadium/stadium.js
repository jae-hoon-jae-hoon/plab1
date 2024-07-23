const express = require('express');
const router = express.Router();

// Database
const db = require('./../../db');
const { formatDate } = require('../../common');

// Library
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../../jwt');


router.post('/getStadium', (req, res) => {
    const { userNo } = req.body

    let result = { success: false, message: '' }

    if (userNo) {
        let sql = `SELECT M.myStadiumNo, S.* FROM my_stadium AS M
                   JOIN stadium AS S 
                   ON M.userNo = ${userNo} AND M.stadiumNo = S.stadiumNo
                  `
        db.query(sql, (err, results) => {
            if (err) {
                // console.log(err);
                result.message = "DB Error - 즐겨찾기"
                return res.status(500).json(result)
            }

            result.success = true;
            result.myStadium = results;
        })
    }

    let sql = "SELECT * FROM stadium"
    db.query(sql, (err, results) => {
        if (err) {
            // console.log(err);
            result.success = false
            result.message = "DB Error - 카카오맵 리스트"
            return res.status(500).json(result)
        }

        result.success = true;
        result.stadiums = results;
        return res.status(200).json(result)
    })
})

// 즐겨찾기 저장 / 삭제
router.post('/setMyStadium', (req, res) => {
    const { stadiumNo, userNo } = req.body

    let result = { success: false, message: '' }

    if (!userNo) {
        result.message = 'No userData'
        return res.status(400).json(result)
    }
    let sql = "SELECT * FROM my_stadium WHERE userNo = ? AND stadiumNo = ?"
    let params = [userNo, stadiumNo]
    db.query(sql, params, (err, results) => {
        if (err) {
            // console.log(err);
            result.message = "DB Select Error"
            return res.status(500).json(result)
        }

        if (results.length === 0) {
            // 즐겨찾기 추가
            let regDate = formatDate()
            let saveSql = 'INSERT INTO my_stadium (userNo, stadiumNo, regDate) VALUES (?, ?, ?)'
            let saveParams = [userNo, stadiumNo, regDate]
            db.query(saveSql, saveParams, (err, saveResults) => {
                if (err) {
                    // console.log(err);
                    result.message = "DB Insert Error"
                    return res.status(500).json(result)
                }

                // if(saveResults.affectedRows === 1){
                result.success = true;
                result.active = true;
                return res.status(201).json(result)
                // }
            })
        }
        else {
            // 즐겨찾기 삭제
            let deleteSql = 'DELETE FROM my_stadium WHERE userNo = ? AND stadiumNo = ?';
            let deleteParams = [userNo, stadiumNo]
            db.query(deleteSql, deleteParams, (err, deleteResults) => {
                if (err) {
                    console.log(err);
                    result.message = "DB Delete Error"
                    return res.status(500).json(result)
                }

                // if(deleteResults.affectedRows === 1){
                result.success = true;
                result.active = false;
                return res.status(200).json(result)
                // }
            })
        }
    })
})

module.exports = router;
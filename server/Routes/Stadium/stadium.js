const express = require('express');
const router = express.Router();

// Database
const db = require('./../../db');
const { formatDate } = require('../../common');

// Library
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../../jwt');


// Router

/* 즐겨찾기 리스트 불러오기 */
router.post('/getMyStadium', async (req, res) => {
    const { userNo } = req.body

    let result = { success: false, message: '' }

    // Get My Stadium List
    if (userNo) {
        let sql = `SELECT *, mapId AS id FROM my_stadium WHERE userNo = ${userNo}`
        db.query(sql, (err, results) => {
            if (err) {
                // console.log(err);
                result.message = "DB Error - MyStadium"
                return res.status(500).json(result)
            }

            result.success = true;
            result.myStadium = results;
            return res.status(200).json(result)
        })
    }
    else {
        result.success = true;
        result.myStadium = [];
        return res.status(200).json(result)
    }
})

/* 즐겨찾기 저장 및 삭제 */
router.post('/setMyStadium', (req, res) => {
    const { stadiumInfo, userNo } = req.body

    let result = { success: false, message: '' }

    // Validation
    if (!userNo) {
        result.message = 'No userData'
        return res.status(400).json(result)
    }

    let sql = "SELECT * FROM my_stadium WHERE userNo = ? AND mapId = ?"
    let params = [userNo, stadiumInfo.id]
    db.query(sql, params, (err, results) => {
        if (err) {
            // console.log(err);
            result.message = "DB Select Error"
            return res.status(500).json(result)
        }

        if (results.length === 0) {
            // 즐겨찾기 추가
            let saveSql = 'INSERT INTO my_stadium (userNo, mapId, place_name, road_address_name, address_name, x, y) VALUES (?, ?, ?, ?, ?, ?, ?)'
            let saveParams = [userNo, stadiumInfo.id, stadiumInfo.place_name, stadiumInfo.road_address_name, stadiumInfo.address_name, stadiumInfo.x, stadiumInfo.y]
            db.query(saveSql, saveParams, (err, saveResults) => {
                if (err) {
                    // console.log(err);
                    result.message = "DB Insert Error"
                    return res.status(500).json(result)
                }

                // if(saveResults.affectedRows === 1){
                result.insertId = saveResults.insertId;
                result.success = true;
                result.active = true;
                return res.status(201).json(result)
                // }
            })
        }
        else {
            // 즐겨찾기 삭제
            let deleteSql = 'DELETE FROM my_stadium WHERE userNo = ? AND mapId = ?';
            let deleteParams = [userNo, stadiumInfo.id]
            db.query(deleteSql, deleteParams, (err, deleteResults) => {
                if (err) {
                    // console.log(err);
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
const express = require('express');
const router = express.Router();

// Database
const db = require('./../../db');
const { formatDate } = require('../../common');

// Library
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../../jwt');


// Method
async function getTotalListCnt(keyword) {
    try {
        const results = await new Promise((resolve, reject) => {
            let sql = 'SELECT COUNT(*) as totalListCnt FROM stadium';
            if (keyword) {
                sql += ` WHERE title LIKE "%${keyword}%" OR address LIKE "%${keyword}%" `;
            }

            db.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(false)
                }
                resolve(results);
            });
        });
        const totalListCnt = results[0].totalListCnt;
        return totalListCnt;
    } catch (err) {
        console.log(err);
        return false
    }
}

async function getList(startIndex, perPage, keyword) {
    try {
        const listData = await new Promise((resolve, reject) => {
            let sql = `SELECT stadiumNo, title, address, latitude, longitude FROM stadium`;
            if (keyword) {
                sql += ` WHERE title LIKE "%${keyword}%" OR address LIKE "%${keyword}%" `;
            }
            sql += `
                    ORDER BY stadiumNo ASC
                    LIMIT ${startIndex}, ${perPage}
                    `
            db.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(false)
                }

                resolve(results);
            })
        });
        return listData;

    } catch (err) {
        console.log(err);
        return false
    }
}


// Router
router.post('/getStadium', async (req, res) => {
    const { userNo, keyword, currentPage } = req.body

    console.log(userNo);

    let result = { success: false, message: '' }

    // Validation
    if (keyword && keyword.length < 2) {
        result.message = 'Keyword Error';
        return result;
    }

    // Get My Stadium List
    if (userNo) {
        let sql = `SELECT *, mapId AS id FROM my_stadium WHERE userNo = ${userNo}`
        db.query(sql, (err, results) => {
            if (err) {
                // console.log(err);
                result.message = "DB Error - MyStadium"
                return res.status(500).json(result)
            }

            // console.log(results);

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

    // // --------------------------------------------------
    // // Get Stadium List & Pagination

    // const perPage = 6; // ⚽ 완성후 값수정

    // // Total List Count
    // const totalListCnt = await getTotalListCnt(keyword);

    // // List Info
    // const listStartNum = totalListCnt - ((currentPage - 1) * perPage)

    // // Pagination
    // const pgnLastNum = Math.ceil(totalListCnt / perPage)
    // let pgnNumbers = [];
    // if (currentPage < 3) {
    //     for (let i = 1; i <= pgnLastNum; i++) {
    //         pgnNumbers.push(i)
    //         if (pgnNumbers.length == 5) break;
    //     }
    // }
    // else if (currentPage + 2 > pgnLastNum) {
    //     for (let i = pgnLastNum; i >= 1; i--) {
    //         pgnNumbers.unshift(i)
    //         if (pgnNumbers.length == 5) break;
    //     }
    // } else {
    //     for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    //         pgnNumbers.push(i)
    //         if (pgnNumbers.length == 5) break;
    //     }
    // }

    // // Pgn Limit
    // let startIndex = ((currentPage - 1) * perPage);

    // // getList
    // let list = await getList(startIndex, perPage, keyword)
    // if (!list) {
    //     result.message = 'Get List Fail';
    //     return result;
    // }

    // result.success = true
    // result.message = "Success Select List"
    // result.listData = {
    //     totalListCnt,
    //     currentPage,
    //     listStartNum,
    //     list,

    //     pgnLastNum,
    //     pgnNumbers
    // }
    // return res.status(200).json(result)
})

// 즐겨찾기 저장 / 삭제
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
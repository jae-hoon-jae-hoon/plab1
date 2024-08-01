const express = require('express');
const router = express.Router();

// Database
const db = require('../../db');
const { formatDate } = require('../../common');

// Library
const { verifyAccessToken } = require('../../jwt');


// Method
async function getTotalListCnt(keyword) {
    try {
        const results = await new Promise((resolve, reject) => {
            let sql = 'SELECT COUNT(*) as totalListCnt FROM board';
            if (keyword !== '') {
                sql += ` WHERE title LIKE "%${keyword}%" OR content LIKE "%${keyword}%" `;
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
            let sql = `SELECT boardNo, title, userName, DATE_FORMAT(regDate,'%Y-%m-%d') as formatDate FROM board`;
            if (keyword !== '') {
                sql += ` WHERE title LIKE "%${keyword}%" OR content LIKE "%${keyword}%" `;
            }
            sql += `
                    ORDER BY regDate DESC
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


/* 리스트 */
router.post('/list', async (req, res) => {
    let result = { success: false, message: '', listData: {} }

    const { currentPage, keyword } = req.body;

    // Validation
    if (keyword && keyword.length < 2) {
        result.message = 'Keyword Error';
        return result;
    }
    
    const perPage = 5; // ⚽ 완성후 값수정

    // Total List Count
    const totalListCnt = await getTotalListCnt(keyword);

    // Table Info
    const listStartNum = totalListCnt - ((currentPage - 1) * perPage)

    // Pagination
    const pgnLastNum = Math.ceil(totalListCnt / perPage)
    let pgnNumbers = [];
    if (currentPage < 3) {
        for (let i = 1; i <= pgnLastNum; i++) {
            pgnNumbers.push(i)
            if (pgnNumbers.length == 5) break;
        }
    }
    else if (currentPage + 2 > pgnLastNum) {
        for (let i = pgnLastNum; i >= 1; i--) {
            pgnNumbers.unshift(i)
            if (pgnNumbers.length == 5) break;
        }
    } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            pgnNumbers.push(i)
            if (pgnNumbers.length == 5) break;
        }
    }

    // Pgn Limit
    let startIndex = ((currentPage - 1) * perPage);

    // getList
    let list = await getList(startIndex, perPage, keyword)
    if (!list) {
        result.message = 'Get List Fail';
        return result;
    }

    result.success = true
    result.message = "Success Select List"
    result.listData = {
        totalListCnt,
        currentPage,
        listStartNum,
        list,

        pgnLastNum,
        pgnNumbers
    }
    return res.status(200).json(result)
})

/* Write */
router.post('/write', (req, res) => {
    let result = { success: false, message: '' }

    const { title, content, userNo, userName } = req.body

    // Validation
    if (title === '' || content === '') {
        result.message = 'Input Value Error'
        return res.status(400).json(result)
    }

    let regDate = formatDate()

    // Insert
    let sql = "Insert Into board (title, content, userNo, userName, regDate) VALUES (?, ?, ?, ?, ?)"
    let params = [title, content, userNo, userName, regDate]
    db.query(sql, params, (err, results) => {
        if (err) {
            result.message = err;
            return res.status(500).json(result);
        }

        if (results.affectedRows === 1) {
            result.success = true;
            return res.status(201).json(result);
        } else {
            result.message = "DB Result Error"
            return res.status(500).json(result);
        }
    })
})

/* Detail */
router.post('/detail', (req, res) => {
    let result = { success: false, message: '' }

    const { boardNo } = req.body

    db.query(
        'SELECT title, content, userNo, userName, DATE_FORMAT(regDate, \'%Y-%m-%d %H:%i:%s\') as formatDate FROM board WHERE boardNo=' + boardNo,
        (err, results) => {
            if (err) {
                result.message = 'DB Error'
                return res.status(500).json(result);
            }

            result.data = results[0]
            result.success = true
            result.message = "Get Data Success"
            res.json(result);
        });
})

/* Update */
router.post('/update', (req, res) => {
    let result = { success: false, message: '' }

    const { boardNo, userNo, title, content } = req.body

    // Validation
    if (title === '' || content === '') {
        result.message = 'Input Value Error'
        return res.status(400).json(result)
    }

    // Update
    let sql = "UPDATE board SET title=?, content=? WHERE boardNo=? AND userNo = ?"
    let params = [title, content, boardNo, userNo]
    db.query(sql, params, (err, results) => {
        if (err) {
            result.message = 'DB Error'
            return res.status(500).json(result);
        }

        if (results.affectedRows === 1) {
            result.success = true;
            return res.status(200).json(result);
        } else {
            result.message = "DB Result Error"
            return res.status(500).json(result);
        }
    })
})

router.post('/delete', (req, res) => {
    let result = { success: false, message: '' }

    const { boardNo, userNo } = req.body
    const accessToken = req.cookies.accessToken

    // Validation
    if (!boardNo) {
        result.message = "boardNo Error"
        return res.status(400).json(result);
    }

    if (!checkUser(accessToken, userNo)) { // 작성자 일치 검사
        result.message = "User Check Fail"
        return res.status(400).json(result)
    }

    // Delete
    let sql = "DELETE FROM board WHERE boardNo = ? AND userNo = ?"
    let params = [boardNo, userNo]
    db.query(sql, params, (err, results) => {
        if (err) {
            result.message = 'DB Error'
            return res.status(500).json(result);
        }
        if (results.affectedRows === 1) {
            result.success = true;
            return res.status(200).json(result);
        } else {
            result.message = "DB Result Error"
            return res.status(500).json(result);
        }
    })
})

const checkUser = (accessToken, userNo) => {
    try {
        let verifyResult = verifyAccessToken(accessToken)
        return verifyResult.userNo === userNo;
    }
    catch (e) {
        return false
    }
}



module.exports = router;
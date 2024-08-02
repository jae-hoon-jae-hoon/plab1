const express = require('express');
const router = express.Router();

// Database
const db = require('./../../db');
const { formatDate } = require('../../common');

// S3
const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = new S3Client({
    region: 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
})
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`) //업로드시 파일명 변경가능
        }
    })
})


// Method
async function getTotalListCnt(keyword) {
    try {
        const results = await new Promise((resolve, reject) => {
            let sql = 'SELECT COUNT(*) as totalListCnt FROM team';
            if (keyword !== '') {
                sql += ` WHERE teamName LIKE "%${keyword}%" `;
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
            let sql = `SELECT teamNo, teamName, teamDesc, teamImgPath, DATE_FORMAT(regDate,'%Y-%m-%d') as formatDate FROM team`;
            if (keyword !== '') {
                sql += ` WHERE teamName LIKE "%${keyword}%" `;
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

// Router
/* 팀 리스트 */
router.post('/getTeamList', async (req, res) => {
    let result = { success: false, message: '', listData: {} }

    const { currentPage, keyword } = req.body;

    // Validation
    if (keyword && keyword.length < 2) {
        result.message = 'Keyword Error';
        return result;
    }

    const perPage = 6; // ⚽ 완성후 값수정

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

/* 팀 만들기 */
router.post('/addTeam', upload.single('img'), (req, res) => {
    let result = { success: false, message: "" }

    const { name, desc } = req.body

    try {
        if (name === '' || desc === '') {
            throw new Error('Input Value Error')
        }

        let teamImgKey = req.file ? req.file.key : ''
        let teamImgPath = req.file ? req.file.location : ''
        let regDate = formatDate();
        let insertSql = "INSERT INTO team (teamName, teamDesc, teamImgKey, teamImgPath, regDate) VALUES (?, ?, ?, ?, ?)"
        let insertParams = [name, desc, teamImgKey, teamImgPath, regDate]
        db.query(insertSql, insertParams, (err, results) => {
            if (err) {
                throw new Error('ID Insert Error')
            }

            result.insertId = results.insertId
            result.teamImgPath = teamImgPath
            result.success = true
            result.message = "User registered successfully"
            return res.status(201).json(result)
        })

    } catch (error) {
        // 에러 발생 시, 업로드된 이미지 삭제
        if (req.file && req.file.key) {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: req.file.key,
            };

            s3.deleteObject(params, (err, data) => {
                if (err) {
                    result.message = "Error deleting the image from S3"
                    res.status(500).json(result)
                    // console.error('Error deleting the image from S3:', err);
                }
            });

        }
        result.message = error
        res.status(500).json(result)
    }
})

/* 팀 가입 신청 */
router.post('/joinTeam', async (req, res) => {
    let result = { success: false, message: "" }

    const { userNo, teamNo } = req.body

    // Validation
    if (!userNo || !teamNo) {
        result.message = "User Data Error"
        return res.status(400).json(result)
    }

    let selectSql = "SELECT * FROM team_join WHERE teamNo = ? AND userNo = ?"
    let selectParams = [teamNo, userNo]
    db.query(selectSql, selectParams, (err, results) => {
        if (err) {
            result.message = "Select Error"
            return res.status(500).json(result)
        }

        if (results.length > 0) {
            if (results[0].status === 1) {
                result.message = "status-1"
                return res.json(result)

            } else if (results[0].status === 2) {
                result.message = "status-2"
                return res.json(result)

            } else if (results[0].status === 3) {
                result.message = "status-3"
                return res.json(result)
            }
        }
        else {
            // 추가
            let regDate = formatDate();
            let insertSql = "INSERT INTO team_join (teamNo, userNo, level, status, backnumber, regDate) VALUES (?, ?, ?, ?, ?, ?)"
            let insertParams = [teamNo, userNo, 3, 3, '', regDate]
            db.query(insertSql, insertParams, (err, insertResults) => {
                if (err) {
                    result.message = "Insert Error"
                    return res.status(500).json(result)
                }

                result.success = true;
                return res.status(201).json(result)
            })
        }
    })
})



module.exports = router;

const express = require('express');
const router = express.Router();

// Database
const db = require('./../../db');
const { formatDate } = require('../../common');

// S3
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3')
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
            const encodedFileName = encodeURIComponent(file.originalname); // 파일명을 URL 인코딩
            cb(null, `${Date.now()}_${encodedFileName}`); // 인코딩된 파일명 사용
        }
    })
})

const teamJoinStatus = {
    joined: 1,
    reject: 2,
    waiting: 3
}
const teamMasterLevel = 1


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
                    // console.log(err);
                    reject(false)
                }
                resolve(results);
            });
        });
        const totalListCnt = results[0].totalListCnt;
        return totalListCnt;
    } catch (err) {
        // console.log(err);
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
                    // console.log(err);
                    reject(false)
                }

                resolve(results);
            })
        });
        return listData;

    } catch (err) {
        // console.log(err);
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

/* 팀메인 - My Team 불러오기 */
router.post('/getMyTeam', (req, res) => {
    let result = { success: false, message: "" }

    const { userNo } = req.body

    // validation
    if (!userNo) {
        result.message = "User Data Error"
        return res.status(400).json(result)
    }

    let sql = `SELECT TJ.teamJoinNo, T.* FROM team_join AS TJ
                    JOIN team AS T
                    ON TJ.userNo = ? AND TJ.teamNo = T.teamNo
                    WHERE status = 1
                    `
    let params = [userNo]
    db.query(sql, params, (err, results) => {
        if (err) {
            result.message = "Select Error"
            return res.status(500).json(result)
        }

        if (results) {
            result.success = true
            result.message = "Success"
            result.data = results
            return res.status(200).json(result)
        }
        else {
            result.message = "No Result"
            return res.status(500).json(result)
        }
    })
})

/* 팀 만들기 */
router.post('/addTeam', upload.single('img'), async (req, res) => {
    let result = { success: false, message: "" }

    const { userNo, name, desc } = req.body

    try {
        if (name === '' || desc === '') {
            throw new Error('Input Value Error')
        }

        let teamImgKey = req.file ? req.file.key : ''
        let teamImgPath = req.file ? req.file.location : ''

        let regDate = formatDate();

        // team테이블 insert
        let insertSql = "INSERT INTO team (userNo, teamName, teamDesc, teamImgKey, teamImgPath, regDate) VALUES (?, ?, ?, ?, ?, ?)"
        let insertParams = [userNo, name, desc, teamImgKey, teamImgPath, regDate]
        db.query(insertSql, insertParams, (err, results) => {
            if (err) {
                throw new Error('ID Insert Error')
            }

            // team_join테이블 insert
            let teamNo = results.insertId
            let teamJoinInsertSql = "INSERT INTO team_join (teamNo, userNo, level, status, regDate) VALUES (?, ?, ?, ?, ?)"
            let teamJoinInsertParams = [teamNo, userNo, 1, 1, regDate]
            db.query(teamJoinInsertSql, teamJoinInsertParams, (teamJoinErr, results) => {
                if (teamJoinErr) {
                    throw new Error('team_join Insert Error')
                }

                result.insertId = teamNo
                result.teamImgPath = teamImgPath
                result.success = true
                result.message = "User registered successfully"
                return res.status(201).json(result)
            })
        })
    } catch (error) {
        // console.log(error);

        // 에러 발생 시, 업로드된 이미지 삭제
        if (req.file && req.file.key) {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: req.file.key,
            };
            const command = new DeleteObjectCommand(params);
            try {
                const data = await s3.send(command);
                // console.log(data);
            } catch (err) {
                console.error(err);
            }

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

/* 팀정보보기 - player */
router.post('/getDetailModalPlayerInfo', (req, res) => {
    let result = { success: false, message: "" }

    const { teamNo } = req.body

    // Validation
    if (!teamNo) {
        result.message = "Team Data Error"
        return res.status(400).json(result)
    }

    let sql = `SELECT TJ.teamJoinNo, TJ.backnumber, M.userName FROM team_join AS TJ
                    JOIN member AS M
                    ON TJ.teamNo = ? AND TJ.status = ? AND TJ.userNo = M.userNo
                    ORDER BY TJ.backnumber ASC
                    `
    let params = [teamNo, teamJoinStatus.joined]
    db.query(sql, params, (err, results) => {
        if (err) {
            result.message = "Select Error"
            return res.status(500).json(result)
        }

        if (results) {
            result.success = true
            result.message = "Success"
            result.data = results
            return res.status(200).json(result)
        }
        else {
            result.message = "No Result"
            return res.status(200).json(result)
        }
    })
})

/* 팀정보보기 - record */
router.post('/getDetailModalRecordInfo', (req, res) => {
    let result = { success: false, message: "" }

    const { teamNo } = req.body

    // validation
    if (!teamNo) {
        result.message = "Team Data Error"
        return res.status(400).json(result)
    }

    let sql = `SELECT * FROM team_record WHERE teamNo = ? ORDER BY teamRecordNo DESC LIMIT 5`
    let params = [teamNo]
    db.query(sql, params, (err, results) => {
        if (err) {
            result.message = "Select Error"
            return res.status(500).json(result)
        }

        if (results) {
            result.success = true
            result.message = "Success"
            result.data = results
            return res.status(200).json(result)
        }
        else {
            result.message = "No Result"
            return res.status(200).json(result)
        }
    })
})



/* My Team ------------------------------------------------- */

/* 기본정보 불러오기 */
router.post('/getMyTeamInfo', (req, res) => {
    let result = { success: false, message: "" }

    const { userNo, teamNo } = req.body

    // validation
    if (!userNo) {
        result.message = "User Data Error"
        return res.status(400).json(result)
    }
    if (!teamNo) {
        result.message = "Team Data Error"
        return res.status(400).json(result)
    }

    let sql = `SELECT * FROM team WHERE teamNo = ?`
    let params = [teamNo]
    db.query(sql, params, (err, results) => {
        if (err) {
            result.message = "Select Error"
            return res.status(500).json(result)
        }

        if (results) {
            result.success = true
            result.message = "Success"
            result.data = results[0]
            return res.status(200).json(result)
        }
        else {
            result.message = "No Result"
            return res.status(200).json(result)
        }
    })
})

/* Update: 기본정보 수정 */
router.post('/updateTeam', upload.single('img'), async (req, res) => {
    let result = { success: false, message: "" }

    const { teamNo, name, desc, chkChangeImg, originImgKey } = req.body
    let boolChkChangeImg = chkChangeImg == 'true' ? true : false

    try {
        if (!teamNo) {
            throw new Error('teamNo Value Error')
        }
        if (name === '' || desc === '') {
            throw new Error('Input Value Error')
        }

        // chkChangeImg가 true면 기존 이미지 삭제
        if (boolChkChangeImg) {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: originImgKey,
            };

            const command = new DeleteObjectCommand(params);
            try {
                const data = await s3.send(command);
                // console.log("성공");
                // console.log(data);
            } catch (err) {
                throw new Error('Image Delete Error')
                // console.log("실패");
                // console.error(err);
            }
        }

        let teamImgKey = req.file ? req.file.key : ''
        let teamImgPath = req.file ? req.file.location : ''
        let set = "SET teamName = ?, teamDesc = ?"
        let params = [name, desc]
        if (boolChkChangeImg) {
            set += ", teamImgKey = ?, teamImgPath = ?"
            params.push(teamImgKey)
            params.push(teamImgPath)
        }

        params.push(teamNo)
        let updateSql = `UPDATE team ${set} WHERE teamNo = ?`

        db.query(updateSql, params, (err, results) => {
            if (err) {
                throw new Error('Update Error')
            }

            result.teamImgPath = teamImgPath
            result.success = true
            result.message = "User registered successfully"
            return res.status(200).json(result)
        })

    } catch (error) {
        // 에러 발생 시, 업로드된 이미지 삭제
        if (req.file && req.file.key) {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: req.file.key,
            };

            const command = new DeleteObjectCommand(params);
            try {
                const data = await s3.send(command);
                // console.log("성공");
                // console.log(data);
            } catch (err) {
                // console.log("실패");
                // console.error(err);
                result.message = "Error deleting the image from S3"
                res.status(500).json(result)
            }
        }

        // console.log(error);
        result.message = error
        res.status(500).json(result)
    }
})

/* 팀원정보 불러오기 */
router.post('/getMyTeamMemberList', (req, res) => {
    let result = { success: false, message: "" }

    const { teamNo } = req.body

    // validation
    if (!teamNo) {
        result.message = "Team Data Error"
        return res.status(400).json(result)
    }

    let sql = `SELECT TJ.*, M.userName FROM team_join AS TJ
                    JOIN member AS M
                    ON TJ.teamNo = ? AND TJ.status = ? AND TJ.userNo = M.userNo
                    `
    let params = [teamNo, teamJoinStatus.joined]
    db.query(sql, params, (err, results) => {
        if (err) {
            result.message = "Select Error"
            return res.status(500).json(result)
        }

        if (results) {
            result.success = true
            result.message = "Success"
            result.data = results
            return res.status(200).json(result)
        }
        else {
            result.message = "No Result"
            return res.status(200).json(result)
        }
    })
})

/* Update: 팀원정보 수정 */
router.post('/updateMemberInfo', (req, res) => {
    let result = { success: false, message: "" }

    let { teamJoinNo, backnumber, etc, level } = req.body
    level = Number(level)

    // Validation
    if (!teamJoinNo) {
        result.message = "teamJoinNo Error"
        return res.status(500).json(result)
    }
    if (!(backnumber > 0 && backnumber < 100)) {
        result.message = "User Data Error - backnumber"
        return res.status(500).json(result)
    }
    if (etc.length > 300) {
        result.message = "User Data Error - etc"
        return res.status(500).json(result)
    }
    if (!(level === 2 || level === 3)) {
        result.message = "User Data Error - level"
        return res.status(500).json(result)
    }

    let updateSql = `UPDATE team_join SET backnumber = ?, etc=?, level=? WHERE teamJoinNo = ?`
    let params = [backnumber, etc, level, teamJoinNo]

    db.query(updateSql, params, (err, results) => {
        if (err) {
            result.message = "Update Error"
            return res.status(500).json(result)
        }

        result.success = true
        result.message = "Update successfully"
        return res.status(200).json(result)
    })
})

/* Get Waiting Member List */
router.post('/getWaitingList', (req, res) => {
    let result = { success: false, message: "" }

    const { teamNo } = req.body

    // validation
    if (!teamNo) {
        result.message = "Team Data Error"
        return res.status(400).json(result)
    }

    let sql = `SELECT TJ.*, M.userName FROM team_join AS TJ
                    JOIN member AS M
                    ON TJ.teamNo = ? AND TJ.status = ? AND TJ.userNo = M.userNo
                    `
    let params = [teamNo, teamJoinStatus.waiting]
    db.query(sql, params, (err, results) => {
        if (err) {
            result.message = "Select Error"
            return res.status(500).json(result)
        }

        if (results) {
            result.success = true
            result.message = "Success"
            result.data = results
            return res.status(200).json(result)
        }
        else {
            result.message = "No Result"
            return res.status(200).json(result)
        }
    })
})

/* Get Reject Member List */
router.post('/getRejectList', (req, res) => {
    let result = { success: false, message: "" }

    const { teamNo } = req.body

    // validation
    if (!teamNo) {
        result.message = "Team Data Error"
        return res.status(400).json(result)
    }

    let sql = `SELECT TJ.*, M.userName FROM team_join AS TJ
                    JOIN member AS M
                    ON TJ.teamNo = ? AND TJ.status = ? AND TJ.userNo = M.userNo
                    `
    let params = [teamNo, teamJoinStatus.reject]
    db.query(sql, params, (err, results) => {
        if (err) {
            result.message = "Select Error"
            return res.status(500).json(result)
        }

        if (results) {
            result.success = true
            result.message = "Success"
            result.data = results
            return res.status(200).json(result)
        }
        else {
            result.message = "No Result"
            return res.status(200).json(result)
        }
    })
})

/* Update: 멤버리스트 방출 */
router.post('/releaseMemberList', (req, res) => {
    let result = { success: false, message: "" }

    const { teamJoinNo } = req.body

    // validation
    if (!teamJoinNo) {
        result.message = "Data Error"
        return res.status(400).json(result)
    }

    let updateSql = `UPDATE team_join SET status = ? WHERE teamJoinNo = ?`
    let params = [teamJoinStatus.reject, teamJoinNo]

    db.query(updateSql, params, (err, results) => {
        if (err) {
            result.message = "Update Error"
            return res.status(500).json(result)
        }

        result.success = true
        result.message = "Update successfully"
        return res.status(200).json(result)
    })
})

/* Update: 대기리스트 승인 */
router.post('/approveWaitingList', (req, res) => {
    let result = { success: false, message: "" }

    const { teamJoinNo } = req.body

    // validation
    if (!teamJoinNo) {
        result.message = "Data Error"
        return res.status(400).json(result)
    }

    let updateSql = `UPDATE team_join SET status = ? WHERE teamJoinNo = ?`
    let params = [teamJoinStatus.joined, teamJoinNo]

    db.query(updateSql, params, (err, results) => {
        if (err) {
            result.message = "Update Error"
            return res.status(500).json(result)
        }

        result.success = true
        result.message = "Update successfully"
        return res.status(200).json(result)
    })
})

/* Update: 대기리스트 거절 */
router.post('/rejectWaitingList', (req, res) => {
    let result = { success: false, message: "" }

    const { teamJoinNo } = req.body

    // validation
    if (!teamJoinNo) {
        result.message = "Data Error"
        return res.status(400).json(result)
    }

    let updateSql = `UPDATE team_join SET status = ? WHERE teamJoinNo = ?`
    let params = [teamJoinStatus.reject, teamJoinNo]

    db.query(updateSql, params, (err, results) => {
        if (err) {
            result.message = "Update Error"
            return res.status(500).json(result)
        }

        result.success = true
        result.message = "Update successfully"
        return res.status(200).json(result)
    })
})

/* Update: 거절리스트 승인 */
router.post('/approveRejectList', (req, res) => {
    let result = { success: false, message: "" }

    const { teamJoinNo } = req.body

    // validation
    if (!teamJoinNo) {
        result.message = "Data Error"
        return res.status(400).json(result)
    }

    let updateSql = `UPDATE team_join SET status = ? WHERE teamJoinNo = ?`
    let params = [teamJoinStatus.joined, teamJoinNo]

    db.query(updateSql, params, (err, results) => {
        if (err) {
            result.message = "Update Error"
            return res.status(500).json(result)
        }

        result.success = true
        result.message = "Update successfully"
        return res.status(200).json(result)
    })
})

/* 경기기록 불러오기 */
router.post('/getMyTeamRecord', (req, res) => {
    let result = { success: false, message: "" }

    const { teamNo } = req.body

    // validation
    if (!teamNo) {
        result.message = "Team Data Error"
        return res.status(400).json(result)
    }

    let sql = `SELECT * FROM team_record WHERE teamNo = ? ORDER BY teamRecordNo DESC`
    let params = [teamNo]
    db.query(sql, params, (err, results) => {
        if (err) {
            result.message = "Select Error"
            return res.status(500).json(result)
        }

        if (results) {
            result.success = true
            result.message = "Success"
            result.data = results
            return res.status(200).json(result)
        }
        else {
            result.message = "No Result"
            return res.status(200).json(result)
        }
    })
})

/* Update: 경기기록 저장 또는 수정 */
router.post('/saveTeamRecord', (req, res) => {
    let result = { success: false, message: "" }

    const { teamRecordNo, teamNo, opponentName, opponentScore, myScore } = req.body

    // validation
    if (!teamNo) {
        result.message = "Team Data Error"
        return res.status(400).json(result)
    }
    if (opponentName === '' || opponentScore === '' || myScore === '') {
        result.message = "Input Value Error"
        return res.status(400).json(result)
    }


    if (teamRecordNo) {
        // teamRecordNo이 있으면 update
        let updateSql = `UPDATE team_record 
        SET opponentName = ?, opponentScore = ?, myScore = ?
        WHERE teamRecordNo = ?`
        let params = [opponentName, opponentScore, myScore, teamRecordNo]

        db.query(updateSql, params, (err, results) => {
            if (err) {
                result.message = "Update Error"
                return res.status(500).json(result)
            }

            result.success = true
            result.message = "Update successfully"
            return res.status(200).json(result)
        })

    } else {
        // 없으면 insert
        let regDate = formatDate()
        let insertSql = `INSERT INTO team_record 
                    (teamNo, myScore, opponentScore, opponentName, regDate)
                    VALUES (?, ?, ?, ?, ?)`
        let insertParams = [teamNo, myScore, opponentScore, opponentName, regDate]

        db.query(insertSql, insertParams, (err, results) => {
            if (err) {
                result.message = "Update Error"
                return res.status(500).json(result)
            }

            if (results.affectedRows === 1) {
                let returnData = {
                    teamRecordNo: results.insertId,
                    teamNo,
                    myScore,
                    opponentScore,
                    opponentName,
                    regDate
                }
                result.data = returnData
                result.success = true
                result.message = "Insert successfully"
                return res.status(200).json(result)
            } else {
                result.success = false
                result.message = "Insert No affectedRows"
                return res.status(200).json(result)
            }
        })
    }
})

/* 경기기록 삭제 */
router.post('/deleteRecord', (req, res) => {
    let result = { success: false, message: "" }

    const { teamRecordNo } = req.body

    // validation
    if (!teamRecordNo) {
        result.message = "Team Data Error"
        return res.status(400).json(result)
    }

    let sql = `DELETE FROM team_record WHERE teamRecordNo = ?`
    let params = [teamRecordNo]

    db.query(sql, params, (err, results) => {
        if (err) {
            result.message = "Delete Error"
            return res.status(500).json(result)
        }

        if (results.affectedRows === 1) {
            result.success = true
            result.message = "Update successfully"
            return res.status(200).json(result)
        } else {
            result.message = "No Result"
            return res.status(400).json(result)
        }
    })
})

/* 팀삭제 */
router.post('/deleteMyTeam', (req, res) => {
    let result = { success: false, message: "" }

    const { teamNo, userNo, teamImgKey } = req.body

    // Validation
    if (!teamNo || !userNo) {
        result.message = "Data Error"
        return res.status(400).json(result)
    }

    // 1. userNo 권한 검사
    let checkUserSql = 'SELECT * FROM team_join WHERE teamNo = ? AND userNo = ? AND level = ?';
    let checkUserParams = [teamNo, userNo, teamMasterLevel]

    db.query(checkUserSql, checkUserParams, async (err, results) => {
        if (err) {
            result.message = "Check User Error"
            return res.status(500).json(result)
        }

        if (results.length === 1) {

            // 2. 권한검사 통과하면 삭제 진행
            // 2-1. team_record 삭제
            // 2-2. team_join 삭제
            // 2-3. team 삭제
            // 2-4. team테이블의 이미지 삭제

            try {

                // 트랜잭션 시작
                db.beginTransaction();

                // team_join 테이블에서 데이터 삭제
                db.execute('DELETE FROM team_join WHERE teamNo = ?', [teamNo]);

                // team_record 테이블에서 데이터 삭제
                db.execute('DELETE FROM team_record WHERE teamNo = ?', [teamNo]);

                // team 테이블에서 데이터 삭제
                db.execute('DELETE FROM team WHERE teamNo = ?', [teamNo]);

                // 이미지 삭제
                if (teamImgKey) {
                    const params = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: teamImgKey,
                    };

                    const command = new DeleteObjectCommand(params);
                    try {
                        const data = await s3.send(command);
                    } catch (err) {
                        throw new Error("Error deleting the image from S3");
                    }
                }

                db.commit();
                result.success = true;
                return res.status(200).json(result)

            } catch (error) {
                db.rollback();

                result.message = "Delete Error"
                return res.status(500).json(result)
            }

        } else {
            result.message = "Check User Fail"
            return res.status(400).json(result)
        }
    })

})

module.exports = router;

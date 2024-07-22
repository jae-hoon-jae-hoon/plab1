const express = require('express');
const router = express.Router();

// Database
const db = require('./../../db');
const { formatDate } = require('../../common');

// Library
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../../jwt');


router.get('/getStadium', (req, res) => {
    let result = { success: false, message: '' }

    let sql = "SELECT * FROM stadium"
    db.query(sql, (err, results) => {
        if (err) {
            // console.log(err);
            result.message = "DB Error"
            return res.status(500).json(result)
        }

        result.success = true;
        result.stadiums = results;
        return res.status(200).json(result)
    })
})

module.exports = router;
const db = require('../utils/db').pool
const jwt = require('jsonwebtoken')

const strUrl = (str) => {
    const resStr = str.replaceAll(' ', '-').toLowerCase()
    console.log(resStr);
    return resStr;
}

const getLevels = (req, res) => {
    const q = `SELECT * FROM levels WHERE is_verified = '1';`;
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        console.log(data.rows);
        return res.status(200).json(data.rows);
    })
}

module.exports = {
    getLevels
}
const db = require('../utils/db').pool
const jwt = require('jsonwebtoken')

const strUrl = (str) => {
    const resStr = str.replaceAll(' ', '-').toLowerCase()
    console.log(resStr);
    return resStr;
}

const pagination = (page, limit, responseData) => {
    const startIndex = (page - 1) * limit
    const lastIndex = (page) * limit

    const results = {}
    results.total = responseData.length;
    results.pageCount = Math.ceil(responseData.length / limit);

    if (lastIndex < responseData.length) {
        results.next = {
            page: page + 1,
        }
    }
    if (startIndex > 0) {
        results.prev = {
            page: page - 1,
        }
    }
    results.result = responseData.slice(startIndex, lastIndex);
    return results;
}

const getLevels = (req, res) => {
    const page = (req.query.page) ? parseInt(req.query.page) : 1;
    const limit = (req.query.limit) ? parseInt(req.query.limit) : 10;
    let q;
    if (req.query.query) {
        q = `SELECT l.id, l.name, sl_name, count(bl.id) as count FROM levels l JOIN bookLevel bl ON l.id=bl.level_id WHERE Lower(name) ILIKE '%${req.query.query}%' AND is_verified = '1' GROUP BY(l.id) ORDER BY COUNT(bl.id);`;
    } else {
        q = `SELECT l.id, l.name, sl_name, count(bl.id) as count FROM levels l JOIN bookLevel bl ON l.id=bl.level_id WHERE is_verified = '1' GROUP BY(l.id) ORDER BY COUNT(bl.id);`;
    }
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        const levels = data.rows;
        return res.status(200).json(pagination(page, limit, levels));
    })
}

module.exports = {
    getLevels
}
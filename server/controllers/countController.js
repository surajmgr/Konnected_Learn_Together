const db = require('../utils/db').pool
const jwt = require('jsonwebtoken')

const getStCount = (req, res) => {
    const topic_id = req.params.tid;
    const q = `SELECT COUNT(id) FROM subtopics WHERE topic=${topic_id};`
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json({ count: data.rows[0].count, tid: topic_id });
    })
}

const getNTCount = (req, res) => {
    const topic_id = req.params.tid;
    const q = `SELECT id FROM subtopics WHERE topic=${topic_id};`
    console.log('Topic ID: ' + topic_id);

    db.query(q, (err, data) => {
        if (err) throw err;
        const resData = data.rows;
        getData(resData).then(function (returnData) {
            res.json({ count: returnData, tid: topic_id })
            // console.log(returnData);
        }).catch(error => console.log(error));
    });

    async function getData(tickers) {
        var count = 0;
        for (let i = 0; i < tickers.length; i++) {
            count = count + await getTickerQuery(tickers[i].id);
        }
        return count;
    }

    function getTickerQuery(ticker) {
        return new Promise((resolve, reject) => {
            const id = ticker;
            db.query(`SELECT COUNT(id) FROM notes WHERE subtopic=${id};`, (err, data) => {
                if (err) throw reject(err);
                resolve(parseInt(data.rows[0].count));
            });
        })
    }
}

const getNTSCount = (req, res) => {
    const subtopic_id = req.params.stid;
    const q = `SELECT COUNT(id) FROM notes WHERE subtopic=${subtopic_id};`
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json({ count: data.rows[0].count, stid: subtopic_id });
    })
}

const getCCount = (req, res) => {
    const subtopic_id = req.params.stid;
    const q = `SELECT DISTINCT uid FROM notes WHERE subtopic=${subtopic_id};`
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json({ count: data.rows.length, stid: subtopic_id });
    })
}

const getNCCount = (req, res) => {
    const uid = req.params.uid;
    const q = `SELECT COUNT(id) FROM notes WHERE uid=${uid};`
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json({ count: data.rows[0].count, uid: uid });
    })
}

const getVCount = (req, res) => {
    const uid = req.query.uid;
    const aid = req.params.aid;
    const q = `SELECT COUNT(id) FROM votes WHERE answer=${aid} AND status='up';`
    console.log("UID Here!");
    console.log(uid);
    db.query(q, (err, data) => {
        if (err) return res.send({ upvote:0, downvote:0, status:'null', aid });
        const upvote = data.rows[0].count;
        const q = `SELECT COUNT(id) FROM votes WHERE answer=${aid} AND status='down';`
        db.query(q, (err, data) => {
            if (err) return res.send(err);
            const downvote = data.rows[0].count;
            const q = `SELECT status FROM votes WHERE answer=${aid} AND uid=${uid};`
            db.query(q, (err, data) => {
                if (err) return res.send(err);
                const status = (data.rows[0]) ? data.rows[0].status : "null";
                return res.json({ upvote, downvote, status, aid });
            })
        })
    })
}

const getQCount = (req, res) => {
    const tid = req.params.tid;
    const q = `SELECT COUNT(id) FROM questions WHERE topic=${tid};`
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json({ count: data.rows[0].count, tid: tid });
    })
}

const getACount = (req, res) => {
    const qid = req.params.qid;
    const q = `SELECT COUNT(id) FROM answers WHERE question=${qid};`
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json({ count: data.rows[0].count, qid: qid });
    })
}

const getBCount = (req, res) => {
    const lid = req.params.lid;
    const q = `SELECT COUNT(id) FROM bookLevel WHERE level_id=${lid};`
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json({ count: data.rows[0].count, lid: lid });
    })
}

module.exports = {
    getStCount,
    getNTCount,
    getNTSCount,
    getCCount,
    getNCCount,
    getVCount,
    getQCount,
    getACount,
    getBCount
}
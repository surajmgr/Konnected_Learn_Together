const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get Subtopic Count for a Topic
const getStCount = async (req, res) => {
    try {
        const topic_id = parseInt(req.params.tid);
        const count = await prisma.subtopic.count({
            where: { topicId: topic_id },
        });
        return res.json({ count, tid: topic_id });
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

// Get Notes Count for a Topic
const getNTCount = async (req, res) => {
    try {
        const topic_id = parseInt(req.params.tid);
        const subtopics = await prisma.subtopic.findMany({
            where: { topicId: topic_id },
            select: { id: true },
        });

        let count = 0;
        for (const subtopic of subtopics) {
            const noteCount = await prisma.note.count({
                where: { subtopicId: subtopic.id },
            });
            count += noteCount;
        }

        return res.json({ count, tid: topic_id });
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

// Get Notes Count for a Subtopic
const getNTSCount = async (req, res) => {
    try {
        const subtopic_id = parseInt(req.params.stid);
        const count = await prisma.note.count({
            where: { subtopicId: subtopic_id },
        });
        return res.json({ count, stid: subtopic_id });
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

// Get Unique Contributor Count for a Subtopic
const getCCount = async (req, res) => {
    try {
        const subtopic_id = parseInt(req.params.stid);
        const contributors = await prisma.note.groupBy({
            by: ['uid'],
            where: { subtopicId: subtopic_id },
        });
        return res.json({ count: contributors.length, stid: subtopic_id });
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

// Get Notes Count by a User
const getNCCount = async (req, res) => {
    try {
        const uid = parseInt(req.params.uid);
        const count = await prisma.note.count({
            where: { uid },
        });
        return res.json({ count, uid });
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

// Get Vote Count for an Answer
const getVCount = async (req, res) => {
    try {
        const aid = parseInt(req.params.aid);
        const uid = parseInt(req.query.uid);

        const upvote = await prisma.vote.count({
            where: { answerId: aid, status: 'up' },
        });

        const downvote = await prisma.vote.count({
            where: { answerId: aid, status: 'down' },
        });

        const userVote = await prisma.vote.findFirst({
            where: { answerId: aid, uid },
            select: { status: true },
        });

        const status = userVote ? userVote.status : 'null';
        return res.json({ upvote, downvote, status, aid });
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

// Get Questions Count for a Topic
const getQCount = async (req, res) => {
    try {
        const tid = parseInt(req.params.tid);
        const count = await prisma.question.count({
            where: { topicId: tid },
        });
        return res.json({ count, tid });
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

// Get Answers Count for a Question
const getACount = async (req, res) => {
    try {
        const qid = parseInt(req.params.qid);
        const count = await prisma.answer.count({
            where: { questionId: qid },
        });
        return res.json({ count, qid });
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

// Get Book Level Count
const getBCount = async (req, res) => {
    try {
        const lid = parseInt(req.params.lid);
        const count = await prisma.bookLevel.count({
            where: { levelId: lid },
        });
        return res.json({ count, lid });
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

module.exports = {
    getStCount,
    getNTCount,
    getNTSCount,
    getCCount,
    getNCCount,
    getVCount,
    getQCount,
    getACount,
    getBCount,
};








// const db = require('../utils/db').pool
// const jwt = require('jsonwebtoken')

// const getStCount = (req, res) => {
//     const topic_id = req.params.tid;
//     const q = `SELECT COUNT(id) FROM subtopics WHERE topic=${topic_id};`
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         return res.json({ count: data.rows[0].count, tid: topic_id });
//     })
// }

// const getNTCount = (req, res) => {
//     const topic_id = req.params.tid;
//     const q = `SELECT id FROM subtopics WHERE topic=${topic_id};`
//     console.log('Topic ID: ' + topic_id);

//     db.query(q, (err, data) => {
//         if (err) throw err;
//         const resData = data.rows;
//         getData(resData).then(function (returnData) {
//             res.json({ count: returnData, tid: topic_id })
//             // console.log(returnData);
//         }).catch(error => console.log(error));
//     });

//     async function getData(tickers) {
//         var count = 0;
//         for (let i = 0; i < tickers.length; i++) {
//             count = count + await getTickerQuery(tickers[i].id);
//         }
//         return count;
//     }

//     function getTickerQuery(ticker) {
//         return new Promise((resolve, reject) => {
//             const id = ticker;
//             db.query(`SELECT COUNT(id) FROM notes WHERE subtopic=${id};`, (err, data) => {
//                 if (err) throw reject(err);
//                 resolve(parseInt(data.rows[0].count));
//             });
//         })
//     }
// }

// const getNTSCount = (req, res) => {
//     const subtopic_id = req.params.stid;
//     const q = `SELECT COUNT(id) FROM notes WHERE subtopic=${subtopic_id};`
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         return res.json({ count: data.rows[0].count, stid: subtopic_id });
//     })
// }

// const getCCount = (req, res) => {
//     const subtopic_id = req.params.stid;
//     const q = `SELECT DISTINCT uid FROM notes WHERE subtopic=${subtopic_id};`
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         return res.json({ count: data.rows.length, stid: subtopic_id });
//     })
// }

// const getNCCount = (req, res) => {
//     const uid = req.params.uid;
//     const q = `SELECT COUNT(id) FROM notes WHERE uid=${uid};`
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         return res.json({ count: data.rows[0].count, uid: uid });
//     })
// }

// const getVCount = (req, res) => {
//     const uid = req.query.uid;
//     const aid = req.params.aid;
//     const q = `SELECT COUNT(id) FROM votes WHERE answer=${aid} AND status='up';`
//     console.log("UID Here!");
//     console.log(uid);
//     db.query(q, (err, data) => {
//         if (err) return res.send({ upvote:0, downvote:0, status:'null', aid });
//         const upvote = data.rows[0].count;
//         const q = `SELECT COUNT(id) FROM votes WHERE answer=${aid} AND status='down';`
//         db.query(q, (err, data) => {
//             if (err) return res.send(err);
//             const downvote = data.rows[0].count;
//             const q = `SELECT status FROM votes WHERE answer=${aid} AND uid=${uid};`
//             db.query(q, (err, data) => {
//                 if (err) return res.send(err);
//                 const status = (data.rows[0]) ? data.rows[0].status : "null";
//                 return res.json({ upvote, downvote, status, aid });
//             })
//         })
//     })
// }

// const getQCount = (req, res) => {
//     const tid = req.params.tid;
//     const q = `SELECT COUNT(id) FROM questions WHERE topic=${tid};`
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         return res.json({ count: data.rows[0].count, tid: tid });
//     })
// }

// const getACount = (req, res) => {
//     const qid = req.params.qid;
//     const q = `SELECT COUNT(id) FROM answers WHERE question=${qid};`
//     console.log(q);
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         return res.json({ count: data.rows[0].count, qid: qid });
//     })
// }

// const getBCount = (req, res) => {
//     const lid = req.params.lid;
//     const q = `SELECT COUNT(id) FROM bookLevel WHERE level_id=${lid};`
//     console.log(q);
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         return res.json({ count: data.rows[0].count, lid: lid });
//     })
// }

// module.exports = {
//     getStCount,
//     getNTCount,
//     getNTSCount,
//     getCCount,
//     getNCCount,
//     getVCount,
//     getQCount,
//     getACount,
//     getBCount
// }



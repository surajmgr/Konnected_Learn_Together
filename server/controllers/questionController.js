const db = require('../utils/db').pool
const jwt = require('jsonwebtoken')

const strUrl = (in_str) => {
    const str = in_str.replace(/[^a-zA-Z0-9 ]/g, '');
    const resStr = str.slice(0, 25).replaceAll(' ', '-').toLowerCase()
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

function getUnique(array, key) {
    if (typeof key !== "function") {
        const property = key;
        key = function (item) {
            return item[property];
        };
    }
    return Array.from(
        array
            .reduce(function (map, item) {
                const k = key(item);
                if (!map.has(k)) map.set(k, item);
                return map;
            }, new Map())
            .values()
    );
}

const getQuestions = (req, res) => {
    const tid = req.params.tid;
    const page = (req.query.page) ? parseInt(req.query.page) : 1;
    const limit = (req.query.limit) ? parseInt(req.query.limit) : 8;
    const q = `SELECT id as qid, title as qtitle, body as qbody, sq_name, uid as quid FROM questions WHERE topic=${tid};`;
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        const questions = data.rows;
        return res.json(pagination(page, limit, questions.reverse()));
    })
}

const getQuestion = (req, res) => {
    const qname = req.params.qname;
    const qid = req.params.qid;
    const q = `SELECT t.name as tname, t.id as tid, st_name, q.title as qtitle, q.id as qid, q.body as qbody
    FROM questions q JOIN topics t ON q.topic=t.id
    WHERE q.id=${qid};`

    // SELECT t.name as tname, t.id as tid, st_name, q.title as qtitle, q.id as qid, q.body as qbody FROM questions q JOIN topics t ON q.topic=t.id
    // WHERE q.id=6;

    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.status(200).json(data.rows[0]);
    })
}

const getAnswers = (req, res) => {
    const qid = req.params.qid;
    const page = (req.query.page) ? parseInt(req.query.page) : 1;
    const limit = (req.query.limit) ? parseInt(req.query.limit) : 5;
    const q = `SELECT a.id as aid, a.body as abody, a.question as qid, vote, a.uid as auid, a.date, u.username
    FROM answers a JOIN users u ON a.uid=u.id WHERE question=${qid} ORDER BY vote DESC;`
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        const answers = data.rows;
        return res.json(pagination(page, limit, answers));
    })
}

const updateVote = (req, res) => {
    const { aid, uid, changereq } = req.body;
    var q = "";
    console.log("Here is the vote!");
    if (changereq == "rmupvote") {
        q = `UPDATE votes SET status=null WHERE answer=${aid} AND uid=${uid};`
        db.query(q, (err, data) => {
            if (err) return res.send(err);
            const q = `UPDATE answers SET vote = vote - 1 WHERE id=${aid};`;
            db.query(q, (err, data) => {
                if (err) return res.send(err);
                return res.json("Removed Up Vote!");
            })
        })
    } else if (changereq == "rmdownvote") {
        q = `UPDATE votes SET status=null WHERE answer=${aid} AND uid=${uid};`
        db.query(q, (err, data) => {
            if (err) return res.send(err);
            const q = `UPDATE answers SET vote = vote + 1 WHERE id=${aid};`;
            db.query(q, (err, data) => {
                if (err) return res.send(err);
                return res.json("Removed Down Vote!");
            })
        })
    } else {
        q = `SELECT COUNT(id) FROM votes WHERE answer=${aid} AND uid=${uid};`
        db.query(q, (err, data) => {
            if (err) return res.send(err);
            if (data.rows[0].count == 0) {
                const q = `INSERT INTO votes(answer,uid,status) VALUES(${aid},${uid},'${changereq}');`
                console.log(q);
                db.query(q, (err, data) => {
                    if (err) return res.send(err);
                    if (changereq == "up") {
                        const q = `UPDATE answers SET vote = vote + 1 WHERE id=${aid};`;
                        db.query(q, (err, data) => {
                            if (err) return res.send(err);
                            return res.json("Added Vote!");
                        })
                    } else if (changereq == "down") {
                        const q = `UPDATE answers SET vote = vote - 1 WHERE id=${aid};`;
                        db.query(q, (err, data) => {
                            if (err) return res.send(err);
                            return res.json("Removed Vote!");
                        })
                    }
                })
            } else {
                const q = `UPDATE votes SET status='${changereq}' WHERE answer=${aid} AND uid=${uid};`
                db.query(q, (err, data) => {
                    if (err) return res.send(err);
                    if (changereq == "up") {
                        const q = `UPDATE answers SET vote = vote + 1 WHERE id=${aid};`;
                        db.query(q, (err, data) => {
                            if (err) return res.send(err);
                            return res.json("Updated Inc Vote!");
                        })
                    } else if (changereq == "down") {
                        const q = `UPDATE answers SET vote = vote - 1 WHERE id=${aid};`;
                        db.query(q, (err, data) => {
                            if (err) return res.send(err);
                            return res.json("Updated Dec Vote!");
                        })
                    }
                })
            }
        })
    }
}

const addQuestion = (req, res) => {
    // const sessionName = Object.values(req.sessionStore.sessions)[0];
    // const parsedJson = JSON.parse(sessionName);
    // const token = parsedJson.token;
    // console.log('token');
    // console.log(token);
    // if (!token) return res.status(401).json("Not Authenticated!");

    // jwt.verify(token, "jwtkey", (err, userInfo) => {
        // if (err) return res.status(403).json("Token is not valid!");
        const sq_name = strUrl(req.body.title)

        const o_content = req.body.content ? req.body.content : ""
        const content = o_content.replaceAll("'", "''")

        const q = `INSERT INTO questions(title,body,sq_name,topic,uid,date) VALUES 
        ('${req.body.title.replaceAll("'", "''")}', '${content}','${sq_name}',${req.body.topic},${req.body.uid},'${req.body.date}') 
        RETURNING id;`
        console.log(q);

        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err.message);
            const qid = data.rows[0].id;
            const link = `/question/${sq_name}/${qid}`
            const q = `INSERT INTO notifications(content,link,uid,read) VALUES 
        ('You have asked a question, [${req.body.title.replaceAll("'", "''")}].',
        '${link}',${req.body.uid},'1');`
            db.query(q, (err, data) => {
                if (err) return res.status(500).json(err.message);
                return res.json("Question created with notif!");
            })
        })
    // });
}

const deleteQuestion = (req, res) => {

    // const token = req.session.token;
    // console.log(token);
    // if (!token) return res.status(401).json("Not Authenticated!");

    // jwt.verify(token, "jwtkey", (err, userInfo) => {
    //     if (err) return res.status(403).json("Token is not valid!");

        const qid = req.params.id;
        const q = `DELETE FROM questions WHERE id = '${qid}' AND uid = '${req.body.uid}';`
        console.log(q);
        db.query(q, (err, data) => {
            if (err) return res.status(403).json("You can not delete this Question.");
            if (data.rowCount == 0) return res.status(403).json("Failed to execute.");
            return res.json("Question has been deleted!");
        })
    // })
}

const updateQuestion = (req, res) => {
    // const token = req.session.token;
    // console.log(token);
    // if (!token) return res.status(401).json("Not Authenticated!");

    // jwt.verify(token, "jwtkey", (err, userInfo) => {
    //     if (err) return res.status(403).json("Token is not valid!");
        const qid = req.params.id;
        const q = `UPDATE questions SET title='${req.body.title.replaceAll("'", "''")}', 
    body='${req.body.content.replaceAll("'", "''")}', 
    topic=${req.body.topic} WHERE id=${qid};`
    //  AND uid=${req.body.id};`
        console.log(q);
        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err.message);
            return res.json("Question has been updated!");
        })
    // })
}

const addAnswer = (req, res) => {
    // const token = req.session.token;
    // console.log(token);
    // if (!token) return res.status(401).json("Not Authenticated!");

    // jwt.verify(token, "jwtkey", (err, userInfo) => {
    //     if (err) return res.status(403).json("Token is not valid!");
        const o_content = req.body.content ? req.body.content : ""
        const content = o_content.replaceAll("'", "''")
        const link = `/question/${req.body.sq_name}/${req.body.question}`

        const q = `INSERT INTO answers(body,question,vote,uid,date) VALUES 
    ('${content}',${req.body.question},0,${req.body.uid},'${req.body.date}');`

        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err.message);
            const q = `SELECT DISTINCT(q.uid) as quid, q.title as qtitle FROM 
            questions q JOIN answers a ON a.question=q.id WHERE 
            a.question=${req.body.question};`
            console.log(q);
            db.query(q, (err, data) => {
                if (err) return res.status(500).json(err.message);
                const qtitle = data.rows[0]?.qtitle.replaceAll("'", "''");
                const quid = data.rows[0]?.quid;
                if (req.body.uid == quid) {
                    const q = `INSERT INTO notifications(content,link,uid,read) VALUES 
                ('You have answered your own question [${qtitle}].',
                '${link}',${quid},'1');`
                    console.log(q);
                    db.query(q, (err, data) => {
                        if (err) return res.status(500).json(err.message);
                        return res.json("Answer created with notif!");
                    })
                } else {
                    const q = `INSERT INTO notifications(content,link,uid,read) VALUES 
                ('Someone has answered your question [${qtitle}].',
                '${link}',${quid},'0');`
                    console.log(q);
                    db.query(q, (err, data) => {
                        if (err) return res.status(500).json(err.message);
                        const q = `INSERT INTO notifications(content,link,uid,read) VALUES 
                    ('You have answered  question [${qtitle}].',
                    '${link}',${req.body.uid},'1');`
                        console.log(q);
                        db.query(q, (err, data) => {
                            if (err) return res.status(500).json(err.message);
                            return res.json("Answer created with notif!");
                        })
                    })
                }
            })
        })
    // })
}

const deleteAnswer = (req, res) => {
    // const token = req.session.token;
    // console.log(token);
    // if (!token) return res.status(401).json("Not Authenticated!");

    // jwt.verify(token, "jwtkey", (err, userInfo) => {
    //     if (err) return res.status(403).json("Token is not valid!");

        const aid = req.params.id;
        const q = `DELETE FROM answers WHERE id = '${aid}';` 
        // AND uid = '${userInfo.id}';`
        console.log(q);
        db.query(q, (err, data) => {
            if (err) return res.status(403).json("You can not delete this Answer.");
            if (data.rowCount == 0) return res.status(403).json("Failed to execute.");
            return res.json("Question has been deleted!");
        })
    // })
}

const updateAnswer = (req, res) => {
    // const token = req.session.token;
    // console.log(token);
    // if (!token) return res.status(401).json("Not Authenticated!");

    // jwt.verify(token, "jwtkey", (err, userInfo) => {
    //     if (err) return res.status(403).json("Token is not valid!");
        const aid = req.params.id;
        const q = `UPDATE answers SET
    body='${req.body.content.replaceAll("'", "''")}', 
    question=${req.body.question} WHERE id=${aid} AND uid=${req.body.uid};`
        console.log(q);
        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err.message);
            return res.json("Question has been updated!");
        })
    // })
}

module.exports = {
    getQuestions,
    getQuestion,
    getAnswers,
    updateVote,
    addQuestion,
    deleteQuestion,
    updateQuestion,
    addAnswer,
    deleteAnswer,
    updateAnswer
}
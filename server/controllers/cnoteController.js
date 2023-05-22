const db = require('../utils/db').pool
const jwt = require('jsonwebtoken');

const strUrl = (in_str) => {
    const str = in_str.replace(/[^a-zA-Z0-9 ]/g, '');
    const resStr = str.slice(0, 25).replaceAll(' ', '-').toLowerCase()
    console.log(resStr);
    return resStr;
}

const addNote = (req, res) => {
    // const token = req.session.token;
    // console.log('token');
    // console.log(token);
    // if (!token) return res.status(401).json("Not Authenticated!");

    // jwt.verify(token, "jwtkey", (err, userInfo) => {
    // if (err) return res.status(403).json("Token is not valid!");
    const sst_name = strUrl(req.body.title)

    const o_content = req.body.content
    const content = o_content.replaceAll("'", "''")

    const q = `INSERT INTO notes (name,body,sst_name,subtopic,uid,date) VALUES ('${req.body.title.replaceAll("'", "''")}','${content}','${sst_name}',${req.body.subtopic},${req.body.uid},'${req.body.date}') RETURNING id;`
    console.log(q);

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        const note_id = data.rows[0].id;

        const q = `SELECT t.st_name, st.sst_name, st.topic as tid, st.id as stid 
        FROM subtopics st JOIN topics t ON t.id=st.topic WHERE st.id=${req.body.subtopic};`

        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err.message);
            const { st_name, sst_name, tid, stid } = data.rows[0];
            const link = `/subtopic/${st_name}/${sst_name}/${stid}/${tid}?nid=${note_id}`
            const q = `INSERT INTO notifications(content,link,uid,read) VALUES 
            ('You have contributed a new note [${req.body.title.replaceAll("'", "''")}].',
            '${link}',${req.body.uid},'1');`
            db.query(q, (err, data) => {
                if (err) return res.status(500).json(err.message);
                return res.json("Note created with notif!");
            })
        })
    })
    // });
}

const deleteNote = (req, res) => {
    // const token = req.session.token;
    // console.log('token');
    // console.log(token);
    // if (!token) return res.status(401).json("Not Authenticated!");

    // jwt.verify(token, "jwtkey", (err, userInfo) => {
    //     if (err) return res.status(403).json("Token is not valid!");

        const NoteId = req.params.id;
        const q = `DELETE FROM Notes WHERE id = '${NoteId}';`
        console.log(q);
        db.query(q, (err, data) => {
            if (err) return res.status(403).json("You can not delete this Note.");
            return res.json("Note has been deleted!");
        })
    // })
}

const updateNote = (req, res) => {
    // const token = req.session.token;
    // console.log('token');
    // console.log(token);
    // if (!token) return res.status(401).json("Not Authenticated!");

    // jwt.verify(token, "jwtkey", (err, userInfo) => {
    // if (err) return res.status(403).json("Token is not valid!");

    const NoteId = req.params.id;
    const q = `UPDATE notes SET name='${req.body.title.replaceAll("'", "''")}', body='${req.body.content.replaceAll("'", "''")}', subtopic=${req.body.subtopic} WHERE id=${NoteId} AND uid=${req.body.uid};`
    console.log(q);

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        return res.json("Note has been updated!");
    })
    // });
}

module.exports = {
    addNote,
    deleteNote,
    updateNote
}
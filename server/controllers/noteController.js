const db = require('../utils/db').pool
const jwt = require('jsonwebtoken')

const strUrl = (str) => {
    const resStr = str.replaceAll(' ', '-').toLowerCase()
    console.log(resStr);
    return resStr;
}

const getAllNotes = (req,res) => {
    const q = `SELECT n.name as nname, n.id as nid, st.name as stname, st.id as stid, * 
    FROM notes n JOIN subtopics st ON n.subtopic=st.id;`;
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        console.log(data.rows);
        return res.status(200).json(data.rows);
    })
}

const getNotes = (req, res) => {
    console.log(req.session.token);
    console.log('Id is here');
    const q = `SELECT n.name as nname, n.id as nid, st.name as stname, st.id as stid, uid, username, u.name as byname, * 
    FROM notes n JOIN subtopics st ON n.subtopic=st.id JOIN users u ON n.uid=u.id
    WHERE st.id='${req.params.stid}';`;
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        console.log(data.rows);
        return res.status(200).json(data.rows);
    })
}

const getDisplayNote = (req, res) => {
    const q = req.query.nid ? `SELECT n.name as nname, n.id as nid, st.name as stname, st.id as stid, body, st.sst_name, subtopic, uid, topic, username, u.phone as phone, u.name as byname, avatar
    FROM notes n JOIN subtopics st ON n.subtopic=st.id JOIN users u ON n.uid=u.id
    WHERE st.id='${req.params.stid}' AND n.id=${req.query.nid};`
    : `SELECT n.name as nname, n.id as nid, st.name as stname, st.id as stid, body, st.sst_name, subtopic, uid, topic, username, u.phone as phone, u.name as byname, avatar
    FROM notes n JOIN subtopics st ON n.subtopic=st.id JOIN users u ON n.uid=u.id
    WHERE st.id='${req.params.stid}' ORDER BY n.id ASC LIMIT 1;`;
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        console.log(data.rows);
        return res.status(200).json(data.rows);
    })
}

const getNote = (req, res) => {
    console.log("Here is get topic by name");
    const q = `SELECT n.name as nname, n.id as nid, st.name as stname, st.id as stid, * 
    FROM notes n JOIN subtopics st ON n.subtopic=st.id
    WHERE n.sn_name ILIKE '${req.params.name}' AND n.id=${req.params.id};`
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        console.log(data.rows);
        return res.status(200).json(data.rows);
    })
}

const addNote = (req, res) => {
    const {...topicInfo} = req.body.objects[0];
    console.log(topicInfo);
    const {...bookDetails} = req.body.objects[1];
    const {...Notes} = req.body.objects[2];
    console.log(bookDetails);
    console.log(Notes)
}

const uploadImage = (req, res) => {
    console.log(req.blobinfo);
}

module.exports = {
    getAllNotes,
    getNotes,
    getDisplayNote,
    getNote,
    addNote,
    uploadImage
}
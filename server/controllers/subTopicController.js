const db = require('../utils/db').pool
const jwt = require('jsonwebtoken')

const strUrl = (str) => {
    const resStr = str.replaceAll(' ', '-').toLowerCase()
    console.log(resStr);
    return resStr;
}

const getAllSubTopics = (req,res) => {
    const q = `SELECT t.name as tname, t.id as tid, st.name as stname, st.id as stid, * 
    FROM topics t JOIN subtopics st ON t.id=st.topic;`;
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        console.log(data.rows);
        return res.status(200).json(data.rows);
    })
}

const getSubTopics = (req, res) => {
    const q = `SELECT t.name as tname, t.id as tid, st.name as stname, st.id as stid, * 
    FROM topics t JOIN subtopics st ON t.id=st.topic
    WHERE t.id='${req.params.tid}';`;
    // console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        // console.log(data.rows);
        return res.status(200).json(data.rows);
    })
}

const getSubTopic = (req, res) => {
    const q = `SELECT t.name as tname, t.id as tid, st.name as stname, st.id as stid, * 
    FROM subtopics st JOIN topics t ON st.topic=t.id
    WHERE t.st_name='${req.params.tname}' AND st.sst_name ILIKE '${req.params.name}' AND st.id=${req.params.id};`
    // console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        // console.log(data.rows);
        return res.status(200).json(data.rows);
    })
}

const addSubTopic = (req, res) => {
    const {...topicInfo} = req.body.objects[0];
    console.log(topicInfo);
    const {...bookDetails} = req.body.objects[1];
    const {...subTopics} = req.body.objects[2];
    console.log(bookDetails);
    console.log(subTopics)
}

module.exports = {
    getAllSubTopics,
    getSubTopics,
    getSubTopic,
    addSubTopic
}
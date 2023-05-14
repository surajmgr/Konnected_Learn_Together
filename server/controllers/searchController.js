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

const getQuery = (req, res) => {
    const searchTerm = req.query.query;
    const page = (req.query.page) ? parseInt(req.query.page) : 1;
    const limit = (req.query.limit) ? parseInt(req.query.limit) : 2;
    const cat = req.query.cat;

    if (cat == 'topic') {
        const topicQuery = `SELECT name as topic_name, id as tid, st_name  FROM topics WHERE Lower(name) LIKE '%${searchTerm}%';`
        console.log(topicQuery)
        db.query(topicQuery, (err, data) => {
            if (err) return res.send(err);
            const topics = data.rows;
            return res.json(pagination(page, limit, topics.slice(0).reverse()));
        })
    }

    if (cat == 'subtopic') {
        const subtopicQuery = `SELECT st.name as subtopic_name, st.sst_name, st.topic as tid, st.id as stid, t.st_name
        FROM subtopics st JOIN topics t ON t.id=st.topic WHERE Lower(st.name) LIKE '%${searchTerm}%';`
        db.query(subtopicQuery, (err, data) => {
            if (err) return res.send(err);
            const subtopics = data.rows;
            return res.json(pagination(page, limit, subtopics.slice(0).reverse()));
        })
    }

    if (cat == 'book') {
        const bookQuery = `SELECT b.name as bname, b.cover as coverimg, l.name as lname, b.id as bid, l.id as lid, * 
        FROM books b JOIN bookLevel bl ON b.id=bl.book_id JOIN levels l ON l.id=bl.level_id 
        WHERE Lower(b.name) LIKE '%${searchTerm}%' AND b.is_verified='1';`
        db.query(bookQuery, (err, data) => {
            if (err) return res.send(err);
            const books = data.rows;
            return res.json(pagination(page, limit, getUnique(books, 'bid').slice(0).reverse()));
        })
    }
}

module.exports = {
    getQuery
}
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const strUrl = (str) => {
    const resStr = str.replaceAll(' ', '-').toLowerCase();
    console.log(resStr);
    return resStr;
};

const pagination = (page, limit, responseData) => {
    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;

    const results = {};
    results.total = responseData.length;
    results.pageCount = Math.ceil(responseData.length / limit);

    if (lastIndex < responseData.length) {
        results.next = { page: page + 1 };
    }
    if (startIndex > 0) {
        results.prev = { page: page - 1 };
    }
    results.result = responseData.slice(startIndex, lastIndex);
    return results;
};

function getUnique(array, key) {
    if (typeof key !== "function") {
        const property = key;
        key = function (item) {
            return item[property];
        };
    }
    return Array.from(
        array
            .reduce((map, item) => {
                const k = key(item);
                if (!map.has(k)) map.set(k, item);
                return map;
            }, new Map())
            .values()
    );
}

const getQuery = async (req, res) => {
    const searchTerm = req.query.query.toLowerCase();
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 2;
    const cat = req.query.cat;

    try {
        if (cat === 'topic') {
            const topics = await prisma.topics.findMany({
                where: {
                    name: { contains: searchTerm, mode: 'insensitive' },
                },
                select: { name: true, id: true, st_name: true },
            });
            return res.json(pagination(page, limit, topics.reverse()));
        }

        if (cat === 'subtopic') {
            const subtopics = await prisma.subtopics.findMany({
                where: {
                    name: { contains: searchTerm, mode: 'insensitive' },
                },
                include: {
                    topic: {
                        select: { st_name: true },
                    },
                },
            });
            const formattedSubtopics = subtopics.map((st) => ({
                subtopic_name: st.name,
                sst_name: st.sst_name,
                tid: st.topicId,
                stid: st.id,
                st_name: st.topic?.st_name,
            }));
            return res.json(pagination(page, limit, formattedSubtopics.reverse()));
        }

        if (cat === 'book') {
            const books = await prisma.books.findMany({
                where: {
                    name: { contains: searchTerm, mode: 'insensitive' },
                    is_verified: '1',
                },
                include: {
                    bookLevel: {
                        include: { level: true },
                    },
                },
            });
            const formattedBooks = books.map((book) => ({
                bname: book.name,
                coverimg: book.cover,
                bid: book.id,
                lname: book.bookLevel[0]?.level?.name,
                lid: book.bookLevel[0]?.level?.id,
            }));
            return res.json(pagination(page, limit, getUnique(formattedBooks, 'bid').reverse()));
        }

        if (cat === 'question') {
            const questions = await prisma.questions.findMany({
                where: {
                    title: { contains: searchTerm, mode: 'insensitive' },
                },
                select: {
                    id: true,
                    title: true,
                    body: true,
                    sq_name: true,
                    uid: true,
                },
            });
            return res.json(pagination(page, limit, questions.reverse()));
        }

        return res.status(400).json({ error: "Invalid category specified" });
    } catch (error) {
        console.error('Error in getQuery:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getQuery,
};




// const db = require('../utils/db').pool
// const jwt = require('jsonwebtoken')

// const strUrl = (str) => {
//     const resStr = str.replaceAll(' ', '-').toLowerCase()
//     console.log(resStr);
//     return resStr;
// }

// const pagination = (page, limit, responseData) => {
//     const startIndex = (page - 1) * limit
//     const lastIndex = (page) * limit

//     const results = {}
//     results.total = responseData.length;
//     results.pageCount = Math.ceil(responseData.length / limit);

//     if (lastIndex < responseData.length) {
//         results.next = {
//             page: page + 1,
//         }
//     }
//     if (startIndex > 0) {
//         results.prev = {
//             page: page - 1,
//         }
//     }
//     results.result = responseData.slice(startIndex, lastIndex);
//     return results;
// }

// function getUnique(array, key) {
//     if (typeof key !== "function") {
//         const property = key;
//         key = function (item) {
//             return item[property];
//         };
//     }
//     return Array.from(
//         array
//             .reduce(function (map, item) {
//                 const k = key(item);
//                 if (!map.has(k)) map.set(k, item);
//                 return map;
//             }, new Map())
//             .values()
//     );
// }

// const getQuery = (req, res) => {
//     const searchTerm = req.query.query;
//     const page = (req.query.page) ? parseInt(req.query.page) : 1;
//     const limit = (req.query.limit) ? parseInt(req.query.limit) : 2;
//     const cat = req.query.cat;

//     if (cat == 'topic') {
//         const topicQuery = `SELECT name as topic_name, id as tid, st_name  FROM topics WHERE Lower(name) ILIKE '%${searchTerm}%';`
//         console.log(topicQuery)
//         db.query(topicQuery, (err, data) => {
//             if (err) return res.send(err);
//             const topics = data.rows;
//             return res.json(pagination(page, limit, topics.slice(0).reverse()));
//         })
//     }

//     if (cat == 'subtopic') {
//         const subtopicQuery = `SELECT st.name as subtopic_name, st.sst_name, st.topic as tid, st.id as stid, t.st_name
//         FROM subtopics st JOIN topics t ON t.id=st.topic WHERE Lower(st.name) ILIKE '%${searchTerm}%';`
//         db.query(subtopicQuery, (err, data) => {
//             if (err) return res.send(err);
//             const subtopics = data.rows;
//             return res.json(pagination(page, limit, subtopics.slice(0).reverse()));
//         })
//     }

//     if (cat == 'book') {
//         const bookQuery = `SELECT b.name as bname, b.cover as coverimg, l.name as lname, b.id as bid, l.id as lid, * 
//         FROM books b JOIN bookLevel bl ON b.id=bl.book_id JOIN levels l ON l.id=bl.level_id 
//         WHERE Lower(b.name) ILIKE '%${searchTerm}%' AND b.is_verified='1';`
//         db.query(bookQuery, (err, data) => {
//             if (err) return res.send(err);
//             const books = data.rows;
//             return res.json(pagination(page, limit, getUnique(books, 'bid').slice(0).reverse()));
//         })
//     }

//     if (cat == 'question') {
//         const questionQuery = `SELECT id as qid, title as qtitle, body as qbody, sq_name, uid as quid FROM questions WHERE Lower(title) ILIKE '%${searchTerm}%';`
//         db.query(questionQuery, (err, data) => {
//             if (err) return res.send(err);
//             const subtopics = data.rows;
//             return res.json(pagination(page, limit, subtopics.slice(0).reverse()));
//         })
//     }
// }

// module.exports = {
//     getQuery
// }
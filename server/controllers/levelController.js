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

const getLevels = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;

        if (req.query.all === 'true') {
            const levels = await prisma.level.findMany({
                where: { is_verified: true },
                orderBy: { id: 'asc' },
                select: { id: true, name: true, sl_name: true },
            });

            return res.status(200).json({
                total: levels.length,
                result: levels,
            });
        } else {
            let levels;

            if (req.query.query) {
                const searchQuery = req.query.query.toLowerCase();

                levels = await prisma.level.findMany({
                    where: {
                        is_verified: true,
                        name: { contains: searchQuery, mode: 'insensitive' },
                    },
                    include: {
                        bookLevel: {
                            select: { id: true },
                        },
                    },
                    orderBy: { bookLevel: { _count: 'desc' } },
                });
            } else {
                levels = await prisma.level.findMany({
                    where: { is_verified: true },
                    include: {
                        bookLevel: {
                            select: { id: true },
                        },
                    },
                    orderBy: { bookLevel: { _count: 'desc' } },
                });
            }

            const levelsWithCount = levels.map((level) => ({
                id: level.id,
                name: level.name,
                sl_name: level.sl_name,
                count: level.bookLevel.length,
            }));

            return res.status(200).json(pagination(page, limit, levelsWithCount));
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

module.exports = {
    getLevels,
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

// const getLevels = (req, res) => {
//     const page = (req.query.page) ? parseInt(req.query.page) : 1;
//     const limit = (req.query.limit) ? parseInt(req.query.limit) : 10;
//     let q;
//     if (req.query.all == 'true') {
//         q = `SELECT id, name, sl_name FROM levels WHERE is_verified = '1' ORDER BY id;`;
//         console.log(q);
//         db.query(q, (err, data) => {
//             if (err) return res.send(err);
//             const levels = data.rows;
//             return res.status(200).json({
//                 total: levels.length,
//                 result: levels
//             });
//         })
//     } else {
//         if (req.query.query) {
//             q = `SELECT l.id, l.name, sl_name, count(bl.id) as count FROM levels l JOIN bookLevel bl ON l.id=bl.level_id WHERE Lower(name) ILIKE '%${req.query.query}%' AND is_verified = '1' GROUP BY(l.id) ORDER BY COUNT(bl.id);`;
//         } else {
//             q = `SELECT l.id, l.name, sl_name, count(bl.id) as count FROM levels l JOIN bookLevel bl ON l.id=bl.level_id WHERE is_verified = '1' GROUP BY(l.id) ORDER BY COUNT(bl.id);`;
//         }
//         db.query(q, (err, data) => {
//             if (err) return res.send(err);
//             const levels = data.rows;
//             return res.status(200).json(pagination(page, limit, levels));
//         })
//     }
// }

// module.exports = {
//     getLevels
// }
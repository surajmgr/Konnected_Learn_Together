const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const strUrl = (str) => {
    const resStr = str.replaceAll(' ', '-').toLowerCase();
    console.log(resStr);
    return resStr;
};

const getAllNotes = async (req, res) => {
    try {
        const notes = await prisma.note.findMany({
            include: {
                subtopic: {
                    select: { name: true, id: true },
                },
            },
        });

        const result = notes.map((note) => ({
            nname: note.name,
            nid: note.id,
            stname: note.subtopic.name,
            stid: note.subtopic.id,
            ...note,
        }));

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

const getNotes = async (req, res) => {
    const { stid } = req.params;

    try {
        const notes = await prisma.note.findMany({
            where: { subtopicId: parseInt(stid) },
            include: {
                subtopic: { select: { name: true, id: true } },
                user: { select: { id: true, username: true, name: true } },
            },
        });

        const result = notes.map((note) => ({
            nname: note.name,
            nid: note.id,
            stname: note.subtopic.name,
            stid: note.subtopic.id,
            uid: note.user.id,
            username: note.user.username,
            byname: note.user.name,
            ...note,
        }));

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

const purchaseNote = async (req, res) => {
    const { note_id, user_id } = req.body;

    try {
        const note = await prisma.note.findUnique({ where: { id: note_id } });

        if (!note.is_locked) {
            return res.status(409).json({ message: 'Note is not locked' });
        }

        const alreadyPurchased = await prisma.purchasedNote.findFirst({
            where: { noteId: note_id, userId: user_id },
        });

        if (alreadyPurchased) {
            return res.status(409).json({ message: 'Note already purchased' });
        }

        const user = await prisma.user.findUnique({ where: { id: user_id } });

        if (user.coins < note.amount) {
            return res.status(402).json({ message: 'Insufficient balance' });
        }

        await prisma.user.update({
            where: { id: user_id },
            data: { coins: user.coins - note.amount },
        });

        await prisma.purchasedNote.create({
            data: { noteId: note_id, userId: user_id },
        });

        res.status(200).json({ message: 'Note purchased successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

const purchaseNotes = async (req, res) => {
    const { noteIds, user_id, amount } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: user_id } });

        if (user.coins < amount) {
            return res.status(402).json({ message: 'Insufficient balance' });
        }

        for (const note_id of noteIds) {
            const note = await prisma.note.findUnique({ where: { id: note_id } });

            if (!note.is_locked) {
                return res.status(409).json({ message: `Note ${note_id} is not locked` });
            }

            const alreadyPurchased = await prisma.purchasedNote.findFirst({
                where: { noteId: note_id, userId: user_id },
            });

            if (!alreadyPurchased) {
                await prisma.purchasedNote.create({
                    data: { noteId: note_id, userId: user_id },
                });
            }
        }

        await prisma.user.update({
            where: { id: user_id },
            data: { coins: user.coins - amount },
        });

        res.status(200).json({ message: 'Notes purchased successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

const getDisplayNote = async (req, res) => {
    const { nid, uid } = req.query;
    const { stid } = req.params;

    try {
        const note = await prisma.note.findFirst({
            where: {
                subtopicId: parseInt(stid),
                id: nid ? parseInt(nid) : undefined,
            },
            include: {
                subtopic: { select: { name: true, sst_name: true } },
                user: { select: { name: true, username: true, phone: true, avatar: true } },
            },
        });

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.is_locked) {
            const purchased = uid
                ? await prisma.purchasedNote.findFirst({
                      where: { noteId: note.id, userId: parseInt(uid) },
                  })
                : null;

            if (!purchased) {
                note.body = 'This note is locked. Please purchase to unlock.';
                return res.status(401).json({
                    loggedIn: !!uid,
                    message: 'Note is locked. Please purchase to unlock.',
                    note,
                });
            }
        }

        res.status(200).json(note);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// Define other functions (addNote, getNote, etc.) similarly using Prisma...

module.exports = {
    getAllNotes,
    getNotes,
    getDisplayNote,
    purchaseNote,
    purchaseNotes,
};







// const db = require('../utils/db').pool
// const jwt = require('jsonwebtoken')

// const strUrl = (str) => {
//     const resStr = str.replaceAll(' ', '-').toLowerCase()
//     console.log(resStr);
//     return resStr;
// }

// const getAllNotes = (req, res) => {
//     const q = `SELECT n.name as nname, n.id as nid, st.name as stname, st.id as stid, * 
//     FROM notes n JOIN subtopics st ON n.subtopic=st.id;`;
//     console.log(q);
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         return res.status(200).json(data.rows);
//     })
// }

// const getNotes = (req, res) => {
//     const q = `SELECT n.name as nname, n.id as nid, st.name as stname, st.id as stid, uid, username, u.name as byname, * 
//     FROM notes n JOIN subtopics st ON n.subtopic=st.id JOIN users u ON n.uid=u.id
//     WHERE st.id='${req.params.stid}';`;
//     console.log(q);
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         return res.status(200).json(data.rows);
//     })
// }

// const puchaseNote = (req, res) => {
//     const { note_id, user_id } = req.body;

//     // check if note is locked or not
//     const q = `SELECT * FROM notes WHERE id=${note_id};`;
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         const note_amount = data.rows[0].amount;
//         if (!data.rows[0].is_locked) {
//             return res.status(409).json({ message: 'Note is not locked' });
//         } else {
//             // check if note is already purchased
//             const q = `SELECT * FROM purchased_notes WHERE note_id=${note_id} AND user_id=${user_id};`;
//             db.query(q, (err, data) => {
//                 if (err) return res.send(err);
//                 if (data.rows.length > 0) {
//                     return res.status(409).json({ message: 'Note already purchased' });
//                 } else {
//                     // check if user has enough balance
//                     const q = `SELECT id, username, coins FROM users WHERE id=${user_id};`;
//                     db.query(q, (err, data) => {
//                         if (err) return res.send(err);
//                         const user_coins = data.rows[0].coins;
//                         if (user_coins < note_amount) {
//                             return res.status(402).json({ message: 'Insufficient balance' });
//                         } else {
//                             // deduct note amount from user balance
//                             const new_balance = user_coins - note_amount;
//                             const q = `UPDATE users SET coins='${new_balance}' WHERE id=${user_id};`;
//                             db.query(q, (err, data) => {
//                                 if (err) return res.send(err);
//                                 // add note to purchased notes
//                                 const q = `INSERT INTO purchased_notes (note_id, user_id) VALUES (${note_id}, ${user_id});`;
//                                 db.query(q, (err, data) => {
//                                     if (err) return res.send(err);
//                                     return res.status(200).json({ message: 'Note purchased successfully' });
//                                 })
//                             })
//                         }
//                     })
//                 }
//             })
//         }
//     })
// }

// const puchaseNotes = (req, res) => {
//     const { noteIds, user_id, amount } = req.body;

//     const q = `SELECT id, username, coins FROM users WHERE id=${user_id};`;
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         const user_coins = data.rows[0].coins;

//         if (user_coins < amount) {
//             return res.status(402).json({ message: 'Insufficient balance' });
//         } else {
//             // for note issue purchase
//             noteIds.forEach(note_id => {
//                 // check if note is locked or not
//                 const q = `SELECT * FROM notes WHERE id=${note_id};`;
//                 db.query(q, (err, data) => {
//                     if (err) return res.send(err);
//                     const note_amount = data.rows[0].amount;
//                     if (!data.rows[0].is_locked) {
//                         return res.status(409).json({ message: 'Note is not locked' });
//                     } else {
//                         // check if note is already purchased
//                         const q = `SELECT * FROM purchased_notes WHERE note_id=${note_id} AND user_id=${user_id};`;
//                         db.query(q, (err, data) => {
//                             if (err) return res.send(err);
//                             if (data.rows.length > 0) {
//                                 return res.status(409).json({ message: 'Note already purchased' });
//                             } else {
//                                 // check if user has enough balance
//                                 const q = `SELECT id, username, coins FROM users WHERE id=${user_id};`;
//                                 db.query(q, (err, data) => {
//                                     if (err) return res.send(err);
//                                     const user_coins = data.rows[0].coins;
//                                     if (user_coins < note_amount) {
//                                         return res.status(402).json({ message: 'Insufficient balance' });
//                                     } else {
//                                         // deduct note amount from user balance
//                                         const new_balance = user_coins - note_amount;
//                                         const q = `UPDATE users SET coins='${new_balance}' WHERE id=${user_id};`;
//                                         db.query(q, (err, data) => {
//                                             if (err) return res.send(err);
//                                             // add note to purchased notes
//                                             const q = `INSERT INTO purchased_notes (note_id, user_id) VALUES (${note_id}, ${user_id});`;
//                                             db.query(q, (err, data) => {
//                                                 if (err) return res.send(err);
//                                             })
//                                         })
//                                     }
//                                 })
//                             }
//                         })
//                     }
//                 })
//             })
//             return res.status(200).json({ message: 'Notes purchased successfully' });
//         }
//     })
// }

// const getDisplayNote = (req, res) => {
//         const q = req.query.nid ? `SELECT n.name as nname, n.id as nid, st.name as stname, st.id as stid, body, is_locked, amount, limited_body, st.sst_name, subtopic, uid, topic, username, u.phone as phone, u.name as byname, avatar, coins
//     FROM notes n JOIN subtopics st ON n.subtopic=st.id JOIN users u ON n.uid=u.id
//     WHERE st.id='${req.params.stid}' AND n.id=${req.query.nid};`
//             : `SELECT n.name as nname, n.id as nid, st.name as stname, st.id as stid, body, is_locked, amount, limited_body, st.sst_name, subtopic, uid, topic, username, u.phone as phone, u.name as byname, avatar, coins
//     FROM notes n JOIN subtopics st ON n.subtopic=st.id JOIN users u ON n.uid=u.id
//     WHERE st.id='${req.params.stid}' ORDER BY n.id ASC LIMIT 1;`;
//         // console.log(q);
//         // db.query(q, (err, data) => {
//         //     if (err) return res.send(err);
//         //     return res.status(200).json(data.rows);
//         // })

//         const user_id = req.query.uid;

//         console.log(user_id)

//         // check if note is locked or not
//         db.query(q, (err, data) => {
//             if (err) return res.send(err);
//             const nData = data.rows.map(row => ({ ...row }));
//             let note = { ...nData[0] };
//             note.body = "This note is locked. Please purchase to unlock.";
//             if (note.is_locked) {
//                 // check if user is logged in
//                 if (!user_id) {
//                     return res.status(401).json({
//                         loggedIn: false,
//                         message: 'Note is locked. Please login to unlock.',
//                         note: note
//                     });
//                 } else {
//                     // check if note is already purchased
//                     const q = `SELECT * FROM purchased_notes WHERE note_id=${note.nid} AND user_id=${user_id};`;
//                     db.query(q, (err, data) => {
//                         if (err) return res.send(err);
//                         console.log(data.rows);
//                         if (data.rows.length > 0) {
//                             return res.status(200).json(nData);
//                         } else {
//                             // unauth, purchase first
//                             return res.status(401).json({
//                                 loggedIn: true,
//                                 message: 'Note is locked. Please purchase to unlock.',
//                                 note: note
//                             });
//                         }
//                     })
//                 }
//             } else {
//                 return res.status(200).json(nData);
//             }
//         })
//     }

//     const getNote = (req, res) => {
//         console.log("Here is get topic by name");
//         const q = `SELECT n.name as nname, n.id as nid, st.name as stname, st.id as stid, * 
//     FROM notes n JOIN subtopics st ON n.subtopic=st.id
//     WHERE n.sn_name ILIKE '${req.params.name}' AND n.id=${req.params.id};`
//         console.log(q);
//         db.query(q, (err, data) => {
//             if (err) return res.send(err);
//             return res.status(200).json(data.rows);
//         })
//     }

//     const addNote = (req, res) => {
//         const { ...topicInfo } = req.body.objects[0];
//         console.log(topicInfo);
//         const { ...bookDetails } = req.body.objects[1];
//         const { ...Notes } = req.body.objects[2];
//         console.log(bookDetails);
//         console.log(Notes)
//     }

//     const uploadImage = (req, res) => {
//         console.log(req.blobinfo);
//     }

//     module.exports = {
//         getAllNotes,
//         getNotes,
//         getDisplayNote,
//         getNote,
//         addNote,
//         uploadImage,
//         puchaseNote,
//         puchaseNotes
//     }
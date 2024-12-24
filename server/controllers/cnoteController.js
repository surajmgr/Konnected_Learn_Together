// const db = require('../utils/db').pool
// const jwt = require('jsonwebtoken');

// const strUrl = (in_str) => {
//     const str = in_str.replace(/[^a-zA-Z0-9 ]/g, '');
//     const resStr = str.slice(0, 25).replaceAll(' ', '-').toLowerCase()
//     console.log(resStr);
//     return resStr;
// }

// const addNote = (req, res) => {
//     // const token = req.session.token;
//     // console.log('token');
//     // console.log(token);
//     // if (!token) return res.status(401).json("Not Authenticated!");

//     // jwt.verify(token, "jwtkey", (err, userInfo) => {
//     // if (err) return res.status(403).json("Token is not valid!");
//     const sst_name = strUrl(req.body.title)

//     const o_content = req.body.content
//     const content = o_content.replaceAll("'", "''")

//     const q = `INSERT INTO notes (name,body,sst_name,subtopic,uid,date,is_locked) VALUES ('${req.body.title.replaceAll("'", "''")}','${content}','${sst_name}',${req.body.subtopic},${req.body.uid},'${req.body.date}',${req.body.isLocked}) RETURNING id;`
//     console.log(q);

//     db.query(q, (err, data) => {
//         if (err) return res.status(500).json(err.message);
//         const note_id = data.rows[0].id;

//         const q = `SELECT t.st_name, st.sst_name, st.topic as tid, st.id as stid 
//         FROM subtopics st JOIN topics t ON t.id=st.topic WHERE st.id=${req.body.subtopic};`

//         db.query(q, (err, data) => {
//             if (err) return res.status(500).json(err.message);
//             const { st_name, sst_name, tid, stid } = data.rows[0];
//             const link = `/subtopic/${st_name}/${sst_name}/${stid}/${tid}?nid=${note_id}`
//             const q = `INSERT INTO notifications(content,link,uid,read) VALUES 
//             ('You have contributed a new note [${req.body.title.replaceAll("'", "''")}].',
//             '${link}',${req.body.uid},'1');`
//             db.query(q, (err, data) => {
//                 if (err) return res.status(500).json(err.message);
//                 return res.json("Note created with notif!");
//             })
//         })
//     })
//     // });
// }

// const deleteNote = (req, res) => {
//     // const token = req.session.token;
//     // console.log('token');
//     // console.log(token);
//     // if (!token) return res.status(401).json("Not Authenticated!");

//     // jwt.verify(token, "jwtkey", (err, userInfo) => {
//     //     if (err) return res.status(403).json("Token is not valid!");

//         const NoteId = req.params.id;
//         const q = `DELETE FROM Notes WHERE id = '${NoteId}';`
//         console.log(q);
//         db.query(q, (err, data) => {
//             if (err) return res.status(403).json("You can not delete this Note.");
//             return res.json("Note has been deleted!");
//         })
//     // })
// }

// const updateNote = (req, res) => {
//     // const token = req.session.token;
//     // console.log('token');
//     // console.log(token);
//     // if (!token) return res.status(401).json("Not Authenticated!");

//     // jwt.verify(token, "jwtkey", (err, userInfo) => {
//     // if (err) return res.status(403).json("Token is not valid!");

//     const NoteId = req.params.id;
//     const q = `UPDATE notes SET name='${req.body.title.replaceAll("'", "''")}', body='${req.body.content.replaceAll("'", "''")}', subtopic=${req.body.subtopic}, is_locked=${req.body.isLocked} WHERE id=${NoteId} AND uid=${req.body.uid};`
//     console.log(q);

//     db.query(q, (err, data) => {
//         if (err) return res.status(500).json(err.message);
//         return res.json("Note has been updated!");
//     })
//     // });
// }

// module.exports = {
//     addNote,
//     deleteNote,
//     updateNote
// }

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Utility Function
const strUrl = (in_str) => {
    const str = in_str.replace(/[^a-zA-Z0-9 ]/g, '');
    const resStr = str.slice(0, 25).replaceAll(' ', '-').toLowerCase();
    console.log(resStr);
    return resStr;
};

// Add Note
const addNote = async (req, res) => {
    try {
        const sst_name = strUrl(req.body.title);
        const content = req.body.content.replaceAll("'", "''");

        // Create the note
        const newNote = await prisma.note.create({
            data: {
                name: req.body.title,
                body: content,
                sst_name: sst_name,
                subtopicId: req.body.subtopic,
                uid: req.body.uid,
                date: new Date(req.body.date),
                is_locked: req.body.isLocked,
            },
        });

        const noteId = newNote.id;

        // Get additional details for notification
        const subtopic = await prisma.subtopic.findUnique({
            where: { id: req.body.subtopic },
            include: { topic: true },
        });

        if (!subtopic) {
            return res.status(404).json("Subtopic not found");
        }

        const { st_name, sst_name: subSstName, id: stid, topic } = subtopic;
        const link = `/subtopic/${st_name}/${subSstName}/${stid}/${topic.id}?nid=${noteId}`;

        // Create notification
        await prisma.notification.create({
            data: {
                content: `You have contributed a new note [${req.body.title}].`,
                link: link,
                uid: req.body.uid,
                read: true,
            },
        });

        return res.json("Note created with notification!");
    } catch (err) {
        console.error(err);
        return res.status(500).json(err.message);
    }
};

// Delete Note
const deleteNote = async (req, res) => {
    try {
        const noteId = parseInt(req.params.id);

        await prisma.note.delete({
            where: { id: noteId },
        });

        return res.json("Note has been deleted!");
    } catch (err) {
        console.error(err);
        return res.status(403).json("You cannot delete this note.");
    }
};

// Update Note
const updateNote = async (req, res) => {
    try {
        const noteId = parseInt(req.params.id);

        const updatedNote = await prisma.note.updateMany({
            where: {
                id: noteId,
                uid: req.body.uid, // Ensure the user owns the note
            },
            data: {
                name: req.body.title.replaceAll("'", "''"),
                body: req.body.content.replaceAll("'", "''"),
                subtopicId: req.body.subtopic,
                is_locked: req.body.isLocked,
            },
        });

        if (updatedNote.count === 0) {
            return res.status(404).json("Note not found or unauthorized.");
        }

        return res.json("Note has been updated!");
    } catch (err) {
        console.error(err);
        return res.status(500).json(err.message);
    }


    
};

module.exports = {
    addNote,
    deleteNote,
    updateNote,
};





const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const strUrl = (str) => {
    const resStr = str.replaceAll(' ', '-').toLowerCase();
    console.log(resStr);
    return resStr;
};

// Get all subtopics
const getAllSubTopics = async (req, res) => {
    try {
        const subtopics = await prisma.subtopic.findMany({
            include: {
                topic: true, // Include related topic data
            },
        });
        const formattedData = subtopics.map((st) => ({
            tname: st.topic.name,
            tid: st.topicId,
            stname: st.name,
            stid: st.id,
        }));
        return res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error fetching all subtopics:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get subtopics by topic ID
const getSubTopics = async (req, res) => {
    const { tid } = req.params;
    try {
        const subtopics = await prisma.subtopic.findMany({
            where: {
                topicId: parseInt(tid),
            },
            include: {
                topic: true,
            },
        });
        const formattedData = subtopics.map((st) => ({
            tname: st.topic.name,
            tid: st.topicId,
            stname: st.name,
            stid: st.id,
        }));
        return res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error fetching subtopics for topic ID:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get a specific subtopic
const getSubTopic = async (req, res) => {
    const { tname, name, id } = req.params;
    try {
        const subtopic = await prisma.subtopic.findFirst({
            where: {
                id: parseInt(id),
                sst_name: { contains: name, mode: "insensitive" },
                topic: {
                    st_name: tname,
                },
            },
            include: {
                topic: true,
            },
        });
        if (!subtopic) {
            return res.status(404).json({ error: "Subtopic not found" });
        }
        const formattedData = {
            tname: subtopic.topic.name,
            tid: subtopic.topicId,
            stname: subtopic.name,
            stid: subtopic.id,
        };
        return res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error fetching subtopic:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Add a subtopic
const addSubTopic = async (req, res) => {
    try {
        const { objects } = req.body;

        // Parse data from the request body
        const topicInfo = objects[0];
        const bookDetails = objects[1];
        const subTopics = objects[2];

        console.log("Topic Info:", topicInfo);
        console.log("Book Details:", bookDetails);
        console.log("Subtopics:", subTopics);

        // Add logic here to handle the insertion of topics, subtopics, and book details
        const newSubTopic = await prisma.subtopic.create({
            data: {
                name: subTopics.name,
                sst_name: subTopics.sst_name,
                topic: {
                    connectOrCreate: {
                        where: { id: topicInfo.id },
                        create: {
                            name: topicInfo.name,
                            st_name: topicInfo.st_name,
                        },
                    },
                },
            },
        });

        return res.status(201).json({ message: "Subtopic added successfully", subtopic: newSubTopic });
    } catch (error) {
        console.error("Error adding subtopic:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getAllSubTopics,
    getSubTopics,
    getSubTopic,
    addSubTopic,
};



// const db = require('../utils/db').pool
// const jwt = require('jsonwebtoken')

// const strUrl = (str) => {
//     const resStr = str.replaceAll(' ', '-').toLowerCase()
//     console.log(resStr);
//     return resStr;
// }

// const getAllSubTopics = (req,res) => {
//     const q = `SELECT t.name as tname, t.id as tid, st.name as stname, st.id as stid, * 
//     FROM topics t JOIN subtopics st ON t.id=st.topic;`;
//     console.log(q);
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         console.log(data.rows);
//         return res.status(200).json(data.rows);
//     })
// }

// const getSubTopics = (req, res) => {
//     const q = `SELECT t.name as tname, t.id as tid, st.name as stname, st.id as stid, * 
//     FROM topics t JOIN subtopics st ON t.id=st.topic
//     WHERE t.id='${req.params.tid}';`;
//     // console.log(q);
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         // console.log(data.rows);
//         return res.status(200).json(data.rows);
//     })
// }

// const getSubTopic = (req, res) => {
//     const q = `SELECT t.name as tname, t.id as tid, st.name as stname, st.id as stid, * 
//     FROM subtopics st JOIN topics t ON st.topic=t.id
//     WHERE t.st_name='${req.params.tname}' AND st.sst_name ILIKE '${req.params.name}' AND st.id=${req.params.id};`
//     // console.log(q);
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         // console.log(data.rows);
//         return res.status(200).json(data.rows);
//     })
// }

// const addSubTopic = (req, res) => {
//     const {...topicInfo} = req.body.objects[0];
//     console.log(topicInfo);
//     const {...bookDetails} = req.body.objects[1];
//     const {...subTopics} = req.body.objects[2];
//     console.log(bookDetails);
//     console.log(subTopics)
// }

// module.exports = {
//     getAllSubTopics,
//     getSubTopics,
//     getSubTopic,
//     addSubTopic
// }
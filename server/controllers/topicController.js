const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const strUrl = (in_str) => {
  const str = in_str.replace(/[^a-zA-Z0-9 ]/g, '');
  const resStr = str.slice(0, 25).replaceAll(' ', '-').toLowerCase();
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

const getAllTopics = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  try {
    const topics = await prisma.topic.findMany({
      include: {
        topicBooks: {
          include: {
            book: {
              where: { is_verified: true },
            },
          },
        },
      },
    });

    const uniqueTopics = Array.from(new Set(topics.map((t) => t.id))).map((id) =>
      topics.find((t) => t.id === id)
    );

    return res
      .status(200)
      .json(pagination(page, limit, uniqueTopics.slice(0).reverse()));
  } catch (error) {
    console.error("Error fetching all topics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getTopics = async (req, res) => {
  const { bid } = req.params;

  try {
    const topics = await prisma.topic.findMany({
      where: {
        topicBooks: {
          some: {
            bookId: parseInt(bid),
            book: { is_verified: true },
          },
        },
      },
      include: {
        topicBooks: true,
      },
    });

    return res.status(200).json(topics);
  } catch (error) {
    console.error("Error fetching topics for book:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getTopic = async (req, res) => {
  const { name, id } = req.params;

  try {
    const topic = await prisma.topic.findFirst({
      where: {
        st_name: { contains: name, mode: "insensitive" },
        id: parseInt(id),
      },
      include: {
        topicBooks: true,
        subtopics: true,
      },
    });

    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    return res.status(200).json(topic);
  } catch (error) {
    console.error("Error fetching topic:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addTopic = async (req, res) => {
  const { objects } = req.body;
  const topicInfo = objects[0];
  const bookDetails = objects[1];
  const subTopics = objects[2];

  const st_name = strUrl(topicInfo.tname);

  try {
    // Create the topic
    const newTopic = await prisma.topic.create({
      data: {
        name: topicInfo.tname,
        st_name,
        topicBooks: {
          create: bookDetails.map((book) => ({
            bookId: book.id,
          })),
        },
        subtopics: {
          create: subTopics.map((subTopicName) => ({
            name: subTopicName,
            sst_name: strUrl(subTopicName),
          })),
        },
      },
    });

    return res.status(201).json({
      message: "Topic added successfully!",
      topic: newTopic,
    });
  } catch (error) {
    console.error("Error adding topic:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllTopics,
  getTopics,
  getTopic,
  addTopic,
};






// const db = require('../utils/db').pool
// const jwt = require('jsonwebtoken')

// const strUrl = (in_str) => {
//     const str = in_str.replace(/[^a-zA-Z0-9 ]/g, '');
//     const resStr = str.slice(0,25).replaceAll(' ', '-').toLowerCase()
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
//       const property = key;
//       key = function (item) {
//         return item[property];
//       };
//     }
//     return Array.from(
//       array
//         .reduce(function (map, item) {
//           const k = key(item);
//           if (!map.has(k)) map.set(k, item);
//           return map;
//         }, new Map())
//         .values()
//     );
//   }

// const getAllTopics = (req,res) => {
//     const page = (req.query.page) ? parseInt(req.query.page) : 1;
//     const limit = (req.query.limit) ? parseInt(req.query.limit) : 10;
//     const q = `SELECT b.name as bname, t.name as tname, b.id as bid, t.id as tid, * 
//     FROM topics t JOIN topicBook tb ON t.id=tb.topic_id JOIN books b ON b.id=tb.book_id 
//     WHERE b.is_verified='1';`;
//     console.log(q);
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         console.log(data.rows);
//         const topics = data.rows;
//         return res.status(200).json(pagination(page, limit, getUnique(topics,'tid').slice(0).reverse()));
//     })
// }

// const getTopics = (req, res) => {
//     console.log(req.session.token);
//     const q = `SELECT b.name as bname, t.name as tname, b.id as bid, t.id as tid, * 
//     FROM topics t JOIN topicBook tb ON t.id=tb.topic_id JOIN books b ON b.id=tb.book_id 
//     WHERE b.id='${req.params.bid}' AND b.is_verified='1';`;
//     console.log(q);
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         return res.status(200).json(data.rows);
//     })
// }

// const getTopic = (req, res) => {
//     const q = `SELECT b.name as bname, t.name as tname, b.id as bid, t.id as tid, * 
//     FROM topics t JOIN topicBook tb ON t.id=tb.topic_id JOIN books b ON b.id=tb.book_id
//     WHERE t.st_name ILIKE '${req.params.name}' AND t.id=${req.params.id};`
//     // console.log(q);
//     db.query(q, (err, data) => {
//         if (err) return res.send(err);
//         // console.log(data.rows);
//         return res.status(200).json(data.rows);
//     })
// }

// const addTopic = (req, res) => {
//     const {...topicInfo} = req.body.objects[0];
//     console.log(topicInfo);
//     const {...bookDetails} = req.body.objects[1];
//     const {...subTopics} = req.body.objects[2];
//     console.log(bookDetails);
//     console.log(subTopics)
//                                                                                                                                                                                                                                                 // console.log(Object.keys(levelDetails).length)
//                                                                                                                                                                                                                          // for (var i=0; i<Object.keys(levelDetails).length;i++){
//                                                                                                                                                                                                                          //     console.log(levelDetails[i].name);
//                                                                                                                                                                                                                          // }




//                                                                                                                                                                                                                          // const token = req.session.token;
//                                                                                                                                                                                                                          // console.log(token);
//                                                                                                                                                                                                                          // if (!token) return res.status(401).json("Not Authenticated!");

//                                                                                                                                                                                                                             // jwt.verify(token, "jwtkey", (err, userInfo) => {
//                                                                                                                                                                                                                             //     if (err) return res.status(403).json("Token is not valid!");

//     const st_name = strUrl(topicInfo.tname)

//     const q = `INSERT INTO topics (name,st_name)
//     VALUES('${topicInfo.tname.replaceAll("'","''")}','${st_name}') RETURNING *;`
//     console.log(q);
//     db.query(q,(err,data)=>{
//         if (err) return res.status(500).json(err.message);
//         console.log(data.rows);
//         const topicId = data.rows[0].id;
//         console.log(topicId);
//         var q = `INSERT INTO topicBook (topic_id,book_id) VALUES
//             (${topicId},${bookDetails[0].id})`
//         console.log(q);
//         for (var i=1; i<Object.keys(bookDetails).length;i++){
//             console.log(bookDetails[i].name);
//             const bkId = bookDetails[i].id;
//             console.log(q);
//             q += `,(${topicId},${bkId})`
//         }
//         q+=`;`
//         console.log(q);
//         db.query(q,(err,data)=>{
//             if (err) return res.status(500).json(err.message);
//             var q = `INSERT INTO subtopics (name,sst_name,topic) VALUES
//             ('${subTopics[0].replaceAll("'","''")}','${strUrl(subTopics[0])}',${topicId})`
//         console.log(q);
//         for (var i=1; i<Object.keys(subTopics).length;i++){
//             console.log(subTopics[i]);
//             q += `,('${subTopics[i].replaceAll("'","''")}','${strUrl(subTopics[i])}',${topicId})`
//         }
//         q+=`;`
//             db.query(q,(err,data)=>{
//                 if (err) return res.status(500).json(err.message);
//                 return res.json("Inserted Successfully!");
//             })
            
//         })
//     })
//     // });






//     // const token = req.session.token;
//     // console.log(token);
//     // if (!token) return res.status(401).json("Not Authenticated!");

//     // jwt.verify(token, "jwtkey", (err, userInfo) => {
//     //     if (err) return res.status(403).json("Token is not valid!");

//     //     const s_name = strUrl(req.body.bname)

//     //     const q = `INSERT INTO books (name,description,level,author,is_verified,s_name)
//     //     VALUES('${req.body.bname}', '${req.body.bdescription}', '${req.body.blevel}', '${req.body.bauthor}',
//     //         '', '${s_name}');`
//     //     console.log(q);

//     //     db.query(q,(err,data)=>{
//     //         if (err) return res.status(500).json(err.message);
//     //         return res.json("Book has been submitted! Please wait at least 24 hours for review.");
//     //     })
//     // });
// }

// module.exports = {
//     getAllTopics,
//     getTopics,
//     getTopic,
//     addTopic
// }
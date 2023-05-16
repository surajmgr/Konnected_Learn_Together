const express = require('express');
const fs = require('fs')
const imgbbUploader = require("imgbb-uploader");
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const cors = require('cors');
var allowedDomains = [process.env.client_KED, 'http://localhost:3000/'];
// app.use(cors({
//   origin: function (origin, callback) {
//     // bypass the requests with no origin (like curl requests, mobile apps, etc )
//     if (!origin) return callback(null, true);
 
//     if (allowedDomains.indexOf(origin) === -1) {
//       var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
app.use(cors({
    origin: 'https://konnected-urn3.onrender.com',
    credentials: true
}));

const session = require('express-session');
app.use(session({
    secret: "konnectedsessionsecret",
    proxy: true,
    cookie: { httpOnly: true, secure: true },
    name: "myuniquename",
    resave: true,
    saveUninitialized: true
}));
// app.use(cookieSession({
//     secret: 'secret-key-you-don\'t-tell-the-client',
//     signed: true,
//   }));

// Storage through Multer
const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         console.log("File is Here!")
//         console.log(req)
//         console.log("File is Here!")
//         console.log(file)
//         cb(null, '../client/public/upload/files')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()) + '-' + file.originalname
//         cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
// })
// const upload = multer({ storage: storage })
const upload = multer({ dest: "./uploads/" });

// Routes
const auth_route = require('./routes/authRoute');
const user_route = require('./routes/userRoute');
const bt_route = require('./routes/btRoute');
const note_route = require('./routes/noteRoute');
const topic_route = require('./routes/topicRoute');
const level_route = require('./routes/levelRoute');
const subTopic_route = require('./routes/subTopicRoute');
const cnote_route = require('./routes/cnoteRoute');
const search_route = require('./routes/searchRoute');
const count_route = require('./routes/countRoute');
const question_route = require('./routes/questionRoute');

app.post('/api/upload', upload.single('file'), async function (req, res) {
    const file = req.file;
    imgbbUploader(process.env.imgbb, file.path)
        .then((response) => {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            });
            return res.status(200).json({ location: response.image.url });
        })
        .catch((error) => { return res.status(400).json(error.message) });
})

// Health check for server
app.get('/run', (req, res) => {
    return res.json("Server is running properly.");
})

// Using path to route
app.use("/api/auth", auth_route);

app.use("/api/books", bt_route);
app.use("/api/book", bt_route);

app.use("/api/topics", topic_route);
app.use("/api/topic", topic_route);

app.use("/api/subtopics", subTopic_route);
app.use("/api/subtopic", subTopic_route);

app.use("/api/notes", note_route);

app.use("/api/cnote", cnote_route);

app.use("/api/levels", level_route);

app.use("/api/dbsearch", search_route);

app.use("/api/count", count_route);

app.use("/api/profile", user_route);

app.use("/api/dbquestion", question_route);

// Listening server in port 5000
app.listen(5000, (req, res) => {
    console.log("Starting server now!");
});
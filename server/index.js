const express = require('express');
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000/',
    credentials: true
}));

const session = require('express-session');
app.use(session({
    secret: "konnectedsessionsecret",
    resave: true,
    saveUninitialized: true
}));

// Storage through Multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload/files')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()) + '-' + file.originalname
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const upload = multer({ storage: storage })

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

app.post('/api/upload', upload.single('file'), function (req,res) {
    const file = req.file;
    console.log(file)
    res.status(200).json({location:`/upload/files/${file.filename.replaceAll(" ","%20")}`});
  })


// Using path to route
app.use("/api/auth",auth_route);

app.use("/api/books",bt_route);
app.use("/api/book",bt_route);

app.use("/api/topics",topic_route);
app.use("/api/topic",topic_route);

app.use("/api/subtopics",subTopic_route);
app.use("/api/subtopic",subTopic_route);

app.use("/api/notes",note_route);

app.use("/api/cnote",cnote_route);

app.use("/api/levels",level_route);

app.use("/api/dbsearch",search_route);

app.use("/api/count",count_route);

app.use("/api/profile",user_route);

app.use("/api/dbquestion",question_route);

// Listening server in port 5000
app.listen(5000, (req,res)=>{
    console.log("Starting server now!");
});
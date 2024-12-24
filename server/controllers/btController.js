/*

const db = require('../utils/db').pool
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const strUrl = (in_str) => {
    const str = in_str.replace(/[^a-zA-Z0-9 ]/g, '');
    const resStr = str.slice(0, 25).replaceAll(' ', '-').toLowerCase()
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

const sendNotificationMail = async (name, email, subject, message, coverImg) => {
    try {
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.emailUser,
                pass: process.env.emailPassword
            }
        });

        const uniqueName = coverImg.slice(14,30);

        const mailOptions = {
            from: process.env.emailUser,
            to: email,
            subject: subject,
            html: message,
            attachments: [{
                filename: 'Book cover.jpg',
                path: coverImg,
                cid: uniqueName
            }]
        }

        transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Activation email is sent:- ", info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }
}

const getBooks = (req, res) => {
    const page = (req.query.page) ? parseInt(req.query.page) : 1;
    const limit = (req.query.limit) ? parseInt(req.query.limit) : 15;
    const q = "SELECT b.name as bname, b.cover as coverimg, l.name as lname, b.id as bid, l.id as lid, * FROM books b JOIN bookLevel bl ON b.id=bl.book_id JOIN levels l ON l.id=bl.level_id WHERE b.is_verified='1';";
    db.query(q, (err, data) => {
        // if (err) return res.json(err);
        if (err) {
            console.log(err);
            return 0;
        }
        // console.log(data.rows);
        const books = data.rows;
        return res.json(pagination(page, limit, getUnique(books, 'bid').slice(0).reverse()));
    })
}

const getBooksByLevel = (req, res) => {
    const page = (req.query.page) ? parseInt(req.query.page) : 1;
    const limit = (req.query.limit) ? parseInt(req.query.limit) : 15;
    const q = `SELECT b.name as bname, b.cover as coverImg, l.name as lname, b.id as bid, l.id as lid, * FROM books b JOIN bookLevel bl ON b.id=bl.book_id JOIN levels l ON l.id=bl.level_id WHERE l.sl_name='${req.params.level}' AND b.is_verified='1';`
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        const books = data.rows;
        return res.json(pagination(page, limit, getUnique(books, 'bid').slice(0).reverse()));
    })
}

const getAllBooks = (req, res) => {
    const q = "SELECT b.id as bid, b.name as bname, l.name as lname FROM books b JOIN bookLevel bl ON b.id=bl.book_id JOIN levels l ON l.id=bl.level_id WHERE b.is_verified='1';";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        const books = data.rows;
        const resVal = getUnique(books, 'bid').slice(0).reverse();
        return res.status(200).json(resVal);
    })
}

const getBook = (req, res) => {
    const q = `SELECT b.name as bname, b.cover as coverImg, l.name as lname, b.id as bid, l.id as lid, * FROM books b JOIN bookLevel bl ON b.id=bl.book_id JOIN levels l ON l.id=bl.level_id WHERE b.s_name ILIKE '${req.params.name}' AND b.id=${req.params.id} AND b.is_verified='1';`
    // console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        // console.log(data.rows);
        return res.status(200).json(data.rows);
    })
}

const addBook = (req, res) => {
    const { ...bookInfo } = req.body.objects[0];
    // console.log(bookInfo);
    const { ...levelDetails } = req.body.objects[1];
    // console.log(levelDetails);
    const { coverImg, date, uid } = req.body;
    console.log(coverImg);

    // const token = req.session.token;
    // console.log(token);
    // if (!token) return res.status(401).json("Not Authenticated!");

    // jwt.verify(token, "jwtkey", (err, userInfo) => {
    //     if (err) return res.status(403).json("Token is not valid!");

    const s_name = strUrl(bookInfo.bname)
    const randomString = randomstring.generate(10);

    const q = `INSERT INTO books (name,description,author,cover,upload_date,uid,is_verified,s_name,verify_token)
    VALUES('${bookInfo.bname.replaceAll("'", "''")}', '${bookInfo.bdescription.replaceAll("'", "''")}', '${bookInfo.bauthor.replaceAll("'", "''")}',
    '${coverImg}', '${date}', ${uid},
    '0', '${s_name}', '${randomString}') RETURNING *;`
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        const bookId = data.rows[0].id;
        var q = `INSERT INTO bookLevel (book_id,level_id) VALUES
            (${bookId},${levelDetails[0].id})`
        for (var i = 1; i < Object.keys(levelDetails).length; i++) {
            const lvlId = levelDetails[i].id;
            q += `,(${bookId},${lvlId})`
        }
        q += `;`
        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err.message);
            const msg =
            `
                    <table border="0" cellpadding="0" cellspacing="0" width="80%">
                        <tr>
                            <td align="center" style="padding: 0px 10px 0px 10px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                    <tr>
                                        <td bgcolor="#ffffff" align="left" valign="top" style="padding: 30px 30px 20px 30px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; line-height: 48px;">
                                            <h1 style="font-size: 32px; font-weight: 400; margin: 0;">KonnectEd: Learn Together</h1>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 0px 10px 0px 10px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                    <tr>
                                        <td align="left">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td bgcolor="#fff" colspan="2" style="padding-left:30px;padding-right:15px;padding-bottom:10px; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px;">
                                                        <p>Hello Admin, <br />A new book named <b>[${bookInfo.bname}]</b> has been submitted for the approval. Please review it with following information:<br />
                                                            <div style="display:flex; ">
                                                                <div style="margin-top:20px;">
                                                                <img src="cid:${coverImg.slice(14,30)}" style="width:100px; border-radius:5px; margin-right:15px; max-height:400px;" />
                                                                </div>
                                                                <div style="width:100%;">
                                                                    <p><b>${bookInfo.bname}</b><br />
                                                                        ${bookInfo.bdescription}<br />
                                                                        <b>Book ID: ${bookId}</b><br />
                                                                        <b>Uploader UID: ${uid}</b><br />
                                                                        <b>Date: ${date}</b></p></div>
                                                            </div>

                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td bgcolor="#fff" align="center" style="padding: 30px 30px 30px 30px; border-top:1px solid #dddddd;">
                                                        <table border="0" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td align="left" style="border-radius: 3px;" bgcolor="#426899">
                                                                    <a href="http://localhost:3000/verify-book?token=${randomString}&bid=${bookId}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 11px 22px; border-radius: 2px; border: 1px solid #426899; display: inline-block;">
                                                                    Verify it</a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                `
            sendNotificationMail("Admin", "surajpulami8@gmail.com", "New book for approval", msg, coverImg);
            return res.json("Inserted Successfully!");
        })
    })
    // });

    // const token = req.session.token;
    // console.log(token);
    // if (!token) return res.status(401).json("Not Authenticated!");

    // jwt.verify(token, "jwtkey", (err, userInfo) => {
    //     if (err) return res.status(403).json("Token is not valid!");

    //     const s_name = strUrl(req.body.bname)

    //     const q = `INSERT INTO books (name,description,level,author,is_verified,s_name)
    //     VALUES('${req.body.bname}', '${req.body.bdescription}', '${req.body.blevel}', '${req.body.bauthor}',
    //         '', '${s_name}');`
    //     console.log(q);

    //     db.query(q,(err,data)=>{
    //         if (err) return res.status(500).json(err.message);
    //         return res.json("Book has been submitted! Please wait at least 24 hours for review.");
    //     })
    // });
}

const uploadCover = (req, res) => {
    const cover = req.file;
    res.status(200).json(`/upload/cover/${cover.filename.replaceAll(" ","%20")}`);
}

const verifyBook = (req,res) =>{
    const { token, bid } = req.query;
    const q = `SELECT id FROM books WHERE id=${bid} AND verify_token='${token}';`
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return console.log(err);
        const q = `UPDATE books SET is_verified='1' WHERE id=${bid};`
        db.query(q, (err, data) => {
            if (err) return console.log(err);
            return res.status(200).json('Book has been verified!');
        })
    })
}

module.exports = {
    getBooks,
    getBooksByLevel,
    getBook,
    addBook,
    getAllBooks,
    uploadCover,
    verifyBook
}
    */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const strUrl = (in_str) => {
    return in_str.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 25).replaceAll(' ', '-').toLowerCase();
};

const pagination = (page, limit, data) => {
    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;

    return {
        total: data.length,
        pageCount: Math.ceil(data.length / limit),
        next: lastIndex < data.length ? { page: page + 1 } : undefined,
        prev: startIndex > 0 ? { page: page - 1 } : undefined,
        result: data.slice(startIndex, lastIndex),
    };
};

const getUnique = (array, key) => {
    const seen = new Map();
    return array.filter(item => {
        const k = item[key];
        if (!seen.has(k)) {
            seen.set(k, true);
            return true;
        }
        return false;
    });
};

const sendNotificationMail = async (name, email, subject, message, coverImg) => {
    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.emailUser,
            pass: process.env.emailPassword,
        },
    });

    const uniqueName = coverImg.slice(14, 30);

    const mailOptions = {
        from: process.env.emailUser,
        to: email,
        subject,
        html: message,
        attachments: [
            {
                filename: 'Book cover.jpg',
                path: coverImg,
                cid: uniqueName,
            },
        ],
    };

    try {
        await transport.sendMail(mailOptions);
        console.log('Activation email sent.');
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};

const getBooks = async (req, res) => {
    const { page = 1, limit = 15 } = req.query;

    try {
        const books = await prisma.book.findMany({
            where: { isVerified: true },
            include: { levels: { include: { level: true } } },
        });

        const uniqueBooks = getUnique(books, 'id').reverse();
        res.json(pagination(page, limit, uniqueBooks));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBooksByLevel = async (req, res) => {
    const { level } = req.params;
    const { page = 1, limit = 15 } = req.query;

    try {
        const books = await prisma.book.findMany({
            where: {
                isVerified: true,
                levels: { some: { level: { slName: level } } },
            },
            include: { levels: { include: { level: true } } },
        });

        const uniqueBooks = getUnique(books, 'id').reverse();
        res.json(pagination(page, limit, uniqueBooks));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllBooks = async (req, res) => {
    try {
        const books = await prisma.book.findMany({
            where: { isVerified: true },
            include: { levels: { include: { level: true } } },
        });

        const uniqueBooks = getUnique(books, 'id').reverse();
        res.status(200).json(uniqueBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBook = async (req, res) => {
    const { id, name } = req.params;

    try {
        const book = await prisma.book.findFirst({
            where: { id: parseInt(id), sName: { contains: name }, isVerified: true },
            include: { levels: { include: { level: true } } },
        });

        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addBook = async (req, res) => {
    const { objects, coverImg, date, uid } = req.body;
    const bookInfo = objects[0];
    const levelDetails = objects[1];

    const sName = strUrl(bookInfo.bname);
    const randomToken = randomstring.generate(10);

    try {
        const newBook = await prisma.book.create({
            data: {
                name: bookInfo.bname,
                description: bookInfo.bdescription,
                author: bookInfo.bauthor,
                cover: coverImg,
                uploadDate: new Date(date),
                uid,
                isVerified: false,
                sName,
                verifyToken: randomToken,
            },
        });

        const levelData = levelDetails.map(level => ({
            bookId: newBook.id,
            levelId: level.id,
        }));

        await prisma.bookLevel.createMany({ data: levelData });

        const msg = `<p>A new book named <b>${bookInfo.bname}</b> has been submitted for approval...</p>`;
        sendNotificationMail('Admin', 'surajpulami8@gmail.com', 'New Book Submission', msg, coverImg);

        res.json('Book submitted successfully!');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const verifyBook = async (req, res) => {
    const { token, bid } = req.query;

    try {
        const book = await prisma.book.findFirst({
            where: { id: parseInt(bid), verifyToken: token },
        });

        if (!book) return res.status(404).json({ error: 'Invalid token or book ID' });

        await prisma.book.update({
            where: { id: parseInt(bid) },
            data: { isVerified: true },
        });

        res.status(200).json('Book verified successfully!');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getBooks,
    getBooksByLevel,
    getAllBooks,
    getBook,
    addBook,
    verifyBook,
};

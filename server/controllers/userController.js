const db = require('../utils/db').pool

const strUrl = (in_str) => {
    const str = in_str.replace(/[^a-zA-Z0-9 ]/g, '');
    const resStr = str.slice(0, 25).replaceAll(' ', '-').toLowerCase()
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

const getProfile = (req, res) => {
    const username = req.params.username;
    const q = `SELECT u.id as uid, u.name as uname, username, email, phone, avatar, bio, balance, u.points as upoints, tinymce, gpt, r.name as rank, l.name as level FROM users u 
    JOIN ranks r ON u.rank=r.id JOIN levels l ON u.level=l.id
    WHERE username='${username}';`
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        return res.json(data.rows[0]);
    })
}

const isFollowing = (req, res) => {
    const follower = req.query.follower;
    const following = req.query.following;
    const q = `SELECT id FROM follows WHERE follower_id=${follower} AND following_id=${following};`
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        console.log(data.rowCount);
        return res.json(parseInt(data.rowCount));
    })
}

const doFollow = (req, res) => {
    const follower = req.body.follower;
    const following = req.body.following;
    const q = `SELECT id FROM follows WHERE follower_id=${follower} AND following_id=${following};`
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        if(data.rowCount > 0) return console.log("Already Following!")
        const q = `INSERT INTO follows(follower_id,following_id) VALUES(${follower},${following})`
        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err.message);
            console.log("Inserted!");
            return res.json('Now Following!');
        })
    })
}

const removeFollow = (req, res) => {
    const follower = req.query.follower;
    const following = req.query.following;
    const q = `DELETE FROM follows WHERE follower_id=${follower} AND following_id=${following};`
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        console.log("Deleted!");
        return res.json("Now Unfollowing");
    })
}

const getFollowings = (req, res) => {
    const uid = req.params.uid;
    const q = `SELECT u.id as uid, u.name as uname, username, email, avatar FROM users u 
    JOIN follows f ON f.following_id=u.id 
    WHERE f.follower_id=${uid};`
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        return res.json(data.rows);
    })
}

const getFollowers = (req, res) => {
    const uid = req.params.uid;
    const q = `SELECT u.id as uid, u.name as uname, username, email, avatar FROM users u 
    JOIN follows f ON f.follower_id=u.id 
    WHERE f.following_id=${uid};`
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        return res.json(data.rows);
    })
}

const uploadAvatar = (req, res) => {
    const avatar = req.file;
    res.status(200).json(`/upload/avatar/${avatar.filename.replaceAll(" ","%20")}`);
}

const updateProfile = (req, res) => {
    const uid = req.params.uid;
    const username = req.params.username;
    const { uname, bio, avatar, phone, tinymce, gpt } = req.body;
    const q = `UPDATE users SET name='${uname}', bio='${bio.replaceAll("'","''")}', avatar='${avatar}', phone='${phone}', 
    tinymce='${tinymce.replaceAll("'","''")}', gpt='${gpt.replaceAll("'","''")}'
    WHERE id=${uid} AND username='${username}';`
    console.log('Update Profile');
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        return res.json("User Updated!");
    })
}

const getNotifications = (req, res) => {
    const uid = req.params.uid;
    const page = (req.query.page) ? parseInt(req.query.page) : 1;
    const limit = (req.query.limit) ? parseInt(req.query.limit) : 15;
    const q = `SELECT u.id as uid, content, link, read FROM users u 
    JOIN notifications n ON n.uid=u.id 
    WHERE n.uid=${uid};`
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        // console.log(data.rows)
        const notifs = data.rows;
        return res.json(pagination(page, limit, notifs.slice(0).reverse()));
    })
}

const updateReadNotif = (req, res) => {
    const uid = req.body.uid;
    const changereq = req.query.changereq;
    var q = "";
    if(changereq == "readAll"){
        q=`UPDATE notifications SET read='1' WHERE uid=${uid};`
    } else if(changereq == "unreadAll"){
        q=`UPDATE notifications SET read='0' WHERE uid=${uid};`
    }
    console.log("Update Read Notifications!")
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        return res.json("Updated Notifications.");
    })
}

const addNotifications = (req, res) => {
    const { uid, message, link, read } = req.body;
    const q = `INSERT INTO notifications(content,link,uid,read) VALUES('${message.replaceAll("'", "''")}','${link}',${uid},'${read}');`
    console.log("Add Notifications!")
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        return res.json("Added Notifications.");
    })
}

const updateBalance = (req, res) => {
    const { uid, amount } = req.body;
    const changereq = req.query.changereq;
    const q=`SELECT id, balance FROM users where id=${uid};`
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err.message);
        var balance = parseInt(data.rows[0].balance);
        if(changereq == "add"){
            balance += parseInt(amount);
        } else if(changereq == "withdraw"){
            balance -= parseInt(amount);
        }
        const q = `UPDATE users SET balance=${balance} WHERE id=${uid};`
        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err.message);
            return res.json("Updated Balance.");
        })
    })
}

module.exports = {
    getProfile,
    isFollowing,
    doFollow,
    removeFollow,
    getFollowings,
    getFollowers,
    updateProfile,
    uploadAvatar,
    getNotifications,
    updateReadNotif,
    addNotifications,
    updateBalance
}
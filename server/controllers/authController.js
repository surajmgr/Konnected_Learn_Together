const db = require('../utils/db').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const securePassword = async (password) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = await bcrypt.hashSync(password, salt);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

const sendAccountActivationMail = async (name, email, activate_token) => {
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

        const mailOptions = {
            from: process.env.emailUser,
            to: email,
            subject: 'Activate your KonnectEd Account',
            html: `
            <div style="height: 100%;width: 40%;background-color:#fff; border-radius: 5px;border: 1px solid #e5e7eb;--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
            --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);">
        <table width="100%" align="center"
            style="font-family: 'Roboto',sans-serif; background-color: #fff; padding: 50px; margin: 10px auto;">
            <tr style="font-family: 'Roboto',sans-serif;">

                <td align="center" colspan="2" style="font-family: 'Roboto',sans-serif;">
                    <span class="logo" style="font-family: 'Roboto',sans-serif;font-size: 2.5em;word-spacing: -3px;"><b
                            style="font-family: 'Roboto',sans-serif;">KonnectED</b></span>
                </td>

            </tr>

            <tr style="font-family: 'Roboto',sans-serif;">
                <td colspan="2" style="font-family: 'Roboto',sans-serif;">
                    <h3>Activate Account</h3>
                    <span class="heading" style="font-family: 'Roboto',sans-serif;font-size: 18px;">Hello <b style="color:#000;">${name}</b>, You
                        have successfully registered your KonnectEd account.</span> <span class="para"
                        style="font-family: 'Roboto',sans-serif;line-height: normal;font-size: 18px;"> 
                        You can activate your account by clicking following button, or visit
                        <a href="http://localhost:3000/auth/activate-account?activate_token=${activate_token}">here</a>.
                    </span>
                    <br style="font-family: 'Roboto',sans-serif;">
                    <a href="http://localhost:3000/auth/activate-account?activate_token=${activate_token}">
                    <button type="button"
                        style="font-family: 'Roboto',sans-serif;background-color: black;cursor:pointer;color: white; margin-top: 20px; border-radius: 15px;padding: 10px 30px;">ACTIVATE
                        YOUR ACCOUNT</button>
                        </a>

                </td>
            </tr>
        </table>
    </div>
            `
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

const sendResetPasswordMail = async (name, email, reset_token) => {
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

        const mailOptions = {
            from: process.env.emailUser,
            to: email,
            subject: 'Reset your KonnectEd Password',
            html: `
            <div style="height: 100%;width: 40%;background-color:#fff; border-radius: 5px;border: 1px solid #e5e7eb; --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);">
        <table width="100%%" align="center"
            style="font-family: 'Roboto',sans-serif; background-color: #fff; padding: 50px; margin: 10px auto;">
            <tr style="font-family: 'Roboto',sans-serif;">
                <td align="center" colspan="2" style="font-family: 'Roboto',sans-serif;">
                    <span class="logo" style="font-family: 'Roboto',sans-serif;font-size: 2.5em;word-spacing: -3px;"><b
                            style="font-family: 'Roboto',sans-serif;">KonnectED</b></span>
                </td>
            </tr>

            <tr style="font-family: 'Roboto',sans-serif;">
                <td colspan="2" style="font-family: 'Roboto',sans-serif;">
                    <h3>Password Reset</h3>
                    <span class="heading" style="font-family: 'Roboto',sans-serif;font-size: 18px;">Hello <b style="color:#000;">${name}</b>, You
                        have requested a password reset.</span> <span class="para"
                        style="font-family: 'Roboto',sans-serif;line-height: normal;font-size: 18px;">
                        Use the code <b style="font-size: 18px;">${reset_token}</b> to reset your password. Do not share this
                        message or code with anyone, and KonnectEd won't ask for this code in the future too.
                    </span>
                </td>
            </tr>
        </table>
    </div>
            `
        }

        transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Reset email is sent:- ", info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }
}

const loadActivateAccount = async (req, res) => {
    try {
        const activate_token = req.query.activate_token;
        console.log(activate_token);

        const q = `SELECT * FROM users WHERE activate_token = '${activate_token}';`;

        console.log(q);
        db.query(q, (err, data) => {
            if (err) return res.status(409).json(err.message);
            if (data.rows.length == 0) return res.status(404).json("Error when activating. Please Check your link!");

            const q = `UPDATE users SET is_activated = '1', activate_token = '' WHERE activate_token = '${activate_token}';`

            db.query(q, (err, data) => {
                if (err) return res.json(err.message);
                console.log("Activated!");
                res.status(200).json("Account Activated!");
            })
        });

        // const activateTokenData = await User.findOne({ activate_token: activate_token });

        // if (activateTokenData) {
        //     await User.findByIdAndUpdate({ _id: activateTokenData._id }, { $set: { is_activated: 1, activate_token: '' } });
        //     res.render('auths/user-registered', { message: 'activated successfully. You can now login your account and access to your dashboard.' });
        // }
        // else {
        //     res.render('404');
        // }
    } catch (error) {
        console.log(error.message);
    }
}
const resetPassword = async (req, res) => {
    try {
        console.log("Here! I am! Here!");
        const email = req.body.email ? req.body.email : '';
        const code = req.body.code;
        const password = req.body.password;

        if (code == '') {
            const q = `SELECT * FROM users
            WHERE email = '${email}';`

            console.log(q);
            db.query(q, (err, data) => {
                if (err) return res.status(409).json(err.message);
                if (data.rows.length == 0) return res.status(404).json("User not found! Please check your email!");

                const name = data.rows[0].name;
                const username = data.rows[0].username;
                const randomString = randomstring.generate(4);

                const q = `UPDATE users SET reset_token = '${randomString}' 
                    WHERE email = '${email}' 
                    AND username = '${username}';`

                db.query(q, (err, data) => {
                    if (err) return res.json(err.message);
                    sendResetPasswordMail(name, email, randomString).then(() => {
                        console.log("Sent Reset Message!");
                        return res.status(200).json("Reset message has been sent!");
                    }).catch((err) => {
                        return res.status(500).json(err.message);
                    });
                })
            })
        } else {
            const q = `SELECT * FROM users
            WHERE email = '${email}' AND reset_token = '${code}';`
            db.query(q, async (err, data) => {
                if (err) return res.json(err.message);
                if (data.rows.length == 0) return res.status(404).json("Incorrect Reset Code or Email Address!");

                const username = data.rows[0].username;
                const hashedPassword = await securePassword(password);

                const q = `UPDATE users SET 
                    password = '${hashedPassword}', reset_token = '' 
                    WHERE email = '${email}' 
                    AND username = '${username}';`

                console.log(q);

                db.query(q, (err, data) => {
                    if (err) return res.json(err.message);
                    console.log("Password has been changed!");
                    res.status(200).json("Your password has been changed.");
                })
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}


// const jwtGenerator = (user_id) => {
//     console.log(process.env.TOKEN_SECRET);
//     const payload = {
//         user: {
//             id: user_id
//         }
//     };
//     return jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: "7d"});
// }

const register = (req, res) => {
    // Check existing user
    const { name, username, email, password } = req.body;
    const q = `SELECT * FROM users
        WHERE (email = '${email}');`
    var format = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!format.test(email)) return res.status(409).json("Invalid email format.");
    db.query(q, async (err, data) => {
        if (err) return res.json(err.message);
        if (data.rows.length > 0) return res.status(409).json("User already exists with this email.");
        const q = `SELECT * FROM users
        WHERE (username = '${username}');`
        db.query(q, async (err, data) => {
            if (data.rows.length > 0) return res.status(409).json("Username is already taken.");
            // Hash the psw and create usr
            const hashedPassword = await securePassword(password);
            const randomString = randomstring.generate();

            const q = `INSERT INTO users(name,username,email,password,rank,level,activate_token) VALUES (
            '${name}',
            '${username}',
            '${email}',
            '${hashedPassword}',
            1,
            12,
            '${randomString}'
            );`;
            db.query(q, (err, data) => {
                if (err) return res.json(err.message);

                sendAccountActivationMail(name, email, randomString).then(() => {
                    return res.status(200).json("User has been Created!");
                }).catch((err) => {
                    return res.status(500).json(err.message);
                });
            });
        })
    });
}

const login = (req, res) => {
    // check user
    const { username, email } = req.body;
    const q = `SELECT * FROM users
        WHERE (username = '${username}');`
    db.query(q, (err, data) => {
        if (err) return res.json(err.message);
        if (data.rows.length == 0) return res.status(401).json("Incorrect username or password!");
        // Check the psw
        const isPswCorrect = bcrypt.compareSync(req.body.password, data.rows[0].password);

        if (!isPswCorrect) return res.status(401).json("Incorrect username or password!");

        if (!data.rows[0].is_activated) return res.status(403).json("Please activate your account through mail!");

        const token = jwt.sign({ id: data.rows[0].id }, "jwtkey");
        const { id, name, username, email, avatar, is_admin, tinymce, gpt, coins, ...other } = data.rows[0];

        req.session.token = token;
        req.session.save();
        res.status(200).json({ id, username, name, email, avatar, tinymce, gpt, token, coins });
    });
}

const logout = (req, res) => {
    req.session.destroy();
    res.status(200).json("User has logged out!");
}

module.exports = {
    register,
    login,
    logout,
    loadActivateAccount,
    resetPassword
}
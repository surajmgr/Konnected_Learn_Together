const Pool = require('pg').Pool;
require('dotenv').config()

const pool = new Pool({
    user: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: 'konnected'
});

module.exports = {
    pool
}

// // Online Postgres

// var pg = require('pg');
// //or native libpq bindings
// //var pg = require('pg').native

// var conString = process.env.elephantSql //Changed eSQL Link
// var pool = new pg.Client(conString);
// pool.connect(function(err) {
//   if(err) {
//     return console.error('could not connect to postgres', err);
//   }
//   pool.query('SELECT name FROM ranks WHERE id=1;', function(err, result) {
//     if(err) {
//       return console.error('error running query', err);
//     }
//     console.log("Database connected!");
//     // >> output: 2018-08-23T14:02:57.117Z
//     // pool.end();
//   });
// });

// module.exports = {
//     pool
// }
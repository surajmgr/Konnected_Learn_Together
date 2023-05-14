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

// var pg = require('pg');
// //or native libpq bindings
// //var pg = require('pg').native

// var conString = "postgres://disxpdlt:RYjZ8q3PWJsfNbtfhzhco42UdNR0PYkS@satao.db.elephantsql.com/disxpdlt" //Can be found in the Details page
// var pool = new pg.Client(conString);
// pool.connect(function(err) {
//   if(err) {
//     return console.error('could not connect to postgres', err);
//   }
//   pool.query('SELECT * FROM ranks;', function(err, result) {
//     if(err) {
//       return console.error('error running query', err);
//     }
//     console.log(result.rows);
//     // >> output: 2018-08-23T14:02:57.117Z
//     // pool.end();
//   });
// });

// module.exports = {
//     pool
// }
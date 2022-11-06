const mysql = require ('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'Abhi@611676g'
})

module.exports = pool.promise();
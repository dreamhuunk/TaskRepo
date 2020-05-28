require('dotenv').config({ path: process.cwd() + '/config/.env' });

require('./consumers/consumer');

const db = require('./config/db.config');


db.sequelize
    .authenticate().then(function (err) {
        console.log("Connection Successful");
        }).catch(function (err) {
        console.log("Problem while connecting to db");
        throw err;
    });

console.log("Awaiting messages");    
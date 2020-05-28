require('dotenv').config({ path: process.cwd() + '/config/.env' });



const db = require('./config/db.config');

require('./consumers/summary_consumer');
require('./consumers/game_consumer');


db.sequelize
    .authenticate().then(function (err) {
        console.log("Connection Successful");
        }).catch(function (err) {
        console.log("Problem while connecting to db");
        throw err;
    });

console.log("Awaiting messages");    
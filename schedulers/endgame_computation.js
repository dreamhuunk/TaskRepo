/*jshint sub:true*/

const db = require('../config/db.config');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;

const BetSummary = db.betSummary;
const Bets = db.bets;

exports.endGameComputation = async function (gameObj) {

    const gameJson = JSON.parse(gameObj.value);

    const gameID = gameJson['game_id'];
    const winningNumber =  gameJson['bet_number'];



    console.log(gameJson);

};

/*jshint sub:true*/
const db = require('../config/db.config');
const Sequelize = db.Sequelize;

const BetSummary = db.betSummary;
const Bets = db.bets;



exports.summariseBets = async function (betObj) {
    const betJson = JSON.parse(betObj.value);
    const betID = betJson["bet_id"];
    const Bet = await Bets.findByPk(betID);


    const betAmount = Bet.getBetAmount();
    const gameID = Bet.getGameID();
    const userID = Bet.getUserID();
    const betNumber = Bet.getBetNumber();

    const t = await db.sequelize.transaction();

    let bet = {
        gameID: gameID,
        userID: userID,
        betNumber: betNumber,
        totalBetAmount: betAmount
    };



    try {

        const betSummaryRow = await BetSummary.findOne(
            {
                where: {
                    gameID: gameID,
                    userID: userID,
                    betNumber: betNumber
                }
            }, { transaction: t }
        );

        if (!betSummaryRow) {
            console.log("User has't placed bet previously");
            await BetSummary.create(bet, { transaction: t });
            console.log(betID + " Summarised");
        }
        else {
            let existingBetAmount = betSummaryRow.getTotalBetAmount();

            let updatedBetAmount = betAmount + existingBetAmount;

            let updatedRows = await BetSummary.update({ totalBetAmount: updatedBetAmount }, {
                where: {
                    gameID: gameID,
                    userID: userID,
                    betNumber: betNumber
                }
            }, { transaction: t });

            if(!updatedRows)
            {
                throw new Error();
            }
        }

        await t.commit();
    }
    catch (error) {
        
        await t.rollback();
        console.log(error.message);
    }






};
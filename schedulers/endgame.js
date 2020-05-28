/*jshint sub:true*/
const db = require('../config/db.config');

const BetSummary = db.betSummary;
const Bets = db.bets;
const Casino = db.casino;


/*
    We will sum the gameBets and update in to casino Balance
    Payout the total will get tallied out

    Eg : 
    10 users are placing bets for $10 in a game

    out of which 2 place the bet on the winning  number

    each user gets 2 the amount $20 credited to their account ie $40 in total

    total betamounts received by casino  $100

    upon checkout casino pays out $20 to each user 

    profit = $60 ($100-(20+20))
*/


/*
    Skipped updating the betstatus as it can be dervived from the game (via fk gameID)

    Reason for skipping let us consider a case we have million user making 20 bets each that accounts to 20 million bet

    we have to update 20 million records with either success or failure


    instead it can be lazy loaded when user access the bet end point that to can be paginated :)
*/

exports.endGameComputation = async function (gameObj) {

    const gameJson = JSON.parse(gameObj.value);

    const gameID = gameJson['game_id'];
    const winningNumber =  gameJson['bet_number'];
    const casinoID = gameJson['casino_id'];

    console.log(gameJson);



    const t = await db.sequelize.transaction();
    try
    {
        let betSummaryRows  = await BetSummary.findAll({
            attributes: [[db.sequelize.fn('sum', db.sequelize.col('totalBetAmount')), 'gameAmount']],
            where : {
                gameID : gameID
            }
        });
        if(betSummaryRows && betSummaryRows.length == 1)
        {
            let bet =  betSummaryRows[0];

            let betAmount = parseFloat(bet.dataValues.gameAmount);

            let casino = await Casino.findByPk(casinoID);

            if(!casino)
            {
                throw Error();
            }

            let existingBalance = casino.getBalanceAmount();

            let updatedBalance = betAmount +  existingBalance;

            let updatedRows = await Casino.update({
                BalanceAmount:  updatedBalance 
            },{
                where: {
                    casinoID : casinoID
                },
                transaction: t
            });
        }
        await t.commit();
    }
    catch(err)
    {
        console.log(err.message);
    }

    



};

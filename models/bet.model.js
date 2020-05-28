module.exports = function (sequelize, Sequelize) {

    const Bets = sequelize.define('bet', {
        betID: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        betNumber: 
        {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        betAmount: {
          type: Sequelize.DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: '0.00'
        },
        betTime: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')

        },
        betStatus: {
            type: Sequelize.DataTypes.INTEGER(2),
            allowNull: false,
            defaultValue: '0'
        }

      },
      {
        timestamps: false,
        indexes: [
          {
            name: 'unsettled_bets_in_game',
            fields: ['gameID','betNumber','betStatus'] 
            // where: {
            //   betStatus: '0'             //Mysql doesn't support partial index fully hence this wont work
            // }                                                   
          }
          
        ]
      }
    );


    Bets.prototype.getBetID = function () {
      return this.betID;
    };

    Bets.prototype.getBetAmount = function() {
      return parseFloat(this.betAmount);
    };

    Bets.prototype.getBetNumber = function() {
      return this.betNumber;
    };

    Bets.prototype.getUserID = function() {
      return this.userID;
    };

    Bets.prototype.getGameID = function() {
      return this.gameID;
    };

    return Bets;

};
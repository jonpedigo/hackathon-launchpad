const mongoose = require("mongoose")
const config = require("../config")
mongoose.Promise = require("bluebird")
const GameState = require('../db/GameState')
const mongoOpts = { useMongoClient: true }
const mongoUrl = config.mongodb

mongoose
  .connect(mongoUrl, mongoOpts).then(async () => {
    const gameState = await GameState.findOne({_id: config.currentGameStateId})
    const itemList = [];

    // to setup current game parameters
    const game = require('../nonusers/game')().init(gameState);

    // list all services you wanna use
    require('../nonusers/trees')(game).init(game.itemList);
    require('../nonusers/time')(game).init(game.itemList);
    require('../users/pedigojon@gmail.com')(game).init(game.itemList);
    require('../users/spencejw@gmail.com')(game).init(game.itemList);
    require('../users/spencejw@gmail.com/index2')(game).init(game.itemList);

    gameState.itemList = game.itemList
    gameState.save().then((game) => {
      console.log('initialized ' + game.itemList.length + ' game items')
    }).catch(e => console.log(e));
  })
  .catch(e => console.log(e))

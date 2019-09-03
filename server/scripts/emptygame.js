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
    gameState.itemList = [];
    gameState.logs = [];
    gameState.save().then((game) => {
      console.log('initialized ' + game.itemList.length + ' game items')
    }).catch(e => console.log(e));
  })
  .catch(e => console.log(e))

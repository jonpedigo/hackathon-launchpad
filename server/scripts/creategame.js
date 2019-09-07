const mongoose = require("mongoose")
const config = require("../config")
mongoose.Promise = require("bluebird")
const GameState = require('../db/GameState')
const mongoOpts = { useMongoClient: true }
const mongoUrl = config.mongodb

mongoose
  .connect(mongoUrl, mongoOpts).then(() => {
    GameState.create({itemList: [], deadItemList: []}).then((game) => {
      console.log('game created: ', game.id)
    })
  })
  .catch(e => console.log(e))

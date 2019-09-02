const mongoose = require('mongoose')
const GameState = require("./db/GameState")
const config = require('./config')

module.exports = async function(io){
  // init game
  const gameState = await GameState.findOne({_id: config.currentGameStateId})
  const game = require('./nonusers/game')().init(gameState);

  // game modifications
  const gameModifications = [];
  gameModifications.push(require('./nonusers/trees')(game));
  gameModifications.push(require('./users/sample@gmail.com')(game));
  // special scenario - must be last
  gameModifications.push(require('./nonusers/game')(game));

  gameModifications.forEach(({setup, update}) => {
    setup();
    game.updates.push(update);
  })

  // start game
  setInterval(() => {
    io.emit('update game', game.itemList)
  }, 600)

  setInterval(() => {
    gameState.itemList = game.itemList
    gameState.save().then(() => {
      console.log('game ' + gameState.id + ' saved')
    }).catch((e) => console.log('failed to save', e))
  }, 60000)
  console.log('game ' + game.id + ' started');

  // listen for events
  game.on = (socket, event, data) => {
    if(event === 'input'){
      gameModifications.forEach(({input}) => {
        if(input) input(socket.user, data)
      })
    }
  }

  return game
}

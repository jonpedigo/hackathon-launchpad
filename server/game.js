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

  const socketsPlaying = [];
  // start game
  setInterval(() => {
    socketsPlaying.forEach((socket)=> {
      socket.emit('update game', game.itemList)
    })
  }, 600)

  setInterval(() => {
    gameState.itemList = game.itemList
    gameState.save().then(() => {
      console.log('game ' + gameState.id + ' saved')
    }).catch((e) => console.log('failed to save', e))
  }, 60000)
  console.log('game ' + game.id + ' started');

  return {
    addSocket: (socket) => {
      socket.on('listen for game updates', () => {
        console.log(socket.user.username + ' joined')
        socketsPlaying.push(socket)
        socket.emit('init game', game.itemList)
      })
      gameModifications.forEach(({input}) => {
        if(input) {
          socket.on('input', (data) => { input(socket.user, data)})
        }
      })
    }
  }
}

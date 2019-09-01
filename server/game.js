const mongoose = require('mongoose')
const GameState = require("./db/GameState")
const config = require('./config')

module.exports = async function(io){
  const gameState = await GameState.findOne({_id: config.currentGameStateId})
  const game = {
    id: gameState.id,
    itemList: gameState.itemList,
    items: gameState.itemList.reduce((obj, item) => {
      obj[item.name] = item
      return obj
    }),
    updates: [],
  };

  const gameModifications = [];
  gameModifications.push(require('./nonusers/trees')(game, io));
  gameModifications.push(require('./users/sample@gmail.com')(game, io));

  //special scenario - must be last
  gameModifications.push(require('./nonusers/world')(game, io));
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

    gameState.itemList = game.itemList
    gameState.save().then(() => {
      // console.log('game ' + gameState.id + ' saved')
    }).catch((e) => console.log('failed to save', e))
  }, 600)
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

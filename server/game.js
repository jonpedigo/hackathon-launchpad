const mongoose = require('mongoose')
const GameState = require("./db/GameState")
const config = require('./config')

module.exports = async function(socket){
  const gameState = await GameState.findOne({_id: config.currentGameStateId})
  const game = {
    itemList: gameState.itemList,
    items: gameState.itemList.reduce((obj, item) => {
      obj[item.name] = item
      return obj
    }),
    updates: [],
  };

  const gameModifications = [];
  gameModifications.push(require('./nonusers/trees')(game, socket));
  gameModifications.push(require('./users/pedigojon@gmail.com')(game, socket));

  //special scenario - must be last
  gameModifications.push(require('./nonusers/world')(game, socket));
  gameModifications.forEach(({setup, update}) => {
    setup();
    game.updates.push(update);
  })

  const socketsPlaying = [];
  socket.on('listen for game updates', () => {
    socketsPlaying.push(socket)
    socket.emit('init game', game.itemList)
  })

  // start game
  setInterval(() => {
    socketsPlaying.forEach(()=> {
      socket.emit('update game', game.itemList)
    })

    gameState.itemList = game.itemList
    gameState.save().then(() => {
      console.log('game ' + gameState.id + ' saved')
    }).catch((e) => console.log('failed to save', e))
  }, 600)
}

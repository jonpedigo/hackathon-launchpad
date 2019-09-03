const mongoose = require('mongoose')
const GameState = require("./db/GameState")
const config = require('./config')

module.exports = async function(io){
  // init game
  const gameState = await GameState.findOne({_id: config.currentGameStateId})
  const gameService = require('./nonusers/game')();
  const game = gameService.init(gameState)

  // game modifications
  const gameModifications = [];
  gameModifications.push(require('./nonusers/trees')(game));
  gameModifications.push(require('./users/sample@gmail.com')(game));

  gameModifications.forEach(({setup}) => {
    setup();
  })
  gameService.setup()

  // start game
  let previousUpdateTime = Date.now()
  setInterval(() => {
    // store current game state and log length
    let oldLogsLength = game.logs.length
    let oldItemList = game.itemList.map((gameItem) => {
      return Object.assign({}, gameItem)
    })

    //update game
    let delta = Date.now() - previousUpdateTime
    gameModifications.forEach(({update}) => {
      update(delta);
    })
    gameService.update(delta)
    previousUpdateTime = Date.now()

    //package and send game state update for server
    const gameItemUpdate = game.generateGameItemUpdate(oldItemList, game.items, game.itemList)
    io.emit('update game', gameItemUpdate)

    //send new logs if there are any
    if(oldLogsLength < game.logs.length) {
      io.emit('new logs', game.logs.slice(oldLogsLength))
    }
  }, 600)
  console.log('game ' + game.id + ' started');

  // save every ten minutes
  setInterval(() => {
    gameState.itemList = game.itemList
    gameState.logs = game.logs
    gameState.markModified('itemList')
    gameState.markModified('logs')
    gameState.save().then(() => {
      console.log('game ' + gameState.id + ' saved')
    }).catch((e) => console.log('failed to save', e))
  }, 60000)

  //listen for events
  game.on = (socket) => {
    socket.on('input', (data) => {
      gameModifications.forEach(({input}) => {
        if(input) input(socket.user, data)
      })
    })
    socket.on('ask for init game state', (data) => {
      socket.emit('init game', game.itemList)
    })
    socket.on('ask for log history', (data) => {
      socket.emit('log history', game.logs)
    })
    socket.on('send logs', (data) => {
      io.emit('new logs', [data])
    })
  }

  return game
}

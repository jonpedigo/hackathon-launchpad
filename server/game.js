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

  gameModifications.forEach(({setup, update}) => {
    setup();
    game.updates.push(update);
  })

  // start game
  let previousUpdateTime = Date.now()
  setInterval(() => {
    let delta = Date.now() - previousUpdateTime

    const oldItemList = game.itemList.map((gameItem) => {
      return Object.assign({}, gameItem)
    })

    game.updates.forEach((update) => {
      update(delta)
    })

    gameService.update(delta)

    const gameItemUpdate = game.generateGameItemUpdate(oldItemList, game.items, game.itemList)

    // oldItemList.forEach((item) => {
    //   if(item.name === 'grass_197') console.log(item.x)
    // })
    // console.log(game.items['grass_197'].x)
    console.log(gameItemUpdate.updated.length)
    io.emit('update game', gameItemUpdate)
    previousUpdateTime = Date.now()
  }, 600)
  console.log('game ' + game.id + ' started');

  setInterval(() => {
    gameState.itemList = game.itemList
    gameState.save().then(() => {
      console.log('game ' + gameState.id + ' saved')
    }).catch((e) => console.log('failed to save', e))
  }, 600000)

  //listen for events
  game.on = (socket, event, data) => {
    if(event === 'input'){
      gameModifications.forEach(({input}) => {
        if(input) input(socket.user, data)
      })
    }
    if(event === 'ask for init game state'){
      socket.emit('init game', game.itemList)
    }
  }

  return game
}

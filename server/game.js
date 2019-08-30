const mongoose = require('mongoose');

function Game(socket){
  const game = {
    state: [],
    stateLookup: {},
    updates: [],
  };

  const gameModifications = [];
  gameModifications.push(require('./nonusers/trees')(game, socket, mongoose));
  gameModifications.push(require('./users/pedigojon@gmail.com')(game, socket, mongoose));

  //special scenario - must be last
  gameModifications.push(require('./nonusers/world')(game, socket, mongoose));

  gameModifications.forEach(({init}) => {
    init();
  })
  gameModifications.forEach(({setup, update}) => {
    setup();
    game.updates.push(update);
  })

  const socketsPlaying = [];
  socket.on('listen for game updates', () => {
    socketsPlaying.push(socket)
    socket.emit('init game', game.state)
  })

  // start game
  setInterval(() => {
    socketsPlaying.forEach(()=> {
      socket.emit('update game', game.state)
    })
  }, 100)
}

module.exports = Game;

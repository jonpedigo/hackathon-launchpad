module.exports = (socket) => {
  const gameState = [];
  for (let i = 0; i < 50; i++) {
    gameState.push({
      x: i * 40,
      y: i * 40,
      character: 'W',
      color: 'white',
    })
  }

  const socketsPlaying = [];

  socket.on('listen for game updates', () => {
    socketsPlaying.push(socket)
    console.log('...?')
    socket.emit('initialize game', gameState)
  })

  setInterval(() => {
    socketsPlaying.forEach(()=> {
      socket.emit('update game', gameState)
    })
  }, 100)
}

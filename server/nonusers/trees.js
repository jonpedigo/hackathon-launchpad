//populates the world with trees
module.exports = function(game, socket, mongoose){
  function init(){
    for (let i = 0; i < 50; i++) {
      game.state.push({
        x: i,
        y: i,
        character: 'T',
        sprite: 'tree-1',
        color: 'green',
        name: 'tree-' + i,
        hard: true,
      })
    }
  }

  function setup(){

  }

  function update(){

  }

  return {
    init,
    setup,
    update,
  }
}

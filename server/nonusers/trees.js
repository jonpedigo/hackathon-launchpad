//populates the world with trees
module.exports = function(game, socket, mongoose){
  function init(items){
    for (let i = 0; i < 50; i++) {
      items.push({
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

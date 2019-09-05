// DESCRIPTION: populate world with trees

/*

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        PUBLIC FUNCTIONS
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

*/


/*

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
          EXPORT
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

*/

module.exports = function(game){
  function init(items){
    game.forEveryGridNode(game, (gridNode, x, y) => {
      items.push({
        name: `grass_x${x}y${y}`,
        x: x,
        y: y,
        z: -1,
        character: 'G',
        sprite: 'grass-1',
        color: 'green',
        tags: ['grass'],
      })
      if(Math.random() > .7){
        items.push({
          name: `tree_x${x}y${y}`,
          x: x,
          y: y,
          z: 0,
          character: 'T',
          sprite: 'tree-1',
          color: 'green',
          obstacle: true,
          tags: ['tree'],
        })
      }
    })
  }

  function setup(){
    // game.tags.tree.forEach((tree) => {
    //   tree._life = 10
    // })
  }

  function update(delta){
    // game.tags.tree.forEach((tree) => {
    //   if(!tree.dead){
    //     if(tree._hp) tree._hp--
    //     else tree._hp = 10
    //     if(tree._hp <= 0) tree.destroy()
    //   }
    // })
  }

  return {
    init,
    setup,
    update,
  }
}


/*

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
          PRIVATE FUNCTIONS
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

*/

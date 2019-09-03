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
        x: x,
        y: y,
        character: 'G',
        sprite: 'grass-1',
        color: 'green',
        name: `grass_x${x}y${y}`,
        hard: false,
        tags: ['grass']
      })
      if(Math.random() > .7){
        items.push({
          x: x,
          y: y,
          character: 'T',
          sprite: 'tree-1',
          color: 'green',
          name: `tree_x${x}y${y}`,
          hard: true,
          tags: ['tree'],
        })
      }
    })
  }

  function setup(){
    // game.tags.tree.forEach((tree) => {
    //   tree.destroy = function(){
    //     tree.dead = true
    //     tree.invisible = true
    //   }
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

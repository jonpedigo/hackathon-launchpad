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
        name: 'grass-' + (x + y),
        hard: false,
      })
      if(Math.random() > .7){
        items.push({
          x: x,
          y: y,
          character: 'T',
          sprite: 'tree-1',
          color: 'green',
          name: 'tree-' + (x + y),
          hard: true,
        })
      }
    })
  }

  function setup(){

  }

  function update(delta){

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

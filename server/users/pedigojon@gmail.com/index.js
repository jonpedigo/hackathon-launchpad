// DESCRIPTION: a guy who likes to chop wood and make fires. When theres a fire, hes at peace

const PF = require('pathfinding');
const finder = new PF.AStarFinder();

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

  let currentPath = []
  let entarkia = null

  // add all items to databas
    // runs on initialize game script
  function init(itemList){
    const { x, y } = game.findOpenGridNear(game, 10,10)
    game.itemList.push({
      name: 'entarkia',
      x,
      y,
      z: 2,
      character: 'E',
      tags: ['human'],
      color: 'brown',
      flags: {

      }
    })
  }

  // setup game logic
    // runs every time server is started
  function setup(){
    entarkia = game.items.entarkia
  }

  // trigger, collisions
    // runs every update about 100 milliseconds
  function update(delta){
    // if(!currentPath.length) {
    //   currentPath = finder.findPath(entarkia.x, entarkia.y, 4, 2, game.pathfindingGrid);
    // }
    if (currentPath.length) {
      let [nextX, nextY] = currentPath.shift()
      entarkia.x = nextX
      entarkia.y = nextY
    }

    const { x, y } = game.walkAround(game, entarkia, { intelligence: 'basic'})
    entarkia.x = x
    entarkia.y = y
  }

  // on player input
  function input(user, data){
    if(user.username !== 'pedigojon@gmail.com') return
  }

  return {
    init,
    input,
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

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
      _life: 100,
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
    game.registerMod(game, 'dat mothafucka', _move)
    // game.addUpdate(game, { name: 'dat mothafucka', duration: 10 }, entarkia)
  }

  // trigger, collisions
    // runs every update about 100 milliseconds
  function update(delta){

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


// a core update function
function _move(game, delta) {
  console.log(this)
  // if(!currentPath.length) {
  //   currentPath = finder.findPath(entarkia.x, entarkia.y, 4, 2, game.pathfindingGrid);
  // }
  if (this._currentPath && is._currentPath.length) {
    let [nextX, nextY] = this._currentPath.shift()
    this.x = nextX
    this.y = nextY
  }

  if(Math.random() > .3) {
    let { x, y } = game.walkAround(game, this, { intelligence: 'basic'})
    this.x = x
    this.y = y
  }
}

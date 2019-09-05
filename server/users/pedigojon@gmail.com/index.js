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
    let { x, y } = game.findOpenGridNear(game, 10,10)
    game.itemList.push({
      name: 'entarkia',
      x,
      y,
      z: 1,
      _life: 100,
      character: 'E',
      tags: ['human'],
      color: 'brown',
      flags: {

      }
    })
    let housegrid = game.findOpenGridNear(game, 10,10)
    game.itemList.push({
      name: 'home_in_clearing',
      x: housegrid.x,
      y: housegrid.y,
      z: 0,
      sprite: 'house-1',
      tags: ['house'],
      flags: {

      }
    })
  }

  // setup game logic
    // runs every time server is started
  function setup(){
    entarkia = game.items.entarkia
    game.addUpdate(game, { core: _move }, entarkia)
    game.addUpdate(game, { core: _woodchop }, entarkia)
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
  //if you have a path, walk it!
  if (this._currentPath && this._currentPath.length) {
    let [nextX, nextY] = this._currentPath.shift()
    this.x = nextX
    this.y = nextY
    // console.log(`moving to ${nextX} ${nextY}`)
    return
  }

  // if you have wood and you found what your looking for
  if(this.hasWood && this._currentPath && !this._currentPath.length) {
    console.log('has wood, going home')

    this.hasWood = false
    this.sittingAtFire = true
    // need to create a fire now
    game.logs.push('Entarkia has lit a fire with his firewood, he is at peace and welcomes company')
    let {x, y} = game.findOpenGridNear(game, game.items.home_in_clearing.x, game.items.home_in_clearing.y)
    game.itemList.push({
      name: 'entarkias_fire',
      tags: ['fire'],
      emitter: 'flame',
      x: x,
      y: y,
      _life: 100,
    })
  }

  // if you dont have a path, just walk around
  console.log('random walking')
  if(Math.random() > .3) {
    let { x, y } = game.walkAround(game, this, { intelligence: 'basic'})
    this.x = x
    this.y = y
  }
}

function _woodchop(game, delta) {
  // dont woodchip if ya got wood!
  if (this.hasWood) return
  // if your walking to a tree or something, dont woodchop
  if (this._currentPath && this._currentPath.length) return

  const nearbyTrees = game.findItemNearby(game, this.x, this.y, ['tree'])
  if(nearbyTrees.length){
    // you found a tree! walk towards it
    console.log('beginning walk towards tree')

    const nearbyTree = nearbyTrees[0]
    const openGrid = game.findOpenGridNear(game, nearbyTree.x, nearbyTree.y)
    this._currentPath = finder.findPath(this.x, this.y, openGrid.x, openGrid.y, game.pathfindingGrid);

    if(this._currentPath.length === 1){
      // if your are next to tree, chop tree
      console.log('chopping tree')
      nearbyTree._life = -1
      this.hasWood = true
      this._currentPath = finder.findPath(this.x, this.y, game.items.home_in_clearing.x, game.items.home_in_clearing.y, game.pathfindingGrid);
    }
  }
}

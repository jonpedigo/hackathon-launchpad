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
    console.log(entarkia)

    entarkia._behavior = 'look_for_tree'
    game.addUpdate(game, { core: _update }, entarkia)
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

function _update(game, delta) {
  console.log('current behavior', this._behavior)

  //if you have a path, walk it!
  if (this._path && this._path.length) {
    let [nextX, nextY] = this._path.shift()
    this.x = nextX
    this.y = nextY
    console.log(`moving to ${nextX} ${nextY}`)
  }

  if(this._behavior === 'default' || this._behavior === 'look_for_tree') {
    // if you dont have a path, just walk around
    if(Math.random() > .3) {
      let { x, y } = game.walkAround(game, this, { intelligence: 'basic'})
      this.x = x
      this.y = y

      const nearbyTrees = game.findItemNearby(game, this.x, this.y, ['tree'], { x: this.x, y: this.y})
      if(nearbyTrees.length){
        // you found a tree! walk towards it
        console.log('beginning walk towards tree')
        const nearbyTree = nearbyTrees[0]
        this._path = game.findOpenPath(game, this.x, this.y, nearbyTree.x, nearbyTree.y);
        this._behavior = 'chop_tree'
        this._goalTree = nearbyTree
      }
    }

    return
  }

  if(this._behavior === 'chop_tree') {
    if(this._path.length === 0){
      // if your are next to tree, chop tree
      console.log('chopping tree')
      this._goalTree._life = -1
      this._path = game.findOpenPath(game, this.x, this.y, game.items.home_in_clearing.x, game.items.home_in_clearing.y);
      this._behavior = 'light_fire'
    }

    return
  }

  if(this._behavior === 'light_fire') {
    // if you are at fire location
    if(this._path.length === 0){
      // need to create a fire now
      game.logs.push('Entarkia has lit a fire with his firewood, he welcomes company')
      let {x, y} = game.findOpenGridNear(game, game.items.home_in_clearing.x, game.items.home_in_clearing.y, true)
      game.itemList.push({
        name: 'entarkias_fire',
        tags: ['fire'],
        emitter: 'flame',
        sprite: 'firepit-1',
        x: x,
        y: y,
        z: 0,
        _life: 100,
      })
      this._behavior = 'sit_with_fire'
    }


    return
  }

  if(this._behavior === 'sit_with_fire') {

    return
  }
}

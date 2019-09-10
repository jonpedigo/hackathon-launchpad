// DESCRIPTION: a guy who likes to chop wood and make fires. When theres a fire, hes at peace

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
    let { x, y } = game.forceFindOpenGridNear({ position: { x: 10, y: 10}})
    game.itemList.push({
      name: 'entarkia',
      x,
      y,
      z: 1,
      _life: game.generateDuration(7, 'days'),
      character: 'E',
      sprite: 'entarkia-1',
      tags: ['human'],
      color: 'brown',
      flags: {

      }
    })
    let housegrid = game.forceFindOpenGridNear({ position: { x: 10, y: 10 }})
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
    entarkia._behavior = 'sit_with_fire'
    game.addUpdate({ core: _update }, entarkia)
    entarkia.obstacle = true
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
  // console.log('current behavior', this._behavior)

  if(this._behavior === 'default' || this._behavior === 'look_for_tree') {
    // if you dont have a path, just walk around
    if(Math.random() > .3) {
      let { x, y } = game.walkAround({ object: this, intelligence: 'basic'})
      this.x = x
      this.y = y

      const nearbyTrees = game.findItemNearby({ tags: ['tree'], position: {x: this.x + 15, y: this.y + 15}, prioritizeNear: { x: this.x, y: this.y}})
      if(nearbyTrees.length){
        // you found a tree! walk towards it
        // console.log('beginning walk towards tree')
        const nearbyTree = nearbyTrees[0]
        this._path = game.findOpenPath({ fromPosition: this, toPosition: nearbyTree});
        this._behavior = 'chop_tree'
        this._goalTree = nearbyTree
      }
      return
    }
  }

  if(this._behavior === 'chop_tree') {
    if(this._path.length === 0){
      // if your are next to tree, chop tree
      // console.log('chopping tree')
      this._goalTree._life = -1
      this._path = game.findOpenPath({ fromPosition: this, toPosition: game.items.home_in_clearing});
      this._behavior = 'light_fire'
      return
    }
  }

  if(this._behavior === 'light_fire') {
    // if you are at fire location
    if(this._path.length === 0){
      // need to create a fire now
      game.logs.push('Entarkia has lit a fire with his firewood, he welcomes company')
      let {x, y} = game.findOpenGridNear({ position : game.items.entarkia, onlySurrounding: true})
      game.itemList.push({
        name: 'entarkias_fire',
        tags: ['fire'],
        emitter: 'flame',
        sprite: 'firepit-1',
        x: x,
        y: y,
        z: 0,
        _life: game.generateGameTimeDuration((Math.random() * .7) + .3, 'hours'),
        obstacle: true,
      })
      this._behavior = 'sit_with_fire'
      return
    }


  }

  if(this._behavior === 'sit_with_fire') {
    if(!game.items.entarkias_fire) {
      this._behavior = 'look_for_tree'
    }
    return
  }

  //if you have a path, walk it!
  if (this._path && this._path.length) {
    let [nextX, nextY] = this._path.shift()
    this.x = nextX
    this.y = nextY
    // console.log(`moving to ${nextX} ${nextY}`)
  }
}

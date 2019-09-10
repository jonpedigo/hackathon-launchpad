// DESCRIPTION: Sample game modification

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

  // add all items to databas
    // runs on initialize game script
  function init(itemList){
    let { x, y } = game.forceFindOpenGridNear({ position: { x: 10, y: 10}})
    itemList.push({
      name: 'spencer',
      x,
      y,
      z: 1,
      _life: game.generateDuration(7, 'days'),
      sprite: 'spencer-1',
      tags: ['human'],
      flags: {

      }
    })

  }

  // setup game logic
    // runs every time server is started
  function setup(){
    spencer = game.items.spencer
    spencer._behavior = 'look_for_fire'
    game.addUpdate({ core: _update }, spencer)
    spencer.obstacle = true
  }

  // trigger, collisions
    // runs every update about 100 milliseconds
  function update(delta){

  }

  // on player input
  function input(user, data){
    if(user.username !== 'jonpedigo') return

    if(data.char === 'uparrow') {

    }
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

const AMBITION = 10

function _update(game, delta) {

  console.log('current behavior', this._behavior)

  if(this._behavior === 'default' || this._behavior === 'look_for_fire') {
    // if you dont have a path, just walk around
    // let { x, y } = game.walkAround({ object: this, intelligence: 'basic'})
    // this.x = x
    // this.y = y

    const nearbyFires = game.findItemNearby({ tags: ['fire'], position: {x: this.x, y: this.y}, prioritizeNear: { x: this.x, y: this.y}, distance: { x: 10, y: 10}})
    if(nearbyFires.length){
      console.log(nearbyFires)
      this._knownFire = nearbyFires[0]
      // you found a fire! walk towards it
      // console.log('beginning walk towards tree')
      this._behavior = 'adventure'
      this._path = game.findOpenPath({ fromPosition: this, toPosition: { x: this.x + 5 + Math.floor(Math.random() * AMBITION), y: this.y - 5 + Math.floor(Math.random() * AMBITION)}});
    }
    return
  }

  if(this._behavior == 'adventure' && !this._path.length) {
    console.log(this._knownFire)
    if(this._knownFire.dead === true) {
      this._path = game.findOpenPath({ fromPosition: this, toPosition: this._knownFire });
      this._behavior = 'return_to_home'
    } else {
      this._behavior = 'rest_at_fire'
      let {x, y} = game.findOpenGridNear({ position : game.items.spencer, onlySurrounding: true})
      this._knownFire = {
        name: 'spencers_fire',
        tags: ['fire'],
        emitter: 'flame',
        sprite: 'firepit-1',
        x: x,
        y: y,
        z: 0,
        _life: game.generateGameTimeDuration((Math.random() * .3) + .3, 'hours'),
        obstacle: true,
      }
      game.itemList.push(this._knownFire)
    }
  }

  if(this._behavior === 'rest_at_fire' && this._knownFire.dead) {
    let {x, y} = game.findOpenGridNear({ position : game.items.spencer, onlySurrounding: true})
    this._knownFire = {
      name: 'spencers_fire',
      tags: ['fire'],
      emitter: 'flame',
      sprite: 'firepit-1',
      x: x,
      y: y,
      z: 0,
      _life: game.generateGameTimeDuration((Math.random() * .3) + .3, 'hours'),
      obstacle: true,
    }
    game.itemList.push(this._knownFire)
    this._behavior = 'adventure'
    this._path = game.findOpenPath({ fromPosition: this, toPosition: { x: this.x + Math.floor(Math.random() * AMBITION), y: this.y + Math.floor(Math.random() * AMBITION)}});
  }

  if(this._behavior === 'return_to_home' && !this._path.length) {
    this._behavior = 'rest_at_fire'
  }

  //if you have a path, walk it!
  if (this._path && this._path.length) {
    let [nextX, nextY] = this._path.shift()
    this.x = nextX
    this.y = nextY
    // console.log(`moving to ${nextX} ${nextY}`)
  }
}

// DESCRIPTION: define parameters of the game world, add core functions to game object

// TODO: My first character! the woodcutter

// TODO: standards for flags, tags, and other variables, x, y, z, name, etc. Write down what they all mean

// TODO: The FEELING OF TIME NEEDS TO BE ENHANCED. every stroke of the clock, things should have an age

// TODO: intelligence, strength, charisma

// TODO Pathfinding overall needs game functions, we need

//

const PF = require('pathfinding');
const finder = new PF.AStarFinder();
const moment = require('moment');
const config = require('../config');
/*


XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        PUBLIC FUNCTIONS
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

*/

function generateDuration(numberOf, timeMeasurement) {
  const gameLoops = moment.duration(numberOf, timeMeasurement)/(config.updateDelta);
  return gameLoops
}

function generateGameTimeDuration(numberOf, timeMeasurement) {
  const hoursInOneHour = 24
  const gameLoops = generateDuration(numberOf, timeMeasurement)/hoursInOneHour;
  return gameLoops
}

function getDistance(coords, comparedTo) {
  return Math.abs(comparedTo.x - coords.x) +  Math.abs(comparedTo.y - coords.y)
}

function sortByDistance(coordsA, coordsB, comparedTo){
  const diffA = getDistance(coordsA, comparedTo)
  const diffB = getDistance(coordsB, comparedTo)
  if(diffA < diffB) return -1
  else if(diffA > diffB)return 1
  else return 0
}

function forEveryGridNode(fx) {
  this.grid.forEach((row, x) => {
    row.forEach((gridNode, y) => {
      fx(gridNode, x, y)
    })
  })
}

function shouldClientUpdateGameItem(oldItem, updatedItem) {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(oldItem);
  var bProps = Object.getOwnPropertyNames(updatedItem);

  aProps.filter((propName) => {
    // no need to update when fx are initialized in setup
    if(typeof oldItem[propName] === 'function') return false
    // dont update when we add a _ item
    if(propName.charAt(0) === '_') return false
    return true
  })

  bProps.filter((propName) => {
    // no need to update when fx are initialized in setup
    if(typeof updatedItem[propName] === 'function') return false
    // dont update when we add a _ item
    if(propName.charAt(0) === '_') return false
    return true
  })


  // If number of properties is different,
  // objects are not equivalent so client should update
  if (aProps.length != bProps.length) {
    // console.log('new property added to', oldItem, updatedItem);
    return true;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    // dont check private properties
    if(propName.charAt(0) === '_') continue

    // If values of same property are not equal,
    // objects are not equivalent and client should update
    if (oldItem[propName] !== updatedItem[propName]) {
      // console.log(`${propName} has changed from ${oldItem[propName]} to ${updatedItem[propName]} on item named ${updatedItem.name}`)
      return true;
    }
  }
}

function generateGameItemUpdate(oldItemList, updatedItemLookup, updatedItemList){
  const updated = []

  for (let i = 0; i < oldItemList.length; i++) {
    const updatedItem = updatedItemLookup[oldItemList[i].name]
    if (shouldClientUpdateGameItem(oldItemList[i], updatedItem)) {
      updated.push(updatedItem)
    }
  }

  let created = []
  if (updatedItemList.length > oldItemList.length){
    created = updatedItemList.slice(oldItemList.length)
  }

  return {
    updated,
    created,
  }
}

function findItemNearby({position, tags, prioritizeNear }) {
  if(!Array.isArray(tags)) tags = [tags]

  // console.log(position)

  const { x, y } = position
  let matchingItems = this.getGameItemsFromGridByTags({ position, tags})
  if (matchingItems.length) {
    return matchingItems
  }

  const nearbyGrids = [
    { x, y: y-1},
    { x: x+1, y: y-1},
    { x: x+1, y},
    { x: x+1, y: y+1},
    { x: x, y: y+1},
    { x: x-1, y: y+1},
    { x: x-1, y},
    { x: x-1, y: y-1},
  ]

  if(prioritizeNear) {
    nearbyGrids.sort((a, b) => sortByDistance(a, b, prioritizeNear))
  }

  for (let i = 0; i < nearbyGrids.length; i++) {
    let { x, y } = nearbyGrids[i]
    let matchingItems = this.getGameItemsFromGridByTags({ position: nearbyGrids[i], tags})
    if(matchingItems.length) return matchingItems
  }

  console.log(`found no items of tag ${tags} nearby x:${x}y:${y}`)
  return []
}

function getGameItemsFromGridByTag({ position, tag}) {
  const {x, y} = position
  return this.grid[x][y].filter(({tags}) => {
    if(!tags) return false
    return tags.indexOf(tag) >= 0
  })
}

function getGameItemsFromGridByTags({position, tags}) {
  const { x, y } = position
  if(!this.grid[x]) return []
  if(!this.grid[x][y]) return []
  return this.grid[x][y].filter((item) => {
    if(!item.tags) return false
    return tags.some(tag => item.tags.indexOf(tag) >= 0)
  })
}

function findOpenPath({ fromPosition, toPosition, prioritizeNear = { x: fromPosition.x, y: fromPosition.x }, onFail = () => {gameItem._behavior = 'default'} }) {
  const fromX = fromPosition.x
  const fromY = fromPosition.y
  const toX = toPosition.x
  const toY = toPosition.y
  const openGrid = this.findOpenGridNear({ position: toPosition, prioritizeNear: {x: prioritizeNear.x, y: prioritizeNear.y}, onFail})
  return finder.findPath(fromX, fromY, openGrid.x, openGrid.y, this.pathfindingGrid);
}

// searches nearby grids for open space
// returns null on fail
function findOpenGridNear({ position, onlySurrounding = false, prioritizeNear, onFail = () => {} }){
  const { x, y } = position

  this.pathfindingGrid = _convertGridToPathfindingGrid(this.grid)
  // console.log('looking for open grid near', x, y)

  if(!onlySurrounding && this.isGridWalkable(x, y)) return { x, y }

  const nearbyGrids = [
    { x, y: y-1},
    { x: x+1, y},
    { x: x, y: y+1},
    { x: x-1, y},
  ]

  if(prioritizeNear) {
    nearbyGrids.sort((a, b) => sortByDistance(a, b, prioritizeNear))
  }

  for (let i = 0; i < nearbyGrids.length; i++) {
    let { x, y } = nearbyGrids[i]
    if(this.isGridWalkable(x, y)) return nearbyGrids[i]
  }

  console.log('failed to find nearby grid for object');
  onFail()
  return null
}

// will search entire map before it gives up.
// using during runTime could fail
function forceFindOpenGridNear({position, level = 0}){
  const {x, y} = position

  if(level == 0) {
    this.pathfindingGrid = _convertGridToPathfindingGrid(this.grid)
  }

  console.log('looking for open grid near', x, y)

  if(this.isGridWalkable(x, y)) return { x, y }

  const nearbyGrids = [
    { x, y: y-1},
    { x: x+1, y: y-1},
    { x: x+1, y},
    { x: x+1, y: y+1},
    { x: x, y: y+1},
    { x: x-1, y: y+1},
    { x: x-1, y},
    { x: x-1, y: y-1},
  ]

  for (let i = 0; i < nearbyGrids.length; i++) {
    let { x, y } = nearbyGrids[i]
    if(this.isGridWalkable(x, y)) return nearbyGrids[i]
  }

  console.log('failed to find nearby grid for object going recursive..')
  const nextGrid = nearbyGrids[Math.random() * nearbyGrids.length]
  this.forceFindOpenGridNear(nextGrid.x, nextGrid.y, level++)
}

function isGridWalkable( x, y) {
  if(!this.pathfindingGrid.nodes[y]) return false
  if(!this.pathfindingGrid.nodes[y][x]) return false
  if(!this.pathfindingGrid.nodes[y][x].walkable) return false
  return true
}

function walkAround({ object, intelligence }) {
  const { x, y } = object

  let direction = ''
  if(intelligence == 'basic') {
    if(object._direction) {
      direction = object._direction
    }
  }

  if(Math.random() > .5){
    // go right
    if(Math.random() > .5 && direction !=='left'){
      if ( this.isGridWalkable(x + 1, y) ){
        if (intelligence == 'basic') object._direction = 'right'
        return { x: x + 1, y: y}
      }
    }

    // go left
    if(direction !== 'right') {
      if ( this.isGridWalkable(x - 1, y) ) {
        if (intelligence == 'basic') object._direction = 'left'
        return { x: x - 1, y: y}
      }
    }
  }

  // go down
  if(Math.random() > .5 && direction !== 'up'){
    if ( this.isGridWalkable(x, y + 1) ){
      if (intelligence == 'basic') object._direction = 'down'
      return { x: x, y: y + 1}
    }
  }

  // go up
  if(direction !== 'down') {
    if ( this.isGridWalkable(x, y - 1) ){
      if (intelligence == 'basic') object._direction = 'up'
      return { x: x, y: y - 1}
    }
  }

  // random failed, find somewhere to move
  object._direction = ''
  // console.log('couldnt do rando movement, finding space')
  const nearbyGrids = [
    { x, y: y-1},
    { x: x+1, y},
    { x: x, y: y+1},
    { x: x-1, y},
  ]

  if(Math.random() > .5){
    nearbyGrids.reverse()
  }

  for (let i = 0; i < nearbyGrids.length; i++) {
    let { x, y } = nearbyGrids[i]
    if (this.isGridWalkable(nearbyGrids[i].x, nearbyGrids[i].y)) {
      return nearbyGrids[i]
    }
  }

  console.log('found nowhere to move')
  return { x, y }
}

function addUpdate({name, core, hijack = false, duration = 10, onEnd}, subject) {
  if(!subject.updates) subject.updates = []

  // for normal ass controlled updates...
  if(core) {
    const update = {
      core: core.bind(subject, this),
    }
    subject.updates.push(update)
  }

  // for crazy ass mods you get from other people
  if(name) {
    const mod = this.itemMods[name]
    if(!mod) return console.log(`missing mod ${name} on ${subject.name}`)
    const update = {
      name,
      mod: mod.bind(subject, this),
      hijack,
      duration,
    }

    if(onEnd) update.onEnd = onEnd.bind(subject, this)

    if(hijack) {
      subject.updates.unshift(update)
    }

    for(let i = 0; i < subject.updates.length; i++){
      if(subject.updates[i].name === name){
        if(!subject.updates[i].mod){
          subject.updates[i] = update
        } else {
          console.log(`subject ${subject.name} already has update ${name}`)
        }
        // already exists on subject so were good, dont push or anything
        return
      }
    }

    subject.updates.push(update)
  }
}

function removeUpdate(name, subject) {
  for(let i = 0; i < subject.updates.length; i++){
    if(subject.updates[i].name === name){
      subject.updates.splice(i, 1)
    }
    return
  }
}

function registerMod(name, fx) {
  if(this.itemMods[name]) return console.log(`mod ${name} already registered`)
  this.itemMods[name] = fx
}

/*

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
          EXPORT
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

*/

module.exports = function(game = {}){

  // non standard init for game
  function init(gameState){
    game.id = gameState.id
    game.itemList = gameState.itemList
    game.logs = gameState.logs
    game.itemMods = {}

    const { items, tags } = _generateItemLookupAndTags(game)
    game.items = items
    game.tags = tags

    // game.width = _findFurthestCoordinate(game, 'x') + 10
    // game.height = _findFurthestCoordinate(game, 'y') + 10
    game.width = 100
    game.height = 100

    // something might want this...
    game.forEveryGridNode = forEveryGridNode
    game.generateDuration = generateDuration

    // pathfinding
    game.grid = _createGrid(game)
    game.pathfindingGrid = _convertGridToPathfindingGrid(game.grid)
    game.findOpenGridNear = findOpenGridNear
    game.forceFindOpenGridNear = forceFindOpenGridNear
    game.walkAround = walkAround
    game.findOpenPath = findOpenPath
    game.isGridWalkable = isGridWalkable

    // item finding
    game.findItemNearby = findItemNearby
    game.getGameItemsFromGridByTags = getGameItemsFromGridByTags
    game.getGameItemsFromGridByTag = getGameItemsFromGridByTag

    // client update
    game.generateGameItemUpdate = generateGameItemUpdate

    // time
    game.generateGameTimeDuration = generateGameTimeDuration
    game.generateDuration = generateDuration


    // mods/server updates
    game.addUpdate = addUpdate
    game.registerMod = registerMod
    game.removeUpdate = removeUpdate

    return game
  }

  function setup(){
    _initMods(game)
  }

  function update(delta){
    game.grid = _createGrid(game)
    game.pathfindingGrid = _convertGridToPathfindingGrid(game.grid)
    const { items, tags } = _generateItemLookupAndTags(game)
    game.items = items
    game.tags = tags

    for(let i = 0; i < game.itemList.length; i++) {
      let gameItem = game.itemList[i]
      _updateGameItem(game, gameItem, i, delta)
    }
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

function _updateGameItem(game, gameItem, i, delta) {
  _updateGameItemLife(game, gameItem, i)
  if(gameItem.updates){
    for(let j = 0; j < gameItem.updates.length; j++) {
      let update = gameItem.updates[j]
      if(update.mod) {
        update.duration--
        if(update.duration <= 0) {
          if(update.onEnd) update.onEnd()
          gameItem.updates.splice(j, 1)
          j--
        }
        update.mod(delta)
        // if this update hijacks the subject, no more updates!
        if(update.hijack) break
      } else if(update.core) {
        update.core(delta)
      }
    }
  }
}

function _isGameItemDead(gameItem) {
  return gameItem._life <= 0
}

function _updateGameItemLife(game, gameItem, index) {
  if(gameItem._life === undefined) return

  gameItem._life = gameItem._life - 1
  if(_isGameItemDead(gameItem)) {
    if(gameItem.destroy) gameItem.destroy()
    console.log(`${gameItem.name} has died with _life of ${gameItem._life}`)
    gameItem.dead = true
    gameItem.invisible = true
    game.deadItemList.push(game.itemList.splice(index, 1))
  }

  // let witherPoint = -10
  // if(gameItem._witherPoint) {
  //   witherPoint = gameItem._witherPoint
  // }
  // if(gameItem._life <= witherPoint) {
  //   console.log(`${gameItem.name} has withered away completed`)
  //   gameItem.invisible = true
  // }
}

function _initMods(game) {
  //re initialize mods, but NOT CORES!
  for(let i = 0; i < game.itemList.length; i++) {
    let gameItem = game.itemList[i]
    if(gameItem.updates){
      for(let j = 0; j < gameItem.updates.length; j++) {
        let update = gameItem.updates[j]
        // dont add cores here!
        // this is just for re initializing mods
        // mods and core updates are normally added in service files
        if(update.core) continue;
        addUpdate(game, update, gameItem)
        j++
      }
    }
  }
}

function _findFurthestCoordinate(game, coordinate){
  let furthest = 0;
  game.itemList.forEach(gameItem => {
    if(gameItem[coordinate] > furthest) furthest = gameItem[coordinate]
  })
  return furthest;
}

function _createGrid(game){
  const grid = [];
  for (let x = 0; x < game.width; x++) {
    grid.push([])
    for (let y = 0; y < game.height; y++) {
      grid[x].push([])
    }
  }

  game.itemList.forEach(gameItem => {
    if(gameItem.x === undefined || gameItem.y === undefined){
      // console.log('missing XY from GameItem: ' + gameItem.name)
      return
    }
    let gridNode = grid[gameItem.x][gameItem.y]
    if(gridNode){
      gridNode.push(gameItem)
    } else {
      gridNode = []
    }
  })

  return grid
}

function _convertGridToPathfindingGrid(grid) {
  const pfgrid = new PF.Grid(grid.length, grid[0].length);

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      for (let gameItemIndex = 0; gameItemIndex < grid[x][y].length; gameItemIndex++) {
        if (grid[x][y][gameItemIndex].obstacle && !_isGameItemDead(grid[x][y][gameItemIndex])) {
          pfgrid.setWalkableAt(x, y, false);
          break;
        }
      }
    }
  }

  return pfgrid;
}

function _generateItemLookupAndTags(game){
  return game.itemList.reduce((obj, item) => {
    if(obj.items[item.name]){
      console.log(`WARNING DUPLICATE NAME ${item.name}`)
      console.log('marking previous one as invisible')
      obj.items[item.name].invisible = true
      obj.items[item.name].obstacle = false
    }
    obj.items[item.name] = item

    if(!item.tags) return obj
    item.tags.forEach((tag) => {
      if(obj.tags[tag]){
        obj.tags[tag].push(item)
      } else {
        obj.tags[tag] = [item]
      }
    })
    return obj
  }, { items: {}, tags: {} })
}

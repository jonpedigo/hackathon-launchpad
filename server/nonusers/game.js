// DESCRIPTION: define parameters of the game world, add core functions to game object

// TODO: My first character! the woodcutter

// TODO: standards for flags, tags, and other variables, x, y, z, name, etc. Write down what they all mean

// TODO: The FEELING OF TIME NEEDS TO BE ENHANCED. every stroke of the clock, things should have an age

// TODO: When somthing dies, is it removed from the itemList? At what point...
// I could just make another item list called withered away items

// TODO: intelligence, strength, charisma

const PF = require('pathfinding');

/*


XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        PUBLIC FUNCTIONS
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

*/

function forEveryGridNode(game, fx) {
  game.grid.forEach((row, x) => {
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

function findItemNearby(game, x, y, tags) {
  if(!Array.isArray(tags)) tags = [tags]

  let matchingItems = getGameItemsFromGridByTags(game, x, y, tags)
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

  for (let i = 0; i < nearbyGrids.length; i++) {
    let { x, y } = nearbyGrids[i]
    let matchingItems = getGameItemsFromGridByTags(game, x, y, tags)
    if(matchingItems.length) return matchingItems
  }

  console.log(`found no items of tag ${tags} nearby x:${x}y:${y}`)
  return []
}

function getGameItemsFromGridByTag(game, x, y, tag) {
  return game.grid[x][y].filter(({tags}) => {
    if(!tags) return false
    return tags.indexOf(tag) >= 0
  })
}

function getGameItemsFromGridByTags(game, x, y, tags) {
  if(!game.grid[x]) return []
  if(!game.grid[x][y]) return []
  return game.grid[x][y].filter((item) => {
    if(!item.tags) return false
    return tags.some(tag => item.tags.indexOf(tag) >= 0)
  })
}

function findOpenGridNear(game, x, y, level = 0){
  if(level == 0) {
    game.pathfindingGrid = _convertGridToPathfindingGrid(game.grid)
  }

  if(isGridWalkable(game, x, y)) return { x, y }

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
    if(isGridWalkable(game, x, y)) return nearbyGrids[i]
  }

  console.log('failed to find nearby grid for object going recursive..')
  const nextGrid = nearbyGrids[Math.random() * nearbyGrids.length]
  findOpenGridNear(game, nextGrid.x, nextGrid.y, level++)
}

function isGridWalkable(game, x, y) {
  if(!game.pathfindingGrid.nodes[y]) return false
  if(!game.pathfindingGrid.nodes[y][x]) return false
  if(!game.pathfindingGrid.nodes[y][x].walkable) return false
  return true
}

function walkAround(game, obj, { intelligence } ) {
  const { x, y } = obj

  let direction = ''
  if(intelligence == 'basic') {
    if(obj._direction) {
      direction = obj._direction
    }
  }

  if(Math.random() > .5){
    // go right
    if(Math.random() > .5 && direction !=='left'){
      if ( isGridWalkable(game, x + 1, y) ){
        if (intelligence == 'basic') obj._direction = 'right'
        return { x: x + 1, y: y}
      }
    }

    // go left
    if(direction !== 'right') {
      if ( isGridWalkable(game, x - 1, y) ) {
        if (intelligence == 'basic') obj._direction = 'left'
        return { x: x - 1, y: y}
      }
    }
  }

  // go down
  if(Math.random() > .5 && direction !== 'up'){
    if ( isGridWalkable(game, x, y + 1) ){
      if (intelligence == 'basic') obj._direction = 'down'
      return { x: x, y: y + 1}
    }
  }

  // go up
  if(direction !== 'down') {
    if ( isGridWalkable(game, x, y - 1) ){
      if (intelligence == 'basic') obj._direction = 'up'
      return { x: x, y: y - 1}
    }
  }

  // random failed, find somewhere to move
  obj._direction = ''
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
    if (isGridWalkable(game, nearbyGrids[i].x, nearbyGrids[i].y)) {
      return nearbyGrids[i]
    }
  }

  console.log('found nowhere to move')
  return { x, y }
}

function addUpdate(game, {name, core, hijack = false, duration = 10, onEnd}, subject) {
  if(!subject.updates) subject.updates = []

  // for normal ass controlled updates...
  if(core) {
    const update = {
      core: core.bind(subject, game),
    }
    subject.updates.push(update)
  }

  // for crazy ass mods you get from other people
  if(name) {
    const mod = game.itemMods[name]
    if(!mod) return console.log(`missing mod ${name} on ${subject.name}`)
    const update = {
      name,
      mod: mod.bind(subject, game),
      hijack,
      duration,
    }

    if(onEnd) update.onEnd = onEnd.bind(subject, game)

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

function removeUpdate(game, name, subject) {
  for(let i = 0; i < subject.updates.length; i++){
    if(subject.updates[i].name === name){
      subject.updates.splice(i, 1)
    }
    return
  }
}

function registerMod(game, name, fx) {
  if(game.itemMods[name]) return console.log(`mod ${name} already registered`)
  game.itemMods[name] = fx
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

    // pathfinding
    game.grid = _createGrid(game)
    game.pathfindingGrid = _convertGridToPathfindingGrid(game.grid)
    game.findOpenGridNear = findOpenGridNear
    game.walkAround = walkAround

    // item finding
    game.findItemNearby = findItemNearby

    // client update
    game.generateGameItemUpdate = generateGameItemUpdate

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

function _updateGameItemLife(game, gameItem, index) {

  gameItem._life = gameItem._life - 1
  if(gameItem._life <= 0) {
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
        if (grid[x][y][gameItemIndex].hard) {
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
    obj.items[item.name] = item
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

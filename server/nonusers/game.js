// DESCRIPTION: define parameters of the game world, add core functions to game object

// TODO: My first character! the woodcutter... pathfinding

// TODO: standards for flags, tags, and other variables, x, y, z, name, etc. Write down what they all mean

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

    // no need to reupdate when fx are initialized in setup
    if(typeof oldItem[propName] === 'function') continue

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
  if (updatedItemList.length > oldItemList){
    created = updatedItemList.slice(oldItemList.length)
  }

  return {
    updated,
    created,
  }
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
//  console.log('couldnt do rando')
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

    const { items, tags } = _generateItemLookupAndTags(game)
    game.items = items
    game.tags = tags

    // game.width = _findFurthestCoordinate(game, 'x') + 10
    // game.height = _findFurthestCoordinate(game, 'y') + 10
    game.width = 100
    game.height = 100
    game.grid = _createGrid(game)
    game.pathfindingGrid = _convertGridToPathfindingGrid(game.grid)
    game.findOpenGridNear = findOpenGridNear
    game.forEveryGridNode = forEveryGridNode
    game.generateGameItemUpdate = generateGameItemUpdate
    game.walkAround = walkAround
    return game
  }

  function setup(){

  }

  function update(delta){
    game.grid = _createGrid(game)
    game.pathfindingGrid = _convertGridToPathfindingGrid(game.grid)
    const { items, tags } = _generateItemLookupAndTags(game)
    game.items = items
    game.tags = tags
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

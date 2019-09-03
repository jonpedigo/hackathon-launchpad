// DESCRIPTION: define parameters of the game world, add core functions to game object

// TODO: My first character! the woodcutter... pathfinding

// TODO: standards for flags, tags, and other variables, x, y, z, name, etc. Write down what they all mean

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
    game.forEveryGridNode = forEveryGridNode
    game.generateGameItemUpdate = generateGameItemUpdate

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
  const pathfindingGrid = [];

  for (let x = 0; x < grid.length; x++) {
    pathfindingGrid.push([])
    for (let y = 0; y < grid[x].length; y++) {
      pathfindingGrid[x].push(0)
      for (let gameItemIndex = 0; gameItemIndex < grid[x][y].length; gameItemIndex++) {
        if (grid[x][y][gameItemIndex].hard) {
          pathfindingGrid[x][y] = 1
          break;
        }
      }
    }
  }

  return pathfindingGrid;
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

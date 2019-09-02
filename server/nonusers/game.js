// DESCRIPTION: define parameters of the game world, add core functions to game object

// TODO: The concept of time and death
// TODO: Tag system
// TODO: My first character! the woodcutter

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

/*

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
          EXPORT
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

*/

module.exports = function(game){

  // non standard init for game
  function init(gameState){
    const game = {
      id: gameState.id,
      itemList: gameState.itemList,
      items: gameState.itemList.reduce((obj, item) => {
        obj[item.name] = item
        return obj
      }, {}),
      updates: [],
    }

    // game.width = _findFurthestCoordinate(game, 'x') + 10
    // game.height = _findFurthestCoordinate(game, 'y') + 10
    game.width = 100
    game.height = 100
    game.grid = _createGrid(game)
    game.pathfindingGrid = _convertGridToPathfindingGrid(game.grid)
    game.forEveryGridNode = forEveryGridNode

    return game
  }

  function setup(){

  }

  function update(delta){
    game.grid = _createGrid(game)
    game.pathfindingGrid = _convertGridToPathfindingGrid(game.grid)
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

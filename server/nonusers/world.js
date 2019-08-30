// define parameters of the world

function findFurthestCoordinate(game, coordinate){
  let furthest = 0;
  game.state.forEach(gameItem => {
    if(gameItem[coordinate] > furthest) furthest = gameItem[coordinate];
  })
  return furthest;
}

function createGrid(game){
  const grid = [];

  for (let x = 0; x < game.width; x++) {
    grid.push([])
    for (let y = 0; y < game.height; y++) {
      grid[x].push([])
    }
  }

  game.state.forEach(gameItem => {
    let gridNode = grid[gameItem.x][gameItem.y]
    if(gridNode){
      gridNode.push(gameItem)
    } else {
      gridNode = []
    }
  })

  return grid
}

function convertGridToPathfindingGrid(grid) {
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

module.exports = function(game, socket, mongoose){
  function init(){

  }

  function setup(){
    game.width = findFurthestCoordinate(game, 'x') + 10;
    game.height = findFurthestCoordinate(game, 'y') + 10;
    game.grid = createGrid(game);
    game.pathfindingGrid = convertGridToPathfindingGrid(game.grid);

    console.log(game.pathfindingGrid)
  }

  function update(){

  }

  return {
    init,
    setup,
    update,
  }
}

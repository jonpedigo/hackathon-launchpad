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
    let { x, y } = game.forceFindOpenGridNear({ position: { x: 70, y: 70}})
    game.clearArea({position: { x, y}, distance: 20, fillIn: (x, y) => {
      itemList.push({
        name: `snow_x${x}y${y}`,
        x: x,
        y: y,
        z: -1,
        character: 'G',
        sprite: 'snow-1',
        tags: ['snow'],
      })
      if(Math.random() > .4){
        itemList.push({
          name: `mountain_snow_x${x}y${y}`,
          x: x,
          y: y,
          z: 0,
          character: 'T',
          sprite: 'mountain-grey-snow',
          obstacle: true,
          tags: ['mountain', 'snow'],
        })
      }
    }})

    game.itemList.push({
      name: 'dark_rainy_castle',
      x,
      y,
      z: 1,
      character: 'E',
      sprite: 'castle-b-snow-1',
      tags: ['castle'],
      flags: {

      },
      obstacle: true,
    })
    game.itemList.push({
      name: 'dark_rainy_castle_top',
      x,
      y: y-1,
      z: 1,
      character: 'E',
      sprite: 'castle-t-snow-1',
      tags: ['castle'],
      flags: {

      },
      obstacle: true,
    })

    let startX = (x - 10) + Math.floor(Math.random() * 20)
    let startY = y + 10
    let path = game.findPath({fromPosition: {x: startX, y: startY }, toPosition: {x, y: y + 1}});
    game.clearGrids({grids: path, fillIn: (x, y) => {
      itemList.push({
        name: `gravel_x${x}y${y}`,
        x: x,
        y: y,
        z: -1,
        character: 'G',
        sprite: 'gravel-1',
        tags: ['gravel', 'path'],
      })
    }})
  }

  // setup game logic
    // runs every time server is started
  function setup(){

  }

  // trigger, collisions
    // runs every update about 100 milliseconds
  function update(delta){

  }

  // on player input
  function input(user, data){
    if(user.username !== 'jonpedigo') return

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

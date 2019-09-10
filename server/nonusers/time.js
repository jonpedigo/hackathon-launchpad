// DESCRIPTION: time

const moment = require('moment');

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
    itemList.push({
      name: `time`,
      age: 0,
      start: Date.now()
    })
  }

  // setup game logic
    // runs every time server is started
  function setup(){

  }

  // trigger, collisions
    // runs every update about 100 milliseconds
  function update(delta){
    const time = game.items.time
    time.age += delta
    console.log(time.age)
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

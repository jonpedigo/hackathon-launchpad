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
      ticks: 0,
    })
  }

  // setup game logic
    // runs every time server is started
  function setup(){
    const time = game.items.time
    time.start = Date.now()
    time.ticks = 0
    time.gameTimeHour = game.generateGameTimeDuration(1, 'hour') * 24
  }

  // trigger, collisions
    // runs every update about 100 milliseconds
  function update(delta){
    const time = game.items.time
    time.ticks += 1
    // console.log(time.ticks, Date.now() - time.start)
    // time.age = game.gameTimeTicksTo()

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

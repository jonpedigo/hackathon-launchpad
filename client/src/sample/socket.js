// listens to server game updates and calls initialize or update events

let previousGameItemListLength = 0

function listen({onListen, onInitGameItem, onUpdateGameItem, onUpdateComplete}){
  // init game state
  window.socket.emit('listen for game updates')

  window.socket.on('init game', (gameItemList) => {
    gameItemList.forEach((gameItem) => onInitGameItem({gameItem}))
    onListen(gameItemList)
  })

  window.socket.on('update game ', gameItemList => {
    console.log('...updating at all')

    if(gameItemList.length > previousGameItemListLength) {
      for(let i = 0; i < gameItemList.length; i++) {
        let gameItem = gameItemList[i]
        if (i >= previousGameItemListLength) {
          onInitGameItem({gameItem});
        } else {
          onUpdateGameItem({gameItem});
        }
      }
    }

    if(onUpdateComplete) onUpdateComplete(gameItemList)

    previousGameItemListLength = gameItemList;
  })
}


export default {
  listen
}

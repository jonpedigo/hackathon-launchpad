// listens to server game updates and calls initialize or update events

let previousGameItemListLength = 0

function listen({onListen, onInitGameItem, onUpdateGameItem, onUpdateComplete}){
  window.socket.on('update game', gameItemList => {
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

    window.socket.emit('input', 99)

    if(onUpdateComplete) onUpdateComplete(gameItemList)

    previousGameItemListLength = gameItemList;
  })
}


export default {
  listen
}

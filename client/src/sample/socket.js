// listens to server game updates and calls initialize or update events

function listen({onListen, onInitGameItem, onUpdateGameItem, onUpdateComplete}){

  window.socket.emit('ask for init game state')

  window.socket.on('init game', gameItemList => {
    for(let i = 0; i < gameItemList.length; i++) {
      let gameItem = gameItemList[i]
      onInitGameItem({gameItem})
    }

    window.socket.on('update game', gameUpdate => {
      for(let i = 0; i < gameUpdate.created.length; i++) {
        let gameItem = gameUpdate.created[i]
        onInitGameItem({gameItem})
      }
      for(let i = 0; i < gameUpdate.updated.length; i++) {
        let gameItem = gameUpdate.updated[i]
        onUpdateGameItem({gameItem})
      }
    })
  })
}


export default {
  listen
}

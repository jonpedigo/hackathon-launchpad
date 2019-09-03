// listens to when a new log has been logged and load initial logs

function listen({onLogHistory, onNewLogs}){

  window.socket.emit('ask for log history')

  window.socket.on('log history', onLogHistory)

  window.socket.on('new logs', onNewLogs)
}

function sendLog({log}){
  window.socket.emit('send log', log)
}

export default {
  listen
}

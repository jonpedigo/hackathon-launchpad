// listens to when a new log has been logged and load initial logs

function listen({onLogHistory, onGetLogs}){

  window.socket.emit('ask for log history')

  window.socket.on('new logs', onGetLogs)
}

function addLog({log}){
  window.socket.emit('add log', log)
}

export default {
  listen,
  addLog,
}

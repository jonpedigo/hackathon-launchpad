import React, { useState, useEffect } from "react"
import socket from './socket'

export default function Sample({user}) {
  const [logs, setLogs] = useState([])
  const [chat, setChat] = useState('')

  useEffect(() => {
    socket.listen({
      onLogHistory: (logs) => {
        setLogs(logs)
      },
      onNewLogs: (newLogs) => {
        setLogs([...logs, ...newLogs])
      }
    })
  }, [])

  return (
    <div style={{
      position:'fixed',
      right: '0px',
      top:'0px',
      height: '100%',
      width: '300px',
      background: 'white',
    }}>
      <div style={{
        overflowY: 'scroll',
        height: '100%',
        padding: '0px 15px',
      }}>
        <div style={{
          width: '100%',
          height: '5px',
        }}/>
        {logs.reverse().map((log) =>
          <div style={{paddingTop:'8px'}}>
            {log}
          </div>
        )}
      </div>
      <div style={{
        position:'absolute',
        bottom: '0px',
        width: '100%',
        height: '100px',
        background: 'white',
      }}>
        <input
          value={chat} onChange={(e) => setChat(e.target.value)}
          style={{
            width: '100%'
          }}
        />
      </div>

    </div>
  )
}

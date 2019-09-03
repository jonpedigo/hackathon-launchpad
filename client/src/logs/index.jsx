import React, { useState, useRef, useEffect } from "react"
import socket from './socket'
import { keyboard } from './input'

function _renderLogs(logs) {
  logs = [...logs]
  return logs.reverse().map((log, i) => {
    if(i % 2) {
      return <div style={{lineHeight: '22px', background: '#2f2f2f', padding: '8px 15px'}} dangerouslySetInnerHTML={{ __html: log}}>
      </div>
    } else {
      return <div style={{lineHeight: '22px', background: '#333', padding: '8px 15px'}} dangerouslySetInnerHTML={{ __html: log}}>
      </div>
    }
  })
}

export default function Logs({user}) {
  const [logs, setLogs] = useState([])
  const [chat, setChat] = useState('')

  const inputRef = useRef(null)

  useEffect(() => {
    socket.listen({
      onGetLogs: (logs) => {
        console.log(logs)
        setLogs(logs)
      }
    })
    keyboard({
      inputRef,
      onSubmit: () => {
        if(inputRef.current.value == '') return
        socket.addLog({log: `<div style='color: white; font-weight:700; margin-bottom:5px'>${user.username}</div>${inputRef.current.value}`})
        setChat('')
      },
    })
  }, [])

  return (
    <div style={{
      fontFamily: 'Helvetica',
      position:'fixed',
      right: '0px',
      top:'0px',
      height: '100%',
      width: '300px',
      background: '#333',
      border: '1px solid #999',
      letterSpacing: '1px',
      color: '#ccc',
    }}>
      <div style={{
        position:'fixed',
        bottom: '0px',
        left: '0px',
        width: '100%',
        height: '47px',
      }}>
        <input
          ref={inputRef}
          value={chat} onChange={(e) => setChat(e.target.value)}
          placeholder='Start typing to chat'
          style={{
            border:'1px solid #999',
            padding:'10px',
            fontFamily: 'Helvetica',
            fontSize: '22px',
            width: '100%',
            background: '#333',
            color:'white',
          }}
        />
      </div>
      <div style={{
        overflowY: 'scroll',
        height: '100%',
      }}>
        <div style={{
          width: '100%',
          height: '5px',
        }}/>
        {_renderLogs(logs)}
      </div>
    </div>
  )
}

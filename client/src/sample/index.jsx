import React, { useState, useRef, useEffect } from "react"
import { flameEmitter } from './particles'
import { keyboard } from './input'
import map from './map'
import socket from './socket'

export default function Sample() {
  const canvasRef = useRef(null)

  useEffect(() => {
    map.initPixiApp({canvasRef, onLoad})
  }, [])

  function onLoad({app, textures, pixiItems}){
    const stage = app.stage;
    app.stop()
    socket.listen({
      onInitGameItem: ({gameItem}) => {
        map.initGameItem({gameItem, stage, textures})
      },
      onUpdateGameItem: ({gameItem}) => {
        map.updateGameItem({gameItem, stage, textures})
      },
      onListen: () => {
        app.start()
        keyboard({stage})
      }
    })
  }

  return <canvas ref={canvasRef}></canvas>
}

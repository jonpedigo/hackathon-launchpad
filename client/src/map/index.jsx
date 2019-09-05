import React, { useState, useRef, useEffect } from "react"
import { keyboard } from './input'
import map from './map'
import socket from './socket'

function onLoad({app, textures, pixiItems}){
  const stage = app.stage;
  keyboard({stage})
  socket.listen({
    onInitGameItem: ({gameItem}) => {
      map.initGameItem({gameItem, stage, textures})
    },
    onUpdateGameItem: ({gameItem}) => {
      map.updateGameItem({gameItem, stage, textures})
    }
  })
}

export default function Map() {
  const canvasRef = useRef(null)

  useEffect(() => {
    map.initPixiApp({canvasRef, onLoad})
  }, [])

  return <canvas ref={canvasRef}></canvas>
}

import React, { useState, useRef, useEffect } from "react"
import * as PIXI from 'pixi.js'

import { flameEmitter } from './particles'

let previousGameStateLength = 0
const gameStateLookup = {}

export default function Home() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const initializeGameItem = gameItem => {
      let text = new PIXI.Text(gameItem.character, {fontFamily : 'Courier New', fontSize: 40, fill : '#ff1010', align : 'center'})
      text.transform.position.x = gameItem.x
      text.transform.position.y = gameItem.y
      gameStateLookup[gameItem.name] = stage.addChild(text)
    }

    const updateGameItem = (pixiItem, gameItem) => {
      pixiItem.style.fill = gameItem.color
      pixiItem.location.x = gameItem.x
      pixiItem.location.y = gameItem.y

      //TODO: remove pixi item if it has like a DONTRENDER property
      //TODO: remove and add pixi item if character has changed
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const worldWidth = 2000
    const worldHeight = 2000
    const worldMinX = worldWidth / 2
    const worldMinY = worldHeight / 2

    // initialize pixi renderer and camera
    const app = new PIXI.Application({ view: canvasRef.current, width: width, height: height })
    const stage = app.stage;

    // initialize game state
    window.socket.emit('listen for game updates')

    window.socket.on('initialize game', (gameState) => {
      gameState.forEach(initializeGameItem)
    })

    window.socket.on('update game ', gameState => {
      if(gameState.length > previousGameStateLength) {
        for(let i = 0; i < gameState.length; i++) {
          let gameItem = gameState[i]
          if (i >= previousGameStateLength) {
            initializeGameItem(gameItem);
          } else {
            updateGameItem(gameStateLookup[gameItem.name], gameItem);
          }
        }
      }
      previousGameStateLength = gameState;
    })

    // particle emitters
    const flame = flameEmitter({
      startPos: {x:300, y:500},
      stage
    })

    const flame2 = flameEmitter({
      startPos: {x:500, y:500},
      stage
    })

    const emitters = [flame, flame2]
    app.ticker.add((delta) => {
      emitters.forEach(e => e.update((delta) * .02))
    })
  }, [])

  return <div>
    <canvas ref={canvasRef}></canvas>
  </div>
}

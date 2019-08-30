import React, { useState, useRef, useEffect } from "react"
import * as PIXI from 'pixi.js'

import { flameEmitter } from './particles'

let previousGameStateLength = 0
const gameStateLookup = {}

export default function Index() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const initGameItem = gameItem => {
      let text = new PIXI.Text(gameItem.character, {fontFamily : 'Courier New', fontSize: 40, fill : '#ff1010', align : 'center'})
      text.transform.position.x = gameItem.x * 40
      text.transform.position.y = gameItem.y * 40
      gameStateLookup[gameItem.name] = stage.addChild(text)
    }

    const updateGameItem = (pixiItem, gameItem) => {
      pixiItem.style.fill = gameItem.color
      pixiItem.location.x = gameItem.x * 40
      pixiItem.location.y = gameItem.y * 40

      //TODO: remove pixi item if it has like a DONTRENDER property
      //TODO: remove and add pixi item if character has changed
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // init pixi renderer and camera
    const app = new PIXI.Application({ view: canvasRef.current, width: width, height: height })
    const stage = app.stage;

    // init game state
    window.socket.emit('listen for game updates')

    window.socket.on('init game', (gameState) => {
      gameState.forEach(initGameItem)
    })

    window.socket.on('update game ', gameState => {
      if(gameState.length > previousGameStateLength) {
        for(let i = 0; i < gameState.length; i++) {
          let gameItem = gameState[i]
          if (i >= previousGameStateLength) {
            initGameItem(gameItem);
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

  return <canvas ref={canvasRef}></canvas>
}

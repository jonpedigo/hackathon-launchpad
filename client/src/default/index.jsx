import React, { useState, useRef, useEffect } from "react"
import * as PIXI from 'pixi.js'
import tileset from './tileset.json'
import { flameEmitter } from './particles'

let previousGameItemListLength = 0
const gameItems = {}

const initGameItem = ({gameItem, textures, stage}) => {
  if (gameItem.sprite) {
    let sprite = new PIXI.Sprite(textures[gameItem.sprite])
    sprite.transform.position.x = gameItem.x * 40
    sprite.transform.position.y = gameItem.y * 40
    sprite.transform.scale.x = 5
    sprite.transform.scale.y = 5
    gameItems[gameItem.name] = stage.addChild(sprite)
  } else if (gameItem.character) {
    let text = new PIXI.Text(gameItem.character, {fontFamily : 'Courier New', fontSize: 40, fill : '#ff1010', align : 'center'})
    text.transform.position.x = gameItem.x * 40
    text.transform.position.y = gameItem.y * 40
    gameItems[gameItem.name] = stage.addChild(text)
  }
}

const updateGameItem = (pixiItem, gameItem, texture, stage) => {
  pixiItem.style.fill = gameItem.color
  pixiItem.location.x = gameItem.x * 40
  pixiItem.location.y = gameItem.y * 40

  //TODO: remove pixi item if it has like a DONTRENDER property
  //TODO: remove and add pixi item if character has changed
}

export default function Index() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // init pixi renderer and camera
    const textures = {};
    const app = new PIXI.Application({ view: canvasRef.current, width: width, height: height })
    const stage = app.stage;

    app.stop();
    app.loader.add('static/img/tileset.png').load(() => {
      tileset.forEach((tile) => {
        var baseTexture = new PIXI.BaseTexture('static/img/tileset.png');
        var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(tile.x, tile.y, tile.width, tile.height));
        textures[tile.name] = texture
      })
      start()
    })

    function start() {
      // init game state
      window.socket.emit('listen for game updates')

      window.socket.on('init game', (gameItemList) => {
        gameItemList.forEach((gameItem) => initGameItem({gameItem, textures, stage}))
        app.start();
      })

      window.socket.on('update game ', gameItemList => {
        if(gameItemList.length > previousGameItemListLength) {
          for(let i = 0; i < gameItemList.length; i++) {
            let gameItem = gameItemList[i]
            if (i >= previousGameItemListLength) {
              initGameItem(gameItem);
            } else {
              updateGameItem(gameItems[gameItemList.name], gameItem);
            }
          }
        }
        previousGameItemListLength = gameItemList;
      })

      // particle emitters
      const flame1 = flameEmitter({
        startPos: {x:500, y:500},
        stage
      })

      const emitters = [flame1]
      app.ticker.add((delta) => {
        emitters.forEach(e => e.update((delta) * .012))
      })
    }
  }, [])

  return <canvas ref={canvasRef}></canvas>
}

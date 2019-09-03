// how pixi loads and draws game items for a basic map setup

import * as PIXI from 'pixi.js'
import tileset from './tileset.json'

const GRID_SIZE = 40
const STAGE_WIDTH = window.innerWidth;
const STAGE_HEIGHT = window.innerHeight;

const initPixiApp = ({canvasRef, onLoad}) => {
  // init pixi app and textures
  const textures = {};
  const app = new PIXI.Application({ view: canvasRef.current, width: STAGE_WIDTH, height: STAGE_HEIGHT })
  app.stage.sortableChildren = true

  app.loader.add('static/img/tileset.png').load(() => {
    tileset.forEach((tile) => {
      var baseTexture = new PIXI.BaseTexture('static/img/tileset.png');
      var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(tile.x, tile.y, tile.width, tile.height));
      textures[tile.name] = texture
    })
    onLoad({app, textures})
  })
}

const initGameItem = ({gameItem, textures, stage}) => {
  if (gameItem.invisible) return

  if (gameItem.sprite) {
    let sprite = new PIXI.Sprite(textures[gameItem.sprite])
    sprite.transform.position.x = (gameItem.x * GRID_SIZE)
    sprite.transform.position.y = (gameItem.y * GRID_SIZE)
    sprite.transform.scale.x = 5
    sprite.transform.scale.y = 5
    sprite.name = gameItem.name
    sprite.oldSprite = gameItem.sprite
    sprite.zIndex = gameItem.z
    stage.addChild(sprite)
  } else if (gameItem.character) {
    let text = new PIXI.Text(gameItem.character, {fontFamily : 'Courier New', fontSize: GRID_SIZE, fill : '#ff1010', align : 'center'})
    text.transform.position.x = (gameItem.x * GRID_SIZE)
    text.transform.position.y = (gameItem.y * GRID_SIZE)
    text.zIndex = gameItem.z
    stage.addChild(text)
  }
}

const updateGameItem = ({gameItem, textures, stage}) => {
  const pixiChild = stage.getChildByName(gameItem.name)
  if(!pixiChild) return

  // remove if its invisible now
  if (gameItem.invisible){
    stage.removeChild(pixiChild)
    return
  }

  if(gameItem.sprite != pixiChild.texture){
    stage.removeChild(pixiChild)
    initGameItem({gameItem, textures, stage})
    return
  }

  // change to new x
  pixiChild.transform.position.x = (gameItem.x * GRID_SIZE)
  pixiChild.transform.position.y = (gameItem.y * GRID_SIZE)

  //TODO: remove and add pixi item if character has changed
}

export default {
  initPixiApp,
  initGameItem,
  updateGameItem,
}

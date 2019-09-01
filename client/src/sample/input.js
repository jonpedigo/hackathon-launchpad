// Handle keyboard controls

function keyboard(stage){
  /*
    left arrow	37
    up arrow	38
    right arrow	39
    down arrow	40

    w 87
    a 65
    s 83
    d 68
  */

  const keysDown = {}

  window.addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true

  	if(keysDown['37']) {
      stage.pivot.x -= 40
    }
    if(keysDown['39']) {
      stage.pivot.x += 40
    }
    if(keysDown['40']) {
      stage.pivot.y += 40
    }
    if(keysDown['38']) {
      stage.pivot.y -= 40
    }
  }, false)

  window.addEventListener("keyup", function (e) {
	   keysDown[e.keyCode] = null
  }, false)

}

function mouse(){

}


export {
  keyboard,
  mouse,
}

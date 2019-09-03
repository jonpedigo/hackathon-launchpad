// Enhance functionality of chat

function keyboard({inputRef, onSubmit}){
  const alphaKeyCodes = {}
  for(let i = 65; i < 91; i++){
    alphaKeyCodes[i] = true
  }

  window.addEventListener("keydown", function (e) {
    if(alphaKeyCodes[e.keyCode]) inputRef.current.focus()
    if(e.keyCode === 13) onSubmit()
  }, false)
}

export {
  keyboard,
}

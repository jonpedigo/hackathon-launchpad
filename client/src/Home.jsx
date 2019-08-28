import React, { useState, useRef, useEffect } from "react";
import * as PIXI from 'pixi.js';
import { flameEmitter } from './particles';

export default function Home() {
  const [state, setState] = useState();
  const canvasRef = useRef(null);

  useEffect(() => {
    const app = new PIXI.Application({view: canvasRef.current});
    const flame = flameEmitter({
      startPos: {x:300, y:500},
      stage: app.stage,
    })

    const flame2 = flameEmitter({
      startPos: {x:500, y:500},
      stage: app.stage,
    })

    const emitters = [flame, flame2];

    var elapsed = Date.now();
    var update = function(){
    	requestAnimationFrame(update);

    	var now = Date.now();
    	emitters.forEach(e => e.update((now - elapsed) * 0.001));
    	elapsed = now;

    	app.render(app.stage);
    };

    update();
  }, [])

  return <div>
    <canvas ref={canvasRef}></canvas>
  </div>
}

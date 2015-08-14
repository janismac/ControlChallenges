var stage = new PIXI.Stage(0x66FF99);
var renderer = new PIXI.CanvasRenderer(800, 600);
document.body.appendChild(renderer.view);
requestAnimFrame( animate );

var graphics = new PIXI.Graphics();
stage.addChild(graphics);

var state = [10, 10];

f = function(t,x) {
  return [x[1], -x[0]];
}



function animate() {
	requestAnimFrame( animate );


	var dt = 0.2;	
	var sol = numeric.dopri(0,dt,state,f,1e-4);
	state = sol.at(dt);
	
	graphics.clear();
	graphics.lineStyle (4,0xFF0000) ;
	graphics.moveTo(state[0],0);
	graphics.lineTo(state[0]+50, 100);
	
	renderer.render(stage);
}
var stage = new PIXI.Stage(0x66FF99);
var renderer = new PIXI.CanvasRenderer(800, 600);
document.body.appendChild(renderer.view);
requestAnimFrame( animate );

var graphics = new PIXI.Graphics();
stage.addChild(graphics);

var pend = new SinglePendulum();

function animate() {
	requestAnimFrame( animate );

	pend.simulate(0.1);	
	graphics.clear();
	graphics.lineStyle (4,0xFF0000) ;
	graphics.moveTo(50+pend.x,50);
	graphics.lineTo(50+pend.x+pend.L*Math.sin(pend.theta),50-pend.L*Math.cos(pend.theta));
	
	renderer.render(stage);
}
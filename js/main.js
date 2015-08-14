
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var canvas = document.getElementById('cas');
var context = canvas.getContext('2d');

function resizeCanvas() {
	canvas.width = $('#cas').width();
	canvas.height = $('#cas').height();
	context.setTransform(1,0,0,1,0,0);
	context.translate(canvas.width/2,canvas.height/2);
	context.scale(150,-150);
}

$( window ).resize(resizeCanvas);
resizeCanvas();

var pendulum = new SinglePendulum();

var i = 0;
animate();


var func = eval('[' + editor.getValue() + ']')[0];
//alert(func(6));

var T = new Date().getTime();
function animate() {


	var dt = (new Date().getTime()-T)/1000.0;
	T = new Date().getTime();
	
	pendulum.F = 0;
	try {
		var controlFunction = eval('[' + editor.getValue() + ']')[0];	
		pendulum.F = controlFunction(pendulum);
		if(!isNaN(dt))
			pendulum.simulate(Math.min(0.2,dt));
	}
	catch(e){}
	
	
	
	
	// clear all
	context.save();
	context.setTransform(1,0,0,1,0,0);
	context.clearRect(0,0,canvas.width,canvas.height);
	context.restore();
	
	// draw pendulum
	context.beginPath();
	context.moveTo(pendulum.x,0);
	context.lineTo(pendulum.x+pendulum.L*Math.sin(pendulum.theta),pendulum.L*Math.cos(pendulum.theta));
	context.lineWidth = pendulum.L/20.0;
	context.stroke();
	context.closePath();
	
	requestAnimationFrame(animate);
}
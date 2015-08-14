
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var canvas = document.getElementById('cas');
var context = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;
context.translate(canvas.width/2,canvas.height/2);
context.scale(1,-1);

var pendulum = new SinglePendulum();

var i = 0;
animate();

function animate() {

	pendulum.simulate(0.1);	
	
	// clear all
	context.save();
	context.setTransform(1,0,0,1,0,0);
	context.clearRect(0,0,canvas.width,canvas.height);
	context.restore();
	
	// draw pendulumulum
	context.beginPath();
	context.moveTo(pendulum.x,0);
	context.lineTo(pendulum.x+pendulum.L*Math.sin(pendulum.theta),pendulum.L*Math.cos(pendulum.theta));
	context.stroke();
	context.closePath();
	
	requestAnimationFrame(animate);
}
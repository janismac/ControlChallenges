'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.RocketLandingUpsideDown = function()
{
	this.name = "RocketLandingUpsideDown";
	this.title = "Rocket Landing Upside Down";
	this.boilerPlateCode = "function controlFunction(rocket)\n{\n  return {throttle:1,gimbalAngle:-0.2};\n}";
	//this.sampleSolution = "// This takes ~120 seconds, be patient :)\nfunction controlFunction(rocket)\n{\n  if(Math.abs(rocket.x) < 10 \n     && Math.abs(rocket.dx) < 1 \n     && Math.abs(rocket.dtheta) < 0.05\n     && Math.sin(rocket.theta) < 0.05)\n    return { \n      throttle:\n      	0.5\n        -0.01*rocket.y\n        -0.3*rocket.dy,\n      gimbalAngle:      	\n        8*rocket.theta\n        +2*rocket.dtheta\n        +0.08*rocket.dx\n  	};\n  else \n    return {\n      throttle:\n          0.5\n          +0.01*(200-rocket.y)\n          -0.01*rocket.dy,\n      gimbalAngle:\n        8*rocket.theta\n        +2*rocket.dtheta\n        +0.08*rocket.dx\n        +0.03*Math.sign(rocket.x)*Math.min(30,Math.abs(rocket.x))\n  };\n}";
	this.sampleSolution = "function controlFunction(rocket)\n{\n  if (rocket.T < 2.3) return {throttle:1,gimbalAngle:-0.2};\n  if (rocket.T < 4) return {throttle:1,gimbalAngle:0.2};\n  rocket = rocket.simulate(1,function(){return {throttle:.5,gimbalAngle:0};});\n  var a=0;\n  var t=.5;  \n  var x = Math.max(0,Math.abs(rocket.x)-20) * Math.sign(rocket.x);\n  var targetAngle = -0.02*(x + 0.5*Math.abs(rocket.dx)*rocket.dx);  \n  var groundFactor = (Math.tanh((40-rocket.y)/10)+1)/2;  \n  a += 30*rocket.dtheta;\n  a += 15*Math.sin(rocket.theta-Math.tanh(targetAngle));\n  t -= 1e-1*(rocket.dy+(12-9*groundFactor));   \n  return {throttle:t,gimbalAngle:a};\n}";
	this.description = "Someone managed to turn the rocket upside down... can you rescue it?";
	this.resetModel();
}


Levels.RocketLandingUpsideDown.prototype.levelComplete = function(){return this.model.landed();}


Levels.RocketLandingUpsideDown.prototype.levelFailed = function(){return this.model.crashed();}

Levels.RocketLandingUpsideDown.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.RocketLandingUpsideDown.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.RocketLandingUpsideDown.prototype.resetModel = function()
{
	this.model = new Models.RocketLanding({TWR: 2,theta: 3.14,dtheta: 0,Length: 40,Width: 5,x: 50,dx: 20,y: 200,dy: 60,T: 0});
}

Levels.RocketLandingUpsideDown.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.RocketLandingUpsideDown.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
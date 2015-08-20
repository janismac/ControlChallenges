'use strict';
if (typeof Levels == 'undefined') var Levels = {};

Levels.RocketLandingNormal = function()
{
	this.name = "RocketLandingNormal";
	this.title = "Rocket Landing";
	this.boilerPlateCode = "function controlFunction(rocket)\n{\n  return {throttle:1,gimbalAngle:-0.2};\n}";
	//this.sampleSolution = "// This takes ~120 seconds, be patient :)\nfunction controlFunction(rocket)\n{\n  if(Math.abs(rocket.x) < 10 \n     && Math.abs(rocket.dx) < 1 \n     && Math.abs(rocket.dtheta) < 0.05\n     && Math.sin(rocket.theta) < 0.05)\n    return { \n      throttle:\n      	0.5\n        -0.01*rocket.y\n        -0.3*rocket.dy,\n      gimbalAngle:      	\n        8*rocket.theta\n        +2*rocket.dtheta\n        +0.08*rocket.dx\n  	};\n  else \n    return {\n      throttle:\n          0.5\n          +0.01*(200-rocket.y)\n          -0.01*rocket.dy,\n      gimbalAngle:\n        8*rocket.theta\n        +2*rocket.dtheta\n        +0.08*rocket.dx\n        +0.03*Math.sign(rocket.x)*Math.min(30,Math.abs(rocket.x))\n  };\n}";
	this.sampleSolution = "function controlFunction(rocket)\n{\n  rocket = rocket.simulate(1,function(){return {throttle:.5,gimbalAngle:0};});\n  var a=0;\n  var t=.5;  \n  var x = Math.max(0,Math.abs(rocket.x)-20) * Math.sign(rocket.x);\n  var targetAngle = -0.02*(x + 0.5*Math.abs(rocket.dx)*rocket.dx);  \n  var groundFactor = (Math.tanh((40-rocket.y)/10)+1)/2;  \n  a += 30*rocket.dtheta;\n  a += 15*Math.sin(rocket.theta-Math.tanh(targetAngle));\n  t -= 1e-1*(rocket.dy+(12-9*groundFactor));   \n  return {throttle:t,gimbalAngle:a};\n}";
	this.description = "Land the rocket in the landing zone. The center of the landing zone has the coordinates (x,y)==(0,0). Steer the rocket by calculating the engine thrust (range 0 to 1) and engine steering angle (range -0.2 to 0.2 radians). The rocket has a thrust to weight ratio of 2. A throttle value of 0.5 can make it hover. Touch down gently (less than 5 m/s).";
	this.resetModel();
}


Levels.RocketLandingNormal.prototype.levelComplete = function(){return this.model.landed();}


Levels.RocketLandingNormal.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.RocketLandingNormal.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.RocketLandingNormal.prototype.resetModel = function()
{
	this.model = new Models.RocketLanding({TWR: 2,theta: -0.3,dtheta: 0,Length: 40,Width: 5,x: -100,dx: 0,y: 200,dy: -20,T: 0});
}
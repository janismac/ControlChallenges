'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.RocketLandingNormal = function()
{
	this.name = "RocketLandingNormal";
	this.title = "Rocket Landing";
	this.boilerPlateCode = "function controlFunction(rocket)\n{\n  return {throttle:1,gimbalAngle:-0.2};\n}";
	this.sampleSolution = "function controlFunction(rocket)\n{\n  rocket = rocket.simulate(1,function(){return {throttle:.5,gimbalAngle:0};});\n  var a=0;\n  var t=.5;  \n  var x = Math.max(0,Math.abs(rocket.x)-20) * Math.sign(rocket.x);\n  var targetAngle = -0.02*(x + 0.5*Math.abs(rocket.dx)*rocket.dx);  \n  var groundFactor = (Math.tanh((40-rocket.y)/10)+1)/2;  \n  a += 30*rocket.dtheta;\n  a += 15*Math.sin(rocket.theta-Math.tanh(targetAngle));\n  t -= 1e-1*(rocket.dy+(12-9*groundFactor));   \n  return {throttle:t,gimbalAngle:a};\n}";
	this.description = "Land the rocket in the landing zone. The center of the landing zone has the coordinates (x,y)==(0,0). Steer the rocket by calculating the engine thrust (range 0 to 1) and engine steering angle (range -0.2 to 0.2 radians). The rocket has a thrust to weight ratio of 2. A throttle value of 0.5 can make it hover. Touch down gently (less than 5 m/s).";
	this.model = new Models.RocketLanding({TWR: 2,theta: -0.3,dtheta: 0,Length: 40,Width: 5,x: -100,dx: 0,y: 200,dy: -20,T: 0});
}


Levels.RocketLandingNormal.prototype.levelComplete = function(){return this.model.landed();}


Levels.RocketLandingNormal.prototype.levelFailed = function(){return this.model.crashed();}

Levels.RocketLandingNormal.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.RocketLandingNormal.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.RocketLandingNormal.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.RocketLandingNormal.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
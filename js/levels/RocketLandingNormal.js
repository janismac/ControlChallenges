'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.RocketLandingNormal = function()
{
	this.name = "RocketLandingNormal";
	this.title = "Rocket Landing";
	this.boilerPlateCode = "function controlFunction(rocket)\n{\n  return {throttle:1,gimbalAngle:-0.2};\n}";
	this.sampleSolution = "function controlFunction(rocket)\n{\n  // Horizontal position control\n  var x_target = 0.0;\n  var dx_target = 0.2 * (x_target - rocket.x);\n  if(Math.abs(x_target - rocket.x) < 20.0) dx_target = 0.0;\n  var theta_target = 0.05 * (dx_target - rocket.dx);\n  \n  // Pitch control with limits on angle and angular rate\n  theta_target = Math.max(-0.6, Math.min(0.6, theta_target));\n  var dtheta_target = 1.0 * (theta_target - rocket.theta);\n  dtheta_target = Math.max(-1.0, Math.min(1.0, dtheta_target));\n  var gimbalAngle = 30.0 * (rocket.dtheta - dtheta_target);\n  \n  // Vertical speed profile for constant acceleration landing\n  var dy_target = -Math.sqrt(10.0 * Math.max(1e-6, rocket.y - 25));\n  \n  // Maintain height until positioned over the landing pad\n  if(Math.abs(rocket.x) > 35.0 || Math.abs(rocket.dx) > 12.0) dy_target = 0.5;\n  \n  // Vertical speed control\n  var throttle = 0.5 + 1.0 * (dy_target - rocket.dy);\n  \n  // Set high throttle while spinning to guarantee control authority\n  if(Math.abs(rocket.theta) > 0.6 || Math.abs(rocket.dtheta) > 0.5) throttle = 0.9;\n  throttle = Math.max(0.25, throttle);\n  \n  return {throttle:throttle, gimbalAngle:gimbalAngle};\n}";
	this.description = "Land the rocket in the landing zone. The center of the landing zone has the coordinates (x, y) = (0, 0). Steer the rocket by calculating the engine thrust (range 0 to 1) and engine steering angle (range -0.2 to 0.2 radians). The rocket has a thrust to weight ratio of 2. A throttle value of 0.5 can make it hover. Touch down gently (less than 5 m/s).";
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
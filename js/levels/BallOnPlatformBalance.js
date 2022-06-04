'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.BallOnPlatformBalance = function()
{
	this.name = "BallOnPlatformBalance";
	this.title = "Ball on Platform: Balance";
	this.boilerPlateCode = "function controlFunction(ball, piston, hinge, T)\n{\n  return {pistonAcceleration: 100 * Math.sin(20*T), hingeAcceleration: 100 * Math.sin(17 * T)};\n}";
	this.sampleSolution = "function controlFunction(ball, piston, hinge, T)\n{\n  var piston_speed_target = 0;\n  if((ball.y - (piston.length - 5.15)) < 1.0 && ball.vy*ball.vy > 0.1)\n  {\n    piston_speed_target = 0.5 * ball.vy;\n  }\n  piston_speed_target += 2.0 * (2.0 - piston.length);\n  var pistonAcceleration = 40 * (piston_speed_target - piston.speed);\n  var hinge_angle_target = 0.25 * ball.vx + 0.2 * ball.x;\n  var hinge_speed_target = 10 * (hinge_angle_target - hinge.angle);\n  var hingeAcceleration = 40 * (hinge_speed_target - hinge.speed);\n  return {pistonAcceleration:pistonAcceleration, hingeAcceleration:hingeAcceleration};\n}";
	this.description = "Catch the ball and keep it at rest in the center of the platform.";
	this.model = new Models.BouncingBallPlatform({});
}


Levels.BallOnPlatformBalance.prototype.levelComplete = function()
{
	return Math.abs(this.model.ball_x) < 0.01 &&
	Math.abs(this.model.ball_dx) < 0.01 &&
	Math.abs(this.model.ball_dy) < 0.2 &&
	Math.abs(this.model.piston_speed) < 0.01 &&
	this.model.contact_distance < 1.1 * this.model.ball_radius &&
	Math.abs(this.model.hinge_angular_speed) < 0.01;
}


Levels.BallOnPlatformBalance.prototype.levelFailed = function(){return false;}

Levels.BallOnPlatformBalance.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.BallOnPlatformBalance.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.BallOnPlatformBalance.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.BallOnPlatformBalance.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
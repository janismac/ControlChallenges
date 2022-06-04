'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.BallOnPlatformBounce = function()
{
	this.name = "BallOnPlatformBounce";
	this.title = "Ball on Platform: Bounce";
	this.boilerPlateCode = "function controlFunction(ball, piston, hinge, T)\n{\n  return {pistonAcceleration: 100 * Math.sin(20*T), hingeAcceleration: 100 * Math.sin(17 * T)};\n}";
	this.sampleSolution = "var punt_speed = 3.9;\nfunction controlFunction(ball, piston, hinge, T)\n{\n  var time_to_impact = -(ball.y + 3.5)/ball.vy;\n  var piston_speed_target = -10;\n  if(ball.vy < 0 && time_to_impact < 1) piston_speed_target = punt_speed + 0.5 * ball.vy;\n  var pistonAcceleration = 40 * (piston_speed_target - piston.speed);\n  var hinge_angle_target = 0.08 * ball.vx + 0.06 * ball.x;\n  var hinge_speed_target = 10 * (hinge_angle_target - hinge.angle);\n  var hingeAcceleration = 40 * (hinge_speed_target - hinge.speed);\n  var apogee = ball.y + ball.vy*ball.vy / (2*9.81);\n  punt_speed -= 0.001 * apogee;\n  monitor('punt_speed   ', punt_speed);\n  monitor('apogee       ', ball.y + ball.vy*ball.vy / (2*9.81));\n  return {pistonAcceleration:pistonAcceleration, hingeAcceleration:hingeAcceleration};\n}";
	this.description = "Keep the ball bouncing such that it reaches its highest point at the position (x, y) = (0, 0) and velocity (vx, vy) = (0, 0) on every bounce.";
	this.model = new Models.BouncingBallPlatform({show_zero_cross: true});
}


Levels.BallOnPlatformBounce.prototype.levelComplete = function(){return this.model.bounce_win_condition_counter > 1200;}


Levels.BallOnPlatformBounce.prototype.levelFailed = function(){return false;}

Levels.BallOnPlatformBounce.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.BallOnPlatformBounce.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.BallOnPlatformBounce.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.BallOnPlatformBounce.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
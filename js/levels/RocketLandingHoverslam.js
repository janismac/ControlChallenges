'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.RocketLandingHoverslam = function()
{
	this.name = "RocketLandingHoverslam";
	this.title = "Rocket Landing Hoverslam";
	this.boilerPlateCode = "function controlFunction(rocket)\n{\n  return {throttle:1,gimbalAngle:0};\n}";
	this.sampleSolution = "function controlFunction(rocket)\n{\n  var t = 0.4 -0.0175*rocket.y -0.1*rocket.dy;\n  var a = 2*rocket.theta +2*rocket.dtheta +0.01*rocket.x +0.09*rocket.dx;  \n  return {throttle:t,gimbalAngle:a};\n}";
	this.description = "In this level the rocket can not hover, because the engines can not throttle low enough. The thrust-to-weight ratio can range from 1.2 to 2 (throttle of 0.6 to 1).";
	this.model = new Models.RocketLanding({TWR: 2,theta: -0.1,dtheta: 0,Length: 40,Width: 5,x: -80,dx: 0,y: 400,dy: -70,T: 0,throttleLimit: .6});
}

Levels.RocketLandingHoverslam.prototype.levelComplete = function(){return this.model.landed();}


Levels.RocketLandingHoverslam.prototype.levelFailed = function(){return this.model.crashed();}

Levels.RocketLandingHoverslam.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.RocketLandingHoverslam.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.RocketLandingHoverslam.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.RocketLandingHoverslam.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
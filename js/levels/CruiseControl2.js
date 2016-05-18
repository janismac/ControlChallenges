'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.CruiseControl2 = function()
{
	this.name = "CruiseControl2";
	this.title = "Cruise Control 2";
	this.boilerPlateCode = "function controlFunction(vehicle){ \n  return Math.sin(2*vehicle.T);\n};";
	this.sampleSolution = "function controlFunction(vehicle){\n  return 4 * (vehicle.targetSpeed - vehicle.speed);\n};";
	this.description = "This time the target speed and road inclination change constantly. Keep the speed deviation below 0.5 units for 10 seconds.";
	ImageDataCache.load('img/speedometer.png');
	ImageDataCache.load('img/car.png');
	this.model = new Models.CruiseControl({carImg:'img/car.png',speedometerImg:'img/speedometer.png'});
}


Levels.CruiseControl2.prototype.levelComplete = function(){return this.model.speedHoldTimer > 10;}

Levels.CruiseControl2.prototype.levelFailed = function(){return false;}

Levels.CruiseControl2.prototype.simulate = function (dt, controlFunc)
{ 
	this.model.targetSpeed = 60 + 5 * Math.cos(0.7*this.model.T) + 5 * Math.sin(0.5*this.model.T);
	this.model.inclination = .1 * Math.cos(0.4*this.model.T) - .1 * Math.sin(0.6*this.model.T);
	this.model = this.model.simulate (dt, controlFunc); 
}

Levels.CruiseControl2.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.CruiseControl2.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.CruiseControl2.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.VehicleSteeringSimple = function()
{
	this.name = "VehicleSteeringSimple";
	this.title = "Vehicle Steering";

	this.sampleSolution = "function controlFunction(vehicle){\n	return 0.1*(vehicle.lidarPoints[0].distance - vehicle.lidarPoints[4].distance);\n};";
	this.boilerPlateCode = "function controlFunction(vehicle){\n	return -0.03;\n};";
	this.description = "TODO";
	ImageDataCache.load('track.png');
	this.model = new Models.Vehicle({trackImgURL: 'track.png'});
}


Levels.VehicleSteeringSimple.prototype.levelComplete = function()
{
	return false;
}

Levels.VehicleSteeringSimple.prototype.levelFailed = function()
{
	return this.model.detectCollision();
}


Levels.VehicleSteeringSimple.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.VehicleSteeringSimple.prototype.getSimulationTime = function() {return this.model.T;}

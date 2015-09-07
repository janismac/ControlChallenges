'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.VehicleSteeringSimple = function()
{
	this.name = "VehicleSteeringSimple";
	this.title = "TODO";

	this.sampleSolution = "TODO";
	this.boilerPlateCode = "function controlFunction(x){};";
	this.description = "TODO";
	ImageDataCache.load('track.png');
	this.model = new Models.Vehicle({trackImgURL: 'track.png'});
}


Levels.VehicleSteeringSimple.prototype.levelComplete = function()
{
	return false;
}


Levels.VehicleSteeringSimple.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.VehicleSteeringSimple.prototype.getSimulationTime = function() {return this.model.T;}

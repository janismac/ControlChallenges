'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.VehicleRacing = function()
{
	this.name = "VehicleRacing";
	this.title = "Vehicle Racing";

	this.sampleSolution = "function controlFunction(vehicle){  \n  var v_ref = Math.max(.4*vehicle.lidarPoints[2].distance,10);\n  var v = vehicle.speed;\n  return {steering: 0.1*(vehicle.lidarPoints[0].distance - vehicle.lidarPoints[4].distance), acceleration: 10*(v_ref-v)};\n};";
	this.boilerPlateCode = "function controlFunction(vehicle){  \n  return {steering: 0, acceleration: 0};\n};";
	this.description = "Calculate the appropriate steering angle [radians] and acceleration [m/s²] for the vehicle. The lateral acceleration is limited. If you go too fast into a turn you won't be able to steer through it.";
	ImageDataCache.load('img/track.png');
	this.model = new Models.Vehicle({trackImgURL: 'img/track.png', constantSpeed:false});
}


Levels.VehicleRacing.prototype.levelComplete = function()
{
	return Math.abs(this.model.x - 82) < 4 
		&& Math.abs(this.model.y - 46) < 4;
}

Levels.VehicleRacing.prototype.levelFailed = function()
{
	return this.model.detectCollision();
}


Levels.VehicleRacing.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.VehicleRacing.prototype.getSimulationTime = function() {return this.model.T;}

Levels.VehicleRacing.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.VehicleRacing.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
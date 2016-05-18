'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.VehicleSteeringSimple = function()
{
	this.name = "VehicleSteeringSimple";
	this.title = "Vehicle Steering";

	this.sampleSolution = "function controlFunction(vehicle){\n	return 0.1*(vehicle.lidarPoints[0].distance - vehicle.lidarPoints[4].distance);\n};";
	this.boilerPlateCode = "function controlFunction(vehicle){\n	return -0.03;\n};";
	this.description = "Steer the vehicle along the track by calculating the necessary steering angle in radians. The vehicle speed is constant. The vehicle has sensors that tell the distance to the track's edge in different directions relative to the vehicle.";
	ImageDataCache.load('img/track.png');
	this.model = new Models.Vehicle({trackImgURL: 'img/track.png', lateralAccelerationLimit: 40});
}


Levels.VehicleSteeringSimple.prototype.levelComplete = function()
{
	return Math.abs(this.model.x - 82) < 4 
		&& Math.abs(this.model.y - 46) < 4;
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

Levels.VehicleSteeringSimple.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.VehicleSteeringSimple.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
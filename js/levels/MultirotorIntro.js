'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.MultirotorIntro = function()
{
	this.name = "MultirotorIntro";
	this.title = "Multirotor Intro";
	this.boilerPlateCode = "function controlFunction(vehicle){  \n  return {thrustLeft: 9.81/2-.001, thrustRight: 9.81/2+0.001};\n};";
	this.sampleSolution = "TODO";
	this.description = "TODO";
	ImageDataCache.load('multirotor_lowres.png');
	this.model = new Models.Multirotor({imgURL:'multirotor_lowres.png'});
}


Levels.MultirotorIntro.prototype.levelComplete = function(){return false;}

Levels.MultirotorIntro.prototype.levelFailed = function(){return false;}

Levels.MultirotorIntro.prototype.simulate = function (dt, controlFunc)
{ this.model = this.model.simulate (dt, controlFunc); }

Levels.MultirotorIntro.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.MultirotorIntro.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.MultirotorIntro.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
'use strict';
if (typeof Levels == 'undefined') var Levels = {};

Levels.StabilizeDoublePendulum = function()
{
	this.name = "StabilizeDoublePendulum";
	this.title = "Inverted Double Pendulum: Stabilize";
	this.sampleSolution = "function controlFunction(pendulum)\n{\n  return 10*Math.sin(8*pendulum.T);\n}";
	this.boilerPlateCode = "function controlFunction(pendulum)\n{\n  return 10*Math.sin(8*pendulum.T);\n}";
	this.description = "Stabilize the double pendulum so that it stays upright, moves to the center (x=0) and stays there in perfect balance. Calculate the horizontal force on the cart necessary to achieve this.";
	this.model = new Models.DoublePendulum({});
}


Levels.StabilizeDoublePendulum.prototype.levelComplete = function()
{
	return Math.abs(this.model.x) < 0.01 
	&& Math.abs(this.model.dx) < 0.01 
	&& Math.abs(this.model.dtheta) < 0.01 
	&& Math.abs(Math.sin(this.model.theta)) < 0.001
	&& Math.cos(this.model.theta) > 0.999;
}


Levels.StabilizeDoublePendulum.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.StabilizeDoublePendulum.prototype.getSimulationTime = function()	{return this.model.T;}

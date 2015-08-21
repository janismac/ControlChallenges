'use strict';
if (typeof Levels == 'undefined') var Levels = {};

Levels.StabilizeDoublePendulum = function()
{
	this.name = "StabilizeDoublePendulum";
	this.title = "Inverted Double Pendulum: Stabilize";
	this.sampleSolution = "// Unsolved so far. If you find a solution, please send it to me: \n// https://github.com/janismac/ControlChallenges/issues\n\nfunction controlFunction(pendulum)\n{\n  return 10*Math.sin(8*pendulum.T);\n}";
	this.boilerPlateCode = "function controlFunction(pendulum)\n{\n  return 10*Math.sin(8*pendulum.T);\n}";
	this.description = "Stabilize the double pendulum so that it stays upright, moves to the center (x=0) and stays there in perfect balance. Calculate the horizontal force on the cart necessary to achieve this.";
	this.model = new Models.DoublePendulum({m0: 10,m1: 2,m2: 2,L1: 0.618,L2: 1,g: 5,theta1: 0.001,dtheta1: 0.001,theta2: 0.001,dtheta2: 0.001,x: -1,dx: 0,F: 0,T: 0});
}


Levels.StabilizeDoublePendulum.prototype.levelComplete = function()
{
	return Math.abs(this.model.x) < 0.01 
	&& Math.abs(this.model.dx) < 0.01 
	&& Math.abs(this.model.dtheta1) < 0.01 
	&& Math.abs(Math.sin(this.model.theta1)) < 0.001
	&& Math.cos(this.model.theta1) > 0.999
	&& Math.abs(this.model.dtheta2) < 0.01 
	&& Math.abs(Math.sin(this.model.theta2)) < 0.001
	&& Math.cos(this.model.theta2) > 0.999;
}


Levels.StabilizeDoublePendulum.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.StabilizeDoublePendulum.prototype.getSimulationTime = function()	{return this.model.T;}

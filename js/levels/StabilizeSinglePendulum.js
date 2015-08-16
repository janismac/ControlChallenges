if (typeof Levels == 'undefined') Levels = {};

Levels.StabilizeSinglePendulum = function()
{
	this.name = "StabilizeSinglePendulum";
	this.title = "Inverted Pendulum";
	this.sampleSolution = "function controlFunction(pendulum)\n{\n  return 1000*Math.sin(pendulum.theta)+500*pendulum.dtheta+100*pendulum.x+160*pendulum.dx;\n}";
	this.boilerPlateCode = "function controlFunction(pendulum)\n{\n  return 10*Math.sin(8*pendulum.T);\n}";
	this.description = "Stabilize the pendulum so that it stays upright. Calculate the horizontal force on the cart necessary to achieve this.";
	
	this.model = new Models.SinglePendulum();
	this.resetModel();
}


Levels.StabilizeSinglePendulum.prototype.levelComplete = function()
{
	return Math.abs(this.model.x) < 0.01 
	&& Math.abs(this.model.dx) < 0.01 
	&& Math.abs(this.model.dtheta) < 0.01 
	&& Math.abs(Math.sin(this.model.theta)) < 0.001
	&& Math.cos(this.model.theta) > 0.999;
}

Levels.StabilizeSinglePendulum.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.StabilizeSinglePendulum.prototype.resetModel = function()
{
	this.model.m0 = 10;
	this.model.m1 = .5;
	this.model.L = 1;
	this.model.g = 9.81;
	this.model.theta = 0.2;
	this.model.dtheta = 0;
	this.model.x = -2;
	this.model.dx = 0;
	this.model.F = 0;
	this.model.T = 0;
	this.model.controlFunction = function(){return 0;}
}
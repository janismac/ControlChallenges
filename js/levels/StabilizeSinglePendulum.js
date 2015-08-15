if (typeof Levels == 'undefined') Levels = {};

Levels.StabilizeSinglePendulum = function()
{
	this.name = "StabilizeSinglePendulum";
	this.title = "Level 1";
	this.sampleSolution = "function controlFunction(pendulum)\n{\n  return 1000*Math.sin(pendulum.theta)+500*pendulum.dtheta+100*pendulum.x+160*pendulum.dx;\n}";
	this.boilerPlateCode = "function controlFunction(pendulum)\n{\n  return 10*Math.sin(8*pendulum.T);\n}";
	this.description = "Stabilize the pendulum so that it stays upright. Calculate the horizontal force on the cart necessary to achieve this.";
	
	this.model = new Models.SinglePendulum();
	this.resetModel();
}


Levels.StabilizeSinglePendulum.prototype.isSolved = function(){return false;}

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
}
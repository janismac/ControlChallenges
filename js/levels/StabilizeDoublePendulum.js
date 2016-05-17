'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.StabilizeDoublePendulum = function()
{
	this.name = "StabilizeDoublePendulum";
	this.title = "Inverted Double Pendulum: Stabilize";
	this.sampleSolution = "function controlFunction(p)\n{\n  // Controller coefficients optimized using this sage math script:\n  // https://github.com/janismac/ControlChallenges/blob/master/misc/doublependulum.sage\n  \n  var c =[-0.36447, -3.12476, 290.6325, 114.9936, -280.555, -155.5489];\n  return c[0]*p.x + c[1]*p.dx + c[2]*p.theta1 + c[3]*p.dtheta1 + c[4]*p.theta2 + c[5]*p.dtheta2;\n}";
	this.boilerPlateCode = "function controlFunction(pendulum)\n{\n  return 10*Math.sin(8*pendulum.T);\n}";
	this.description = "Stabilize the double pendulum so that it stays upright, moves to the center (x=0) and stays there in perfect balance. Calculate the horizontal force on the cart necessary to achieve this.";
	this.model = new Models.DoublePendulum({m0: 10,m1: 2,m2: 4,L1: 0.618,L2: 1,g: 2,theta1: -0.05,dtheta1: 0,theta2: 0,dtheta2: 0.05,x: -1,dx: 0,F: 0,T: 0});
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

Levels.StabilizeDoublePendulum.prototype.levelFailed = function()
{
	return false;
}


Levels.StabilizeDoublePendulum.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.StabilizeDoublePendulum.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.StabilizeDoublePendulum.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.StabilizeDoublePendulum.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
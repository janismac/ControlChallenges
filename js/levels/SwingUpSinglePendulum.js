'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.SwingUpSinglePendulum = function()
{
	this.name = "SwingUpSinglePendulum";
	this.title = "Inverted Pendulum: Swing up";

	this.sampleSolution = "function controlFunction(pendulum)\n{\n  if(pendulum.T < 0.10) return 600;\n  if(pendulum.T < 0.3) return 0;\n  if(pendulum.T < 0.50) return -400;\n  return 1100*Math.sin(pendulum.theta)\n    + 400*pendulum.dtheta \n    + 110*2*Math.tanh(pendulum.x/2) \n    + 160*pendulum.dx;\n}";
	this.boilerPlateCode = "function controlFunction(pendulum)\n{\n  return 10*Math.sin(8*pendulum.T);\n}";
	this.description = "Bring the pendulum into an upright position and keep it upright in the center (x=0).";
	this.model = new Models.SinglePendulum({m0: 10,m1: .5,L: 1,g: 9.81,theta: 3.1415,dtheta: 0,x: 0,dx: 0,F: 0,T: 0});
}


Levels.SwingUpSinglePendulum.prototype.levelComplete = function()
{
	return Math.abs(this.model.x) < 0.01 
	&& Math.abs(this.model.dx) < 0.01 
	&& Math.abs(this.model.dtheta) < 0.01 
	&& Math.abs(Math.sin(this.model.theta)) < 0.001
	&& Math.cos(this.model.theta) > 0.999;
}

Levels.SwingUpSinglePendulum.prototype.levelFailed = function()
{
	return false;
}


Levels.SwingUpSinglePendulum.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.SwingUpSinglePendulum.prototype.getSimulationTime = function()	{return this.model.T;}


Levels.SwingUpSinglePendulum.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.SwingUpSinglePendulum.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
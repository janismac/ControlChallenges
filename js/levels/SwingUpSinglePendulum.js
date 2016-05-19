'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.SwingUpSinglePendulum = function()
{
	this.name = "SwingUpSinglePendulum";
	this.title = "Inverted Pendulum: Swing up";

	this.sampleSolution = "function controlFunction(pendulum)\n{\n  if (pendulum.T < 0.5) return  50;\n  if (pendulum.T < 1.5) return -50;\n  if (pendulum.T < 2.5) return  50;\n  if (pendulum.T < 2.7) return -50;\n  else return 600*Math.sin(pendulum.theta) + 300*pendulum.dtheta + 15*pendulum.x + 40*pendulum.dx;\n}";
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
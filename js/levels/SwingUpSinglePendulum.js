'use strict';
if (typeof Levels == 'undefined') var Levels = {};

Levels.SwingUpSinglePendulum = function()
{
	this.name = "SwingUpSinglePendulum";
	this.title = "Inverted Pendulum: Swing up";
	this.sampleSolution = "function controlFunction(pendulum)\n{\n  if(pendulum.T == 0) cc_upright = false;  \n  if(Math.cos(pendulum.theta) > 0.999) cc_upright = true;\n  \n  if(pendulum.T < 0.5) return 50;\n  if(pendulum.T < 1) return -50;  \n  if(cc_upright) \n    return 1000*Math.sin(pendulum.theta)+500*pendulum.dtheta+100*pendulum.x+160*pendulum.dx;\n  \n  return 9*pendulum.dtheta;\n}\n";
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


Levels.SwingUpSinglePendulum.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.SwingUpSinglePendulum.prototype.getSimulationTime = function()	{return this.model.T;}

'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.SwingUpDoublePendulum = function()
{
	this.name = "SwingUpDoublePendulum";
	this.title = "Inverted Double Pendulum: Swing Up";
	this.sampleSolution = "function controlFunction(p)\n{\n  var s = [[0.295, 49.5], [0.81, -49.5], [0.7, 0.0], [0.52, 50.0], [1.2, 0.0]];\n  while(s.length != 0)\n  {\n    var [dt,F] = s.shift();\n    p.T -= dt;\n    if(p.T <= 0) return F;\n  }\n  \n  var x_offset = Math.max(0, 2.5 - 3.0 * p.T);\n  return 18.9*p.dtheta1 - 352.0*p.dtheta2 - 98.0*p.dx + 492.5*p.theta1 - 764.6*p.theta2 - 31.6*(p.x + x_offset);\n}";
	this.boilerPlateCode = "function controlFunction(pendulum)\n{\n  return 10*Math.sin(8*pendulum.T);\n}";
	this.description = "Bring the pendulum into an upright position and keep it upright in the center (x=0).";
	this.model = new Models.DoublePendulum({m0: 10,m1: 2,m2: 4,L1: 0.618,L2: 1,g: 2,theta1: -3.1415,dtheta1: 0,theta2: 3.1415,dtheta2: 0.0,x: -1,dx: 0,F: 0,T: 0});
}


Levels.SwingUpDoublePendulum.prototype.levelComplete = function()
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

Levels.SwingUpDoublePendulum.prototype.levelFailed = function()
{
	return false;
}


Levels.SwingUpDoublePendulum.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.SwingUpDoublePendulum.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.SwingUpDoublePendulum.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.SwingUpDoublePendulum.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
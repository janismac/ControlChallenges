if (typeof Levels == 'undefined') Levels = {};

Levels.StabilizeSinglePendulum = function()
{
	this.name = "StabilizeSinglePendulum";
	this.title = "Inverted Pendulum";
	this.sampleSolution = "function controlFunction(pendulum)\n{\n  return 1000*Math.sin(pendulum.theta)+500*pendulum.dtheta+100*pendulum.x+160*pendulum.dx;\n}";
	this.boilerPlateCode = "function controlFunction(pendulum)\n{\n  return 10*Math.sin(8*pendulum.T);\n}";
	this.description = "Stabilize the pendulum so that it stays upright. Calculate the horizontal force on the cart necessary to achieve this.";		
	this.tips = "You can predict the future of the system by calling simulate(dt, controlFunc)\n\n    var futurePendulum = pendulum.simulate(0.5, function(p){ return -p.x ;})\n\nsimulate() returns a modified copy. The following calls are not equivalent since the control function `f` will be evaluated only once per call and held constant during the timespan `dt`.\n\n    var futurePendulum = pendulum.simulate(dt, f).simulate(dt, f);\n    var futurePendulum = pendulum.simulate(2*dt, f);\n\n\nYou can inspect variables by calling `console.log(myvar);` and viewing the result in your browsers console.\n\nIf you need to you can use global variables. Be careful not to create a name collision, use a prefix, e.g. `cc_`.";
	this.model = new Models.SinglePendulum({m0: 10,m1: .5,L: 1,g: 9.81,theta: 0.2,dtheta: 0,x: -2,dx: 0,F: 0,T: 0});
}


Levels.StabilizeSinglePendulum.prototype.levelComplete = function()
{
	return Math.abs(this.model.x) < 0.01 
	&& Math.abs(this.model.dx) < 0.01 
	&& Math.abs(this.model.dtheta) < 0.01 
	&& Math.abs(Math.sin(this.model.theta)) < 0.001
	&& Math.cos(this.model.theta) > 0.999;
}


Levels.StabilizeSinglePendulum.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.StabilizeSinglePendulum.prototype.getSimulationTime = function()	{return this.model.T;}

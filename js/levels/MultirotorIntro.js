'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.MultirotorIntro = function()
{
	this.name = "MultirotorIntro";
	this.title = "Multirotor Intro";
	this.boilerPlateCode = "function controlFunction(vehicle){  \n  return {thrustLeft: 9.81/2+.001, thrustRight: 9.81/2-0.001};\n};";
	this.sampleSolution = "function attitude_control(theta_ref, thrust_ref, vehicle){\n  var P = theta_ref-vehicle.theta;\n  var kP = 100;\n  var kD = 20;\n  var y = kP * P - kD * vehicle.dtheta;  \n  return {thrustLeft: thrust_ref/2+y, thrustRight: thrust_ref/2-y};\n}\n\nfunction acceleration_control(ax_ref, ay_ref, vehicle){\n  ay_ref += 9.81;\n  var theta_ref = Math.atan2(ax_ref, ay_ref);\n  var thrust_ref = Math.sqrt(1e-3 + ax_ref*ax_ref + ay_ref*ay_ref);\n  return attitude_control(theta_ref, thrust_ref, vehicle);\n}\n\nfunction controlFunction(vehicle){ \n  return acceleration_control(-2*vehicle.dx-vehicle.x, -2*vehicle.dy-vehicle.y, vehicle);\n};\n";
	this.description = "Control the multirotor by calculating appropriate thrust forces for each rotor. Fly into the green box and stop there. All coordinates (x,y,theta) must converge to zero.";
	ImageDataCache.load('img/multirotor_lowres.png');
	this.model = new Models.Multirotor({imgURL:'img/multirotor_lowres.png',	theta: 0,dtheta: 0,x: -1,dx: 0,y: -1,dy: 0});
}


Levels.MultirotorIntro.prototype.levelComplete = function(){
	return Math.abs(this.model.x) < 0.01
		&& Math.abs(this.model.y) < 0.01
		&& Math.abs(this.model.dx) < 0.01
		&& Math.abs(this.model.dy) < 0.01
		&& Math.abs(this.model.theta) < 0.01
		&& Math.abs(this.model.dtheta) < 0.01;
}

Levels.MultirotorIntro.prototype.levelFailed = function(){return false;}

Levels.MultirotorIntro.prototype.simulate = function (dt, controlFunc)
{ this.model = this.model.simulate (dt, controlFunc); }

Levels.MultirotorIntro.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.MultirotorIntro.prototype.draw = function(ctx, canvas){
	resetCanvas(ctx,canvas);
	ctx.scale(3,3);
	ctx.fillStyle="#88ff88";
	var s = this.model.Length;
	ctx.fillRect(-2*s,-.8*s,4*s,1.6*s);

	this.model.drawVehicle(ctx, canvas);
}

Levels.MultirotorIntro.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.MultirotorFlip = function()
{
	this.name = "MultirotorFlip";
	this.title = "Multirotor Flip";
	this.boilerPlateCode = "function controlFunction(vehicle){  \n  return {thrustLeft: 9.81/2+.001, thrustRight: 9.81/2-0.001};\n};";
	this.sampleSolution = "function attitude_control(theta_ref, thrust_ref, vehicle){\n  var P = theta_ref-vehicle.theta;\n  if (P < -Math.PI) P += Math.PI*2;\n  var kP = 100;\n  var kD = 20;\n  var y = kP * P - kD * vehicle.dtheta;  \n  return {thrustLeft: thrust_ref/2+y, thrustRight: thrust_ref/2-y};\n}\n\nfunction acceleration_control(ax_ref, ay_ref, vehicle){\n  ay_ref += 9.81;\n  var theta_ref = Math.atan2(ax_ref, ay_ref);\n  var thrust_ref = Math.sqrt(1e-3 + ax_ref*ax_ref + ay_ref*ay_ref);\n  return attitude_control(theta_ref, thrust_ref, vehicle);\n}\n\nfunction position_control(px, py, vehicle){\n    var kP = 3;\n    var kD = 2.5;\n    var ex = px-vehicle.x;\n    var ey = py-vehicle.y;\n    return acceleration_control(-kD*vehicle.dx+kP*ex, -kD*vehicle.dy+kP*ey, vehicle);\n}\n\nvar state = 0;\nfunction controlFunction(vehicle){\n  if(state == 0) {\n    var ex = (-vehicle.x-.6);\n    var ey = (-vehicle.y-.8);\n    if(Math.abs(ex) <  0.05 && Math.abs(ey) <  0.05) state++;\n    return position_control(-.6, -.8, vehicle);\n  }\n  else if (state == 1) {\n    if(vehicle.x > -.2) state++;\n    return acceleration_control(1,.5, vehicle);    \n  }\n  else if (state == 2) {\n    if(vehicle.theta < 5.5) state++;\n    return {thrustLeft:0, thrustRight:20};\n  }\n  else if (state == 3) {\n    if(vehicle.theta < 1) state++;\n    return {thrustLeft:0, thrustRight:0};\n  }\n  else {\n    return position_control(0, 0, vehicle);\n  }\n};";
	this.description = "Make a counter-clockwise flip and stop in the green box. Don't touch the walls!";
	ImageDataCache.load('img/multirotor_lowres.png');
	this.model = new Models.Multirotor({imgURL:'img/multirotor_lowres.png',	theta: 2*Math.PI,dtheta: 0,x: 0,dx: 0,y: 0,dy: 0});
	this.boxRadius = 1;
	this.collisionRadius = this.boxRadius - 0.8 * this.model.Length;
}


Levels.MultirotorFlip.prototype.levelComplete = function(){
	return Math.abs(this.model.x) < 0.01
		&& Math.abs(this.model.y) < 0.01
		&& Math.abs(this.model.dx) < 0.01
		&& Math.abs(this.model.dy) < 0.01
		&& Math.abs(this.model.theta) < 0.01
		&& Math.abs(this.model.dtheta) < 0.01;
}

Levels.MultirotorFlip.prototype.levelFailed = function(){
	return this.model.x >  this.collisionRadius
	    || this.model.x < -this.collisionRadius
	    || this.model.y >  this.collisionRadius
	    || this.model.y < -this.collisionRadius;
}

Levels.MultirotorFlip.prototype.simulate = function (dt, controlFunc)
{ this.model = this.model.simulate (dt, controlFunc); }

Levels.MultirotorFlip.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.MultirotorFlip.prototype.draw = function(ctx, canvas){
	resetCanvas(ctx,canvas);
	ctx.scale(2,2);
	ctx.fillStyle="#88ff88";
	var s = this.model.Length;
	ctx.fillRect(-2*s,-.8*s,4*s,1.6*s);


	ctx.fillStyle="#883300";
	var d = 0.1;
	var r = this.boxRadius;
	ctx.fillRect(-d-r,-d-r,d,2*(r+d));
	ctx.fillRect(-d-r,-d-r,2*(r+d),d);
	ctx.fillRect(r,-r-d,d,2*(r+d));
	ctx.fillRect(-r-d,r,2*(r+d),d);

	this.model.drawVehicle(ctx, canvas);

	if(this.levelFailed()){
		ctx.save();
		ctx.translate(-1,0);
		ctx.scale(0.005,-0.005);
		ctx.font="10px Verdana";
		ctx.textAlign="center"; 
		ctx.fillStyle="#990000";
		ctx.fillText("CRASHED!",0,0);
		ctx.restore();
	}
}

Levels.MultirotorFlip.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
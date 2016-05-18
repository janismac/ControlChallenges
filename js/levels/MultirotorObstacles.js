'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.MultirotorObstacles = function()
{
	this.name = "MultirotorObstacles";
	this.title = "Multirotor Obstacles";
	this.boilerPlateCode = "function controlFunction(vehicle){  \n  return {thrustLeft: 9.81/2+.001, thrustRight: 9.81/2-0.001};\n};";
	this.sampleSolution = "function attitude_control(theta_ref, thrust_ref, vehicle){\n  var P = theta_ref-vehicle.theta;\n  var kP = 100;\n  var kD = 20;\n  var y = kP * P - kD * vehicle.dtheta;  \n  return {thrustLeft: thrust_ref/2+y, thrustRight: thrust_ref/2-y};\n}\n\nfunction acceleration_control(ax_ref, ay_ref, vehicle){\n  ay_ref += 9.81;\n  var theta_ref = Math.atan2(ax_ref, ay_ref);\n  var thrust_ref = Math.sqrt(1e-3 + ax_ref*ax_ref + ay_ref*ay_ref);\n  return attitude_control(theta_ref, thrust_ref, vehicle);\n}\n\nvar waypoint_idx = 0;\nfunction controlFunction(vehicle){ \n  var waypoints = [\n    {x: -2, y: 0},\n    {x: -1, y: 0},\n    {x: -1, y: 1.6},\n    {x: 0, y: 1.8},\n    {x: 0, y: 0},\n  ];  \n  var p = waypoints[waypoint_idx];\n  if(Math.abs(p.x-vehicle.x) < 0.4 && Math.abs(p.y-vehicle.y) < 0.4)\n    waypoint_idx = Math.min(waypoints.length-1,waypoint_idx+1);\n  var p = waypoints[waypoint_idx];  \n  var kP = 3;\n  var kD = 2.5;\n  return acceleration_control(-kD*vehicle.dx+kP*(-vehicle.x+p.x), -kD*vehicle.dy+kP*(-vehicle.y+p.y), vehicle);  \n};";
	this.description = "Same rules as in the intro. Plus, don't touch the walls!<br/><br/>Hint: This may be useful: <pre>[{x:-2,y:0},{x:-1,y:0},{x:-1,y:2},{x:0,y:2},{x:0,y:0}]</pre>";
	ImageDataCache.load('img/multirotor_lowres.png');
	this.model = new Models.Multirotor({imgURL:'img/multirotor_lowres.png',	theta: 0,dtheta: 0,x: -2,dx: 0,y: 1,dy: 0});
}


Levels.MultirotorObstacles.prototype.levelComplete = function(){
	return Math.abs(this.model.x) < 0.01
		&& Math.abs(this.model.y) < 0.01
		&& Math.abs(this.model.dx) < 0.01
		&& Math.abs(this.model.dy) < 0.01
		&& Math.abs(this.model.theta) < 0.01
		&& Math.abs(this.model.dtheta) < 0.01;
}

Levels.MultirotorObstacles.prototype.levelFailed = function(){
	return (Math.abs(this.model.x+1.5) < 0.1 && this.model.y > 0.8)
		|| (Math.abs(this.model.x+0.5) < 0.1 && this.model.y < 1.2);
}

Levels.MultirotorObstacles.prototype.simulate = function (dt, controlFunc)
{ this.model = this.model.simulate (dt, controlFunc); }

Levels.MultirotorObstacles.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.MultirotorObstacles.prototype.draw = function(ctx, canvas){
	resetCanvas(ctx,canvas);
	ctx.scale(2,2);
	ctx.translate(1,-1);
	ctx.fillStyle="#88ff88";
	var s = this.model.Length;
	ctx.fillRect(-2*s,-.8*s,4*s,1.6*s);


	ctx.fillStyle="#883300";
	var d = 0.1;
	ctx.fillRect(-1.5-d,.5-d,2*d,20);
	ctx.fillRect(-0.5-d,1.5+d-20,2*d,20);

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

Levels.MultirotorObstacles.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.RocketLandingMulti = function()
{
	this.name = "RocketLandingMulti";
	this.title = "Multiple Rocket Landing";
	this.boilerPlateCode = "function controlFunction(rocket)\n{\n  return {throttle:1,gimbalAngle:-0.2};\n}";
	this.sampleSolution = "function controlFunction(rocket)\n{\n  // Horizontal position control\n  var x_target = 0.0;\n  var dx_target = 0.2 * (x_target - rocket.x);\n  if(Math.abs(x_target - rocket.x) < 20.0) dx_target = 0.0;\n  var theta_target = 0.05 * (dx_target - rocket.dx);\n  \n  // Pitch control with limits on angle and angular rate\n  theta_target = Math.max(-0.6, Math.min(0.6, theta_target));\n  var dtheta_target = 1.0 * (theta_target - rocket.theta);\n  dtheta_target = Math.max(-1.0, Math.min(1.0, dtheta_target));\n  var gimbalAngle = 30.0 * (rocket.dtheta - dtheta_target);\n  \n  // Vertical speed profile for constant acceleration landing\n  var dy_target = -Math.sqrt(10.0 * Math.max(1e-6, rocket.y - 25));\n  \n  // Maintain height until positioned over the landing pad\n  if(Math.abs(rocket.x) > 35.0 || Math.abs(rocket.dx) > 12.0) dy_target = 0.5;\n  \n  // Vertical speed control\n  var throttle = 0.5 + 1.0 * (dy_target - rocket.dy);\n  \n  // Set high throttle while spinning to guarantee control authority\n  if(Math.abs(rocket.theta) > 0.6 || Math.abs(rocket.dtheta) > 0.5) throttle = 0.9;\n  throttle = Math.max(0.25, throttle);\n  \n  return {throttle:throttle, gimbalAngle:gimbalAngle};\n}";
	this.description = "Now there are multiple rockets. The point of this level is to see if the same controller can land the rocket from different initial conditions. Collision avoidance between the different rockets is not necessary. They pass through each other.";
	this.models = []; 
	this.models.push(new Models.RocketLanding({TWR: 2,theta: 0,dtheta: -0.1,Length: 40,Width: 5,x: 100,dx: 20,y: 300,dy: -10,T: 0}));
	this.models.push(new Models.RocketLanding({TWR: 2,theta: 0,dtheta: 0,   Length: 40,Width: 5,x: -180,dx: 50,y: 60,dy: 0,T: 0}));
	this.models.push(new Models.RocketLanding({TWR: 2,theta: 3.14,dtheta: -2,   Length: 40,Width: 5,x: -180,dx: 0,y: 300,dy: 0,T: 0}));
}


Levels.RocketLandingMulti.prototype.levelComplete = function(){return this.models.every(function(m){return m.landed();});}

Levels.RocketLandingMulti.prototype.levelFailed = function(){return this.models.some(function(m){return m.crashed();});}

Levels.RocketLandingMulti.prototype.simulate = function (dt, controlFunc)
{
	for (var i = 0; i < this.models.length; i++)
		this.models[i] = this.models[i].simulate (dt, controlFunc);
}

Levels.RocketLandingMulti.prototype.getSimulationTime = function()	{return this.models[0].T;}

Levels.RocketLandingMulti.prototype.draw = function (ctx, canvas)
{
	// clear canvas
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	ctx.translate(canvas.width/2,0.95*canvas.height);
	ctx.scale(2,-2);

	for (var i = 0; i < this.models.length; i++){
		this.models[i].drawRocket(ctx, canvas, i);
		this.models[i].drawGround(ctx, canvas);
	}
	
	if(this.levelFailed())
	{
		ctx.save();
		ctx.scale(1,-1);
		ctx.font="10px Verdana";
		ctx.textAlign="center"; 
		ctx.fillStyle="#990000";
		ctx.fillText("CRASHED!",0,-80);
		ctx.restore();
	}
}

Levels.RocketLandingMulti.prototype.infoText = function(ctx, canvas){
	var s = '';
	for (var i = 0; i < this.models.length; i++) {
		if (i!=0) s+="\n";
		s += "Rocket #" + i + "\n";
		s += this.models[i].infoText();
	}
	return s;
}
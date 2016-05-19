'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.RocketLandingMulti = function()
{
	this.name = "RocketLandingMulti";
	this.title = "Multiple Rocket Landing";
	this.boilerPlateCode = "function controlFunction(rocket)\n{\n  return {throttle:1,gimbalAngle:-0.2};\n}";
	this.sampleSolution = "function limit_to(lower,upper,x){ return Math.max(lower, Math.min(upper, x)); }\n\nfunction controlFunction(rocket)\n{\n  rocket = rocket.simulate(1,function(){return {throttle:.5,gimbalAngle:0};});\n  var a=0;\n  var t=.5;\n  var x = Math.max(0,Math.abs(rocket.x)-20) * Math.sign(rocket.x);\n  var targetAngle = -0.02*(x + 0.5*(Math.abs(rocket.dx)+1)*rocket.dx);\n  a += 30*rocket.dtheta;\n  a += 15*(rocket.theta-limit_to(-1,1,targetAngle));\n  t -= limit_to(0.06,0.1,Math.abs(x))*rocket.dy;\n  var y_ref = 50 - 29 * limit_to(0,1,1 - 0.5*Math.abs(rocket.dx) - 10*Math.abs(rocket.theta));\n  t += limit_to(-.5,.5,1e-1*(y_ref-rocket.y));\n  return {throttle:t,gimbalAngle:a};\n}";
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
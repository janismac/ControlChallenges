if (typeof Models == 'undefined') Models = {};

Models.RocketLanding = function()
{
	this.TWR = 2;
	this.throttle = 0.49;
	this.g = 9.81;
	this.theta = 0;
	this.dtheta = 0;
	this.gimbalAngle = 0;
	this.L = 40;
	this.x = 0;
	this.dx = 0;
	this.y = 0;
	this.dy = 0;
	this.T = 0;
	this.controlFunction = function(){return {throttle:0,gimbalAngle:0};}
}

Models.RocketLanding.prototype.simulate = function (dt)
{
	var input = this.controlFunction(this); // call user controller
	this.throttle = Math.max(0,Math.min(1,input.throttle)); // input limits
	this.gimbalAngle = Math.max(-.2,Math.min(.2,input.gimbalAngle));
	var state = [this.x, this.dx, this.y, this.dy, this.theta, this.dtheta]; // state vector
	var _this = this; // closure
	var soln = numeric.dopri(0,dt,state,function(t,x){ return Models.RocketLanding.ode(_this,x); },1e-4).at(dt); // numerical integration
	this.x = soln[0]; // extract new state
	this.dx = soln[1];
	this.y = soln[2];
	this.dy = soln[3];
	this.theta = soln[4];
	this.dtheta = soln[5];
	this.T+=dt; // count time
}

Models.RocketLanding.ode = function (_this, x)
{
	var currentTWR = _this.TWR * _this.throttle;
	return[
		x[1],
		_this.g * currentTWR * Math.sin(x[4]+_this.gimbalAngle),
		x[3],
		_this.g * (currentTWR * Math.cos(x[4]+_this.gimbalAngle)-1),
		x[5],
		_this.g * currentTWR * 6 / _this.L * Math.sin(_this.gimbalAngle) 
	];
}


Models.RocketLanding.prototype.draw = function (ctx)
{
	/*ctx.setTransform(1,0,0,1,0,0);
	ctx.translate(canvas.width/2,canvas.height/2);
	ctx.scale(150,-150);*/
	
}

Models.RocketLanding.prototype.setInput = function(f){this.F = f;}

Models.RocketLanding.prototype.infoText = function ()
{
	// return  "/* Horizontal position       */ pendulum.x      = " + round(this.x,2)
		// + "\n/* Horizontal velocity       */ pendulum.dx     = " + round(this.dx,2)
		// + "\n/* Angle from vertical (rad) */ pendulum.theta  = " + round(this.theta,2)
		// + "\n/* Angular velocity (rad/s)  */ pendulum.dtheta = " + round(this.dtheta,2)
		// + "\n/* Simulation time (s)       */ pendulum.T      = " + round(this.T,2);	
}

if (typeof Models == 'undefined') Models = {};

Models.RocketLanding = function()
{
	this.TWR = 2;
	this.throttle = 1;
	this.g = 9.81;
	this.theta = 0;
	this.dtheta = 0;
	this.gimbalAngle = -0.1;
	this.L = 40;
	this.W = 2;
	this.x = 0;
	this.dx = 0;
	this.y = 0;
	this.dy = 0;
	this.crashed = false;
	this.T = 0;
	this.controlFunction = function(){return {throttle:0,gimbalAngle:0};}
}

Models.RocketLanding.prototype.setControlFunction = function (f)
{
	this.controlFunction = f;
}

Models.RocketLanding.prototype.simulate = function (dt)
{
	if(!this.crashed)
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
		if(this.y-this.L/2<0) this.crashed = true;
	}
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
		-_this.g * currentTWR * 6 / _this.L * Math.sin(_this.gimbalAngle) 
	];
}


Models.RocketLanding.prototype.draw = function (ctx)
{
	// clear canvas
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	ctx.translate(canvas.width/2,0.8*canvas.height);
	ctx.scale(2,-2);
	
	var L = this.L;
	var W = this.W;
	

	// draw rocket
	ctx.save();
	ctx.translate(this.x,this.y);
	ctx.rotate(-this.theta);
	
	ctx.lineWidth=L/40;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	
	// exhaust
	ctx.strokeStyle="#FF0000";
	ctx.beginPath();
	ctx.moveTo(W/4,-L/2);
	ctx.lineTo(-2*W*this.throttle*Math.sin(this.gimbalAngle),-L/2-2*W*this.throttle*Math.cos(this.gimbalAngle));
	ctx.lineTo(-W/4,-L/2);
	ctx.stroke();
	
	// hull
	ctx.strokeStyle="#000000";
	ctx.beginPath();
	ctx.moveTo(0,L/2);
	ctx.lineTo(-W/2,L/2-W);
	ctx.lineTo(-W/2,-L/2);
	ctx.lineTo(W/2,-L/2);
	ctx.lineTo(W/2,L/2-W);
	ctx.closePath();
	ctx.stroke();
	
	// left leg
	ctx.beginPath();
	ctx.moveTo(-W/2,-L/2);
	ctx.lineTo(-1.8*W,-L/2-W);
	ctx.lineTo(-W/2,-L/2+W);
	ctx.stroke();
	
	// right leg
	ctx.beginPath();
	ctx.moveTo(W/2,-L/2);
	ctx.lineTo(1.8*W,-L/2-W);
	ctx.lineTo(W/2,-L/2+W);
	ctx.stroke();	
	
	ctx.restore();
	// end draw rocket
	
	drawLine(ctx,-10000,-1,10000,-1,2);
	
	if(this.crashed)
	{
		ctx.save();
		ctx.scale(1,-1);
		ctx.fillStyle="#ff0000";
		ctx.font="10px Verdana";
		ctx.textAlign="center"; 
		ctx.fillText("CRASHED!",0,-80);
		ctx.restore();
	}
}

Models.RocketLanding.prototype.setInput = function(f){this.F = f;}

Models.RocketLanding.prototype.infoText = function ()
{
	return  "/* Horizontal position */ rocket.x      = " + round(this.x,2)
		+ "\n/* Horizontal velocity */ rocket.dx     = " + round(this.dx,2)
		+ "\n/* Vertical position   */ rocket.y      = " + round(this.y,2)
		+ "\n/* Vertical velocity   */ rocket.dy     = " + round(this.dy,2)
		+ "\n/* Angle from vertical */ rocket.theta  = " + round(this.theta,2)
		+ "\n/* Angular velocity    */ rocket.dtheta = " + round(this.dtheta,2)
		+ "\n/* Simulation time     */ rocket.T      = " + round(this.T,2);	
}

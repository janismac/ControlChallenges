'use strict';
if (typeof Models === 'undefined') var Models = {};

Models.Multirotor = function(params)
{
	var nVars = Object.keys(this.vars).length;
	for(var i = 0; i < nVars; i++)
	{
		var key = Object.keys(this.vars)[i];
		this[key] = (typeof params[key] == 'undefined')?this.vars[key]:params[key];
	}
}

Models.Multirotor.prototype.vars = 
{
	mass: 1,
	I: 1/.12/100, // moment of inertia
	Length: .1,
	g: 9.81,
	theta: .01,
	dtheta: 0,
	thrustLeft: 0,
	thrustRight: 0,
	maxThrust: 20,
	x: 0,
	dx: 0,
	y: 0,
	dy: 0,
	T: 0,
	imgURL:'',
};

Models.Multirotor.prototype.simulate = function (dt, controlFunc)
{
	var copy = new Models.Multirotor(this);	
	var input = controlFunc(new Models.Multirotor(this)); // call user controller
	if(typeof input != 'object' || typeof input.thrustLeft != 'number' || typeof input.thrustRight != 'number') 
		throw "Error: The controlFunction must return an object: {thrustLeft:number, thrustRight:number}";

	// input limits
	copy.thrustLeft = Math.max(0,Math.min(copy.maxThrust,input.thrustLeft));
	copy.thrustRight = Math.max(0,Math.min(copy.maxThrust,input.thrustRight));

	var state = [this.x, this.dx, this.y, this.dy, this.theta, this.dtheta]; // state vector
	var soln = numeric.dopri(0,dt,state,function(t,x){ return Models.Multirotor.ode(copy,x); },1e-4).at(dt); // numerical integration
	
	copy.x = soln[0]; // extract new state
	copy.dx = soln[1];
	copy.y = soln[2];
	copy.dy = soln[3];
	copy.theta = soln[4];
	copy.dtheta = soln[5];
	copy.T = this.T + dt; // count time
	return copy;	
}

Models.Multirotor.ode = function (_this, x) {
	return[
		x[1],
		Math.sin(x[4]) / _this.mass * (_this.thrustLeft+_this.thrustRight),
		x[3],
		Math.cos(x[4]) / _this.mass * (_this.thrustLeft+_this.thrustRight) - _this.g,
		x[5],
		(_this.thrustLeft-_this.thrustRight) * _this.Length / _this.I
	];
}




Models.Multirotor.prototype.drawVehicle = function (ctx, canvas) {
	ctx.save();
	ctx.translate(this.x,this.y);
	ctx.rotate(-this.theta);
	ctx.scale(this.Length,this.Length);

	var imgData = ImageDataCache.get(this.imgURL);
	if(imgData){
		ctx.save();		
		ctx.scale(3.6/imgData.width,-3.6/imgData.width);
		ctx.translate(-imgData.width/2,-imgData.height/2);
		ctx.drawImage(imgData.image,0,0);
		ctx.restore();
	} else {
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		drawLine(ctx,-2,0,2,0,.02);
		drawLine(ctx,0,-1,0,1,.02);
	}

	// draw force vectors
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	ctx.strokeStyle="#FF0000";
	var forceScale = 0.4;
	var arrowScale = 0.2;
	if(this.thrustLeft>0){
		drawLine(ctx,-1,0.7,-1,0.7+forceScale*this.thrustLeft,.1);
		drawLine(ctx,-1,0.7+forceScale*this.thrustLeft,-1+arrowScale,-arrowScale+0.7+forceScale*this.thrustLeft,.1);
		drawLine(ctx,-1,0.7+forceScale*this.thrustLeft,-1-arrowScale,-arrowScale+0.7+forceScale*this.thrustLeft,.1);
	}

	if(this.thrustRight>0){
		drawLine(ctx,1,0.7,1,0.7+forceScale*this.thrustRight,.1);
		drawLine(ctx,1,0.7+forceScale*this.thrustRight,1+arrowScale,-arrowScale+0.7+forceScale*this.thrustRight,.1);
		drawLine(ctx,1,0.7+forceScale*this.thrustRight,1-arrowScale,-arrowScale+0.7+forceScale*this.thrustRight,.1);
	}


	ctx.restore();
}

Models.Multirotor.prototype.infoText = function ()
{
	return  "/* Horizontal position */ rocket.x      = " + round(this.x,2)
		+ "\n/* Horizontal velocity */ rocket.dx     = " + round(this.dx,2)
		+ "\n/* Vertical position   */ rocket.y      = " + round(this.y,2)
		+ "\n/* Vertical velocity   */ rocket.dy     = " + round(this.dy,2)
		+ "\n/* Angle from vertical */ rocket.theta  = " + round(this.theta,2)
		+ "\n/* Angular velocity    */ rocket.dtheta = " + round(this.dtheta,2)
		+ "\n/* Simulation time     */ rocket.T      = " + round(this.T,2);	
}

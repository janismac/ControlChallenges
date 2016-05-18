'use strict';
if (typeof Models === 'undefined') var Models = {};

Models.CruiseControl = function(params)
{
	var nVars = Object.keys(this.vars).length;
	for(var i = 0; i < nVars; i++)
	{
		var key = Object.keys(this.vars)[i];
		this[key] = (typeof params[key] == 'undefined')?this.vars[key]:params[key];
	}
}

Models.CruiseControl.prototype.vars = 
{
	maxAcceleration: 12,
	throttle: 0,
	targetSpeed: 70,
	speed: 30,
	speedErrorTolerance: .5,
	speedHoldTimer: 0,
	throttle: 0,
	drag: 5e-4,
	g: 9.81,
	carImg:'',
	speedometerImg:'',
	inclination: 5./180*Math.PI,
	T: 0,
};

Models.CruiseControl.prototype.simulate = function (dt, controlFunc)
{
	var copy = new Models.CruiseControl(this);	
	var input = controlFunc(new Models.CruiseControl(this)); // call user controller
	if(typeof input != 'number') 
		throw "Error: The controlFunction must return a number.";

	// input limit
	copy.throttle = Math.max(-1,Math.min(1,input));

	var state = [this.speed];
	var soln = numeric.dopri(0,dt,state,function(t,x){ return Models.CruiseControl.ode(copy,x); },1e-4).at(dt); // numerical integration
	
	copy.speed = soln[0]; // extract new state
	copy.T = this.T + dt; // count time

	if(Math.abs(copy.speed-copy.targetSpeed) < copy.speedErrorTolerance)
		copy.speedHoldTimer += dt;
	else
		copy.speedHoldTimer = 0;

	return copy;	
}

Models.CruiseControl.ode = function (_this, x) {
	return[_this.throttle * _this.maxAcceleration - _this.drag * x[0] * Math.abs(x[0]) - Math.sin(_this.inclination) * _this.g];
}


Models.CruiseControl.prototype.draw = function (ctx, canvas) {
	resetCanvas(ctx,canvas);
	this.drawSpeedometer(ctx, canvas);
	this.drawInclination(ctx, canvas);
}

Models.CruiseControl.prototype.drawInclination = function (ctx, canvas) {
	ctx.save();
	ctx.translate(-1.8,0);
	ctx.rotate(this.inclination);

	var imgData = ImageDataCache.get(this.carImg);
	if(imgData){
		ctx.save();		
		ctx.scale(3.2/imgData.width,-3.2/imgData.width);
		ctx.translate(-imgData.width/2,-imgData.height/2);		
		ctx.drawImage(imgData.image,0,0);
		ctx.restore();
	}
	ctx.lineCap = 'round';
	ctx.strokeStyle = '#ff0000';
	var t = 1.3*this.throttle;
	var d = .1;
	var s = 2*Math.sign(this.throttle);
	drawLine(ctx,t,0,0,0,0.04);
	drawLine(ctx,t,0,t-s*d,-d,0.04);
	drawLine(ctx,t,0,t-s*d,d,0.04);

	ctx.restore();
}

Models.CruiseControl.prototype.drawSpeedometer = function (ctx, canvas) {
	ctx.save();
	ctx.translate(1.8,0);

	var speedometerimgData = ImageDataCache.get(this.speedometerImg);
	if(speedometerimgData){
		ctx.save();		
		ctx.scale(3.2/speedometerimgData.width,-3.2/speedometerimgData.width);
		ctx.translate(-speedometerimgData.width/2,-speedometerimgData.height/2);
		ctx.drawImage(speedometerimgData.image,0,0);
		ctx.restore();
	}
	ctx.lineCap = 'round';

	// target speed indicator
	for(var i=0;i<1.2;i+=0.25){
		ctx.strokeStyle = '#ff00ff';
		var angle = Math.PI*(7/6-Math.abs(this.targetSpeed/120));
		var s = Math.sin(angle);
		var c = Math.cos(angle);
		drawLine(ctx,c*i,s*i,c*(i+.1),s*(i+.1),0.02);
	}

	// speed indicator
	ctx.strokeStyle = '#ff0000';
	var angle = Math.PI*(7/6-Math.abs(this.speed/120));
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	drawLine(ctx,c,s,0,0,0.05);

	// reverse indicator
	if(this.speed<0) {
		ctx.save();
		ctx.translate(0,-1);
		ctx.scale(0.05,-0.05);
		ctx.font="10px Verdana";
		ctx.textAlign="center"; 
		ctx.fillStyle="#000000";
		ctx.fillText("R",0,0);
		ctx.restore();
	}


	ctx.restore();
}

Models.CruiseControl.prototype.infoText = function ()
{
	return  "vehicle.speed          = " + round(this.speed,2)
	    + "\nvehicle.targetSpeed    = " + round(this.targetSpeed,2)
	    + "\nvehicle.inclination    = " + round(this.inclination,2)
	    + "\nvehicle.speedHoldTimer = " + round(this.speedHoldTimer,2)
	    + "\nvehicle.T              = " + round(this.T,2);
}
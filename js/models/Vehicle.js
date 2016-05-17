'use strict';
if (typeof Models === 'undefined') var Models = {};

Models.Vehicle = function(params)
{
	var nVars = Object.keys(this.vars).length;
	for(var i = 0; i < nVars; i++)
	{
		var key = Object.keys(this.vars)[i];
		this[key] = (typeof params[key] == 'undefined')?this.vars[key]:params[key];
	}

	// LIDAR points
	this.lidarPoints = [];
	for (var i = 0; i < this.lidarDirections.length; i++) {
		var lidarPoint = this.lineSearch(this.x,this.y,this.heading + this.lidarDirections[i]);
		lidarPoint.direction = this.lidarDirections[i];
		this.lidarPoints.push(lidarPoint);
	};
}

Models.Vehicle.prototype.vars = 
{
	x: 16,
	y: 9,
	speed: 20,
	heading: 0,
	acceleration: 0,
	steering: 0,
	length: 4.4,
	width: 2.2,
	Lf: 1.2,
	Lr: 1.4,
	lidarDirections: [1,.5,0,-.5,-1],
	trackImgURL: '',
	pixelSize: 0.1,
	lateralAccelerationLimit: 10,
	accelerationLimit: 7,
	drag: 1e-3,
	steeringLimit: NaN,
	constantSpeed: true,
	isObstacle: function(x){return x[3]<100;},
	T: 0,
};

Models.Vehicle.prototype.simulate = function (dt, controlFunc) {	
	var copy = new Models.Vehicle(this);

	var imgData = ImageDataCache.get(this.trackImgURL);

	if(imgData && !this.detectCollision())
	{

		var state = [this.x, this.y, this.heading, this.speed];
		var input = controlFunc(new Models.Vehicle(this));
		copy.steeringLimit = Math.atan(copy.lateralAccelerationLimit*(copy.Lf+copy.Lr)/(1e-6+copy.speed*copy.speed));

		if(this.constantSpeed)
		{
			copy.acceleration = 0;
			if(typeof input !== 'number') throw "Error: The controlFunction must return a number.";
			copy.steering = Math.max(-copy.steeringLimit,Math.min(copy.steeringLimit,input));
		}
		else
		{
			if(typeof input !== 'object' || typeof input.steering !== 'number' || typeof input.acceleration !== 'number') 
				throw "Error: The controlFunction must return an object: {steering: number, acceleration: number}";			
			copy.steering = Math.max(-copy.steeringLimit,Math.min(copy.steeringLimit,input.steering));
			copy.acceleration = Math.max(-this.accelerationLimit,Math.min(this.accelerationLimit,input.acceleration));
		}

		var soln = numeric.dopri(0,dt,state,function(t,x){ return Models.Vehicle.ode(copy,x); },1e-4).at(dt);	
		
		copy.x = soln[0];
		copy.y = soln[1];
		copy.heading = soln[2];
		copy.speed = soln[3];
		copy.T = this.T + dt;
	}

	return copy;	
}

Models.Vehicle.ode = function (_this, x) {
	var s = Math.sin(x[2]);
	var c = Math.cos(x[2]);
	var v = x[3];
	var Lr = _this.Lr;
	var Lwb = _this.Lf+_this.Lr;
	var R = Lr/Lwb*Math.tan(_this.steering);
	var norm = Math.sqrt((-R*s+c)*(-R*s+c)+(R*c+s)*(R*c+s));
	if(_this.constantSpeed)
		return [v*(-R*s+c)/norm,v*(R*c+s)/norm,Math.tan(_this.steering)*v/Lwb,0];
	else
		return [v*(-R*s+c)/norm,v*(R*c+s)/norm,Math.tan(_this.steering)*v/Lwb,_this.acceleration-_this.drag*v*Math.abs(v)];
}

Models.Vehicle.prototype.detectCollision = function (imgData) {
	var imgData = ImageDataCache.get(this.trackImgURL);

	if(imgData)
	{
		var L = this.length;
		var W = this.width;
		var s = Math.sin(this.heading);
		var c = Math.cos(this.heading);
		// points relative to the center that form a convex hull.
		var outerPoints = [{x:L/2,y:W/2},{x:-L/2,y:W/2},{x:L/2,y:-W/2},{x:-L/2,y:-W/2}];
		for (var i = 0; i < outerPoints.length; i++)
		{
			var p = outerPoints[i];
			var hull_x = p.x*c-p.y*s+this.x;
			var hull_y = p.x*s+p.y*c+this.y;
			if(this.coordIsObstacle(hull_x/this.pixelSize,hull_y/this.pixelSize,imgData)) return true;
		}
		return false;
	} else return false;
}

Models.Vehicle.prototype.draw = function (ctx, canvas) {
	var imgData = ImageDataCache.get(this.trackImgURL);

	if(imgData)
	{
		ctx.setTransform(1,0,0,1,0,0);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		
		ctx.translate(0,canvas.height);
		var scale = Math.min(canvas.width / imgData.width,canvas.height / imgData.height);
		ctx.scale(scale,-scale);

		ctx.drawImage(imgData.image,0,0);

		ctx.scale(1/this.pixelSize,1/this.pixelSize);

		for (var i = 0; i < this.lidarPoints.length; i++) {
			ctx.strokeStyle = '#77ff00';
			drawLine(ctx,this.x,this.y,this.lidarPoints[i].x,this.lidarPoints[i].y,0.1*this.width);			
		};


		ctx.translate(this.x,this.y);
		ctx.rotate(this.heading);

		ctx.fillStyle="#ffaa00";
		ctx.fillRect(-this.length/2,-this.width/2,this.length,this.width);
	}
}


Models.Vehicle.prototype.coordIsObstacle = function(x,y,imgData) {
	x = x|0; // convert to int
	y = y|0;
	if(x<0 || y<0 || imgData.width<=x || imgData.height<= y) return true;
	return this.isObstacle(ImageDataCache.at(this.trackImgURL, x, y));
};

Models.Vehicle.prototype.lineSearch = function(x,y,direction) {
	var imgData = ImageDataCache.get(this.trackImgURL);

	if(imgData)
	{
		x /= this.pixelSize;
		y /= this.pixelSize;
		var c = Math.cos(direction);
		var s = Math.sin(direction);
		var step = 5;
		var distance = 0;

		var currentPointIsObstacle = this.coordIsObstacle(x,y,imgData);
		if(currentPointIsObstacle) return {x:x*this.pixelSize,y:y*this.pixelSize,distance:distance*this.pixelSize};

		for (var i = 0; i < 10000; i++) { // This loop should always terminate early with return. Iteration limit for safety.
			var x2 = x + c*distance;
			var y2 = y + s*distance;

			var nextPointIsObstacle = this.coordIsObstacle(x2,y2,imgData);

			if(currentPointIsObstacle != nextPointIsObstacle) step *= -.5;

			if(Math.abs(step) < 1) return {x:x2*this.pixelSize,y:y2*this.pixelSize,distance:distance*this.pixelSize};
			if(distance < 0) return {x:x*this.pixelSize,y:y*this.pixelSize,distance:distance*this.pixelSize};

			currentPointIsObstacle = nextPointIsObstacle;
			distance += step;
		}
		alert('Oops, this should never happen. Ask a programmer to fix it. lineSearch() did not converge.');
	}
	else return {x:x,y:y,distance:0};
};

Models.Vehicle.prototype.infoText = function ()
{
	var str =   "/* Position       */ vehicle.x             = " + round(this.x,2)
			+ "\n                     vehicle.y             = " + round(this.y,2)
			+ "\n/* Speed          */ vehicle.speed         = " + round(this.speed,2)
			+ "\n/* Acceleration   */ vehicle.acceleration  = " + round(this.acceleration,2)
			+ "\n/* Heading        */ vehicle.heading       = " + round(this.heading,2)
			+ "\n/* Steering       */ vehicle.steering      = " + round(this.steering,2)
			+ "\n/* Steering Limit */ vehicle.steeringLimit = " + round(this.steeringLimit,2)
			+ "\n/* LIDAR sensors */";

	for (var i = 0; i < this.lidarPoints.length; i++) {
		str += "\nvehicle.lidarPoints["+i+"] = {";
		//str += "x: " + padSpaces(round(this.lidarPoints[i].x,2),8) + ", ";
		//str += "y: " + padSpaces(round(this.lidarPoints[i].y,2),8) + ", ";
		str += "distance: " + padSpaces(round(this.lidarPoints[i].distance,2),8) + ", ";
		str += "direction: " + padSpaces(round(this.lidarPoints[i].direction,2),8);
		str += "}";
	};

	str += "\n/* Simulation time */ vehicle.T  = " + round(this.T,2);

	return str;
}
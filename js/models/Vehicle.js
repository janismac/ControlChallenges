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
}

Models.Vehicle.prototype.vars = 
{
	x: 80,
	y: 75,
	speed: 1,
	heading: 0,
	acceleration: 0,
	length: 4,
	width: 2,
	Lf: 1,
	Lr: 1,
	trackImgURL: '',
	pixelSize: 0.5,
	isObstacle: function(x){return x[0]<100;},
	T: 0,
};

Models.Vehicle.prototype.simulate = function (dt, controlFunc)
{
	var copy = new Models.Vehicle(this);
	/*var state = [this.x, this.dx];
	copy.F = controlFunc(new Models.Vehicle(this));
	if(typeof copy.F != 'number' || isNaN(copy.F)) throw "Error: The controlFunction must return a number.";
	var soln = numeric.dopri(0,dt,state,function(t,x){ return Models.Vehicle.ode(copy,x); },1e-4).at(dt);	
	
	copy.x = soln[0];
	copy.dx = soln[1];
	copy.T = this.T + dt;*/
	copy.heading += 0.01;
	return copy;	
}

Models.Vehicle.ode = function (_this, x)
{
	return [];
}


Models.Vehicle.prototype.draw = function (ctx, canvas)
{
	var imgData = ImageDataCache.get(this.trackImgURL);

	if(imgData)
	{
		// clear canvas
		ctx.setTransform(1,0,0,1,0,0);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		
		ctx.translate(0,canvas.height);
		var scale = Math.min(canvas.width / imgData.width,canvas.height / imgData.height);
		ctx.scale(scale,-scale);

		ctx.drawImage(imgData.image,0,0);

		ctx.scale(1/this.pixelSize,1/this.pixelSize);

		var lineEnd = this.lineSearch(this.x,this.y,this.heading);

		ctx.strokeStyle = '#ff0000';
		drawLine(ctx,this.x,this.y,lineEnd.x,lineEnd.y,3);
	}

}

Models.Vehicle.prototype.lineSearch = function(x,y,direction){
	var imgData = ImageDataCache.get(this.trackImgURL);

	if(imgData)
	{
		x /= this.pixelSize;
		y /= this.pixelSize;
		var c = Math.cos(direction);
		var s = Math.sin(direction);
		var step = 5;
		var distance = 0;
		var coordIsObstacle = (function(x,y){
			x = x|0; // convert to int
			y = y|0;
			if(x<0 || y<0 || imgData.width<=x || imgData.height<= y) return true;
			return this.isObstacle(ImageDataCache.at(this.trackImgURL, x, y));
		}).bind(this);

		var currentPointIsObstacle = coordIsObstacle(x,y);
		if(currentPointIsObstacle) return {x:x*this.pixelSize,y:y*this.pixelSize};

		for (var i = 0; i < 10000; i++) { // This loop should always terminate early with return. Iteration limit for safety.
			var x2 = x + c*distance;
			var y2 = y + s*distance;

			var nextPointIsObstacle = coordIsObstacle(x2,y2);

			if(currentPointIsObstacle != nextPointIsObstacle) step *= -.5;

			if(Math.abs(step) < 1) return {x:x2*this.pixelSize,y:y2*this.pixelSize};

			currentPointIsObstacle = nextPointIsObstacle;
			distance += step;
		}
		alert('Oops, this should never happen. Ask a programmer to fix it. lineSearch() did not converge.');
	}
};

Models.Vehicle.prototype.infoText = function ()
{
	return "TODO";//  "/* Position        */ block.x  = " + round(this.x,2)
		//+ "\n/* Velocity        */ block.dx = " + round(this.dx,2)
		//+ "\n/* Simulation time */ block.T  = " + round(this.T,2);	
}

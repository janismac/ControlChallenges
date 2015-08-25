'use strict';
if (typeof Models == 'undefined') var Models = {};

Models.BlockOnSlope = function(params)
{
	var nVars = Object.keys(this.vars).length;
	for(var i = 0; i < nVars; i++)
	{
		var key = Object.keys(this.vars)[i];
		this[key] = (typeof params[key] == 'undefined')?this.vars[key]:params[key];
	}
}

Models.BlockOnSlope.prototype.vars = 
{
	g: 9.81,
	x: 0,
	dx: 0,
	slope: 1,
	F: 0,
	friction: 0,
	T: 0,
};

Models.BlockOnSlope.prototype.simulate = function (dt, controlFunc)
{
	var copy = new Models.BlockOnSlope(this);
	var state = [this.x, this.dx];
	copy.F = controlFunc(new Models.BlockOnSlope(this));
	if(typeof copy.F != 'number' || isNaN(copy.F)) throw "Error: The controlFunction must return a number.";
	var soln = numeric.dopri(0,dt,state,function(t,x){ return Models.BlockOnSlope.ode(copy,x); },1e-4).at(dt);	
	
	copy.x = soln[0];
	copy.dx = soln[1];
	copy.T = this.T + dt;
	return copy;	
}

Models.BlockOnSlope.ode = function (_this, x)
{
	return[x[1],_this.F-Math.sin(_this.slope)*_this.g-_this.friction*x[1]];
}


Models.BlockOnSlope.prototype.draw = function (ctx)
{
	// clear canvas
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	ctx.translate(canvas.width/2,canvas.height/2);
	ctx.scale(canvas.width/8.0,-canvas.width/8.0);
	ctx.rotate(this.slope);


	ctx.strokeStyle="#333366";
	drawLine(ctx,-100,-.025,100,-.025,0.05);

	var cartWidth = 0.4;
	var cartHeight = 0.7*cartWidth;

	// block
	ctx.fillStyle="#4444FF";
	ctx.fillRect(this.x-cartWidth/2,0,cartWidth,cartHeight);

	// force arrow
	var forceArrow = {x1:this.x,y1:0.5*cartHeight,x2:this.x+0.1*this.F,y2:0.5*cartHeight};
	ctx.strokeStyle="#FF0000";
    ctx.lineCap = 'round';
	drawLine(ctx,forceArrow.x1,forceArrow.y1,forceArrow.x2,forceArrow.y2,1/40.0);
	drawLine(ctx,forceArrow.x2,forceArrow.y2,forceArrow.x2-Math.sign(this.F)*0.1,forceArrow.y2+0.05,1/40.0);
	drawLine(ctx,forceArrow.x2,forceArrow.y2,forceArrow.x2-Math.sign(this.F)*0.1,forceArrow.y2-0.05,1/40.0);


	// target arrow
	var forceArrow = {x1:0,y1:4.5*cartHeight,x2:0,y2:2*cartHeight};
	ctx.strokeStyle="#4444FF";
    ctx.lineCap = 'round';
	drawLine(ctx,forceArrow.x1,forceArrow.y1,forceArrow.x2,forceArrow.y2,1/30.0);
	drawLine(ctx,forceArrow.x2,forceArrow.y2,forceArrow.x2+.1,forceArrow.y2+.1);
	drawLine(ctx,forceArrow.x2,forceArrow.y2,forceArrow.x2-.1,forceArrow.y2+.1);
}

Models.BlockOnSlope.prototype.infoText = function ()
{
	return  "/* Position        */ block.x  = " + round(this.x,2)
		+ "\n/* Velocity        */ block.dx = " + round(this.dx,2)
		+ "\n/* Simulation time */ block.T  = " + round(this.T,2);	
}

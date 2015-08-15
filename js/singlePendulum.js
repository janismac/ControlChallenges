function SinglePendulum()
{
	this.m0 = 10;
	this.m1 = .5;
	this.L = 1;
	this.g = 9.81;
	this.theta = 0.2;
	this.dtheta = 0;
	this.x = 0;
	this.dx = 0;
	this.F = 0;
}

SinglePendulum.prototype.simulate = function (dt)
{
	var state = [this.x, this.dx, this.theta, this.dtheta];
	var _this = this;
	var soln = numeric.dopri(0,dt,state,function(t,x){ return SinglePendulum.ode(_this,x); },1e-4).at(dt);
	this.x = soln[0];
	this.dx = soln[1];
	this.theta = soln[2];
	this.dtheta = soln[3];
}

SinglePendulum.ode = function (_this, x)
{
	var s = Math.sin(x[2]);
	var c = Math.cos(x[2]);
	var dthetasq = x[3] * x[3];
	
	var M = [[_this.m0,0,0,0,-s],
		[0,0,_this.m1,0,s],
		[0,0,0,_this.m1,c],
		[1,_this.L*c,-1,0,0],
		[0,-_this.L*s,0,-1,0]];
	var b = [_this.F,0,-_this.m1*_this.g,s*dthetasq*_this.L,c*dthetasq*_this.L];
	var ddx = numeric.solve(M,b)
	return [x[1],ddx[0],x[3],ddx[1]];
}


SinglePendulum.prototype.draw = function (ctx)
{
	var cartWidth = 0.4*this.L;
	var cartHeight = 0.7*cartWidth;
	
	
	var tipX = this.x+this.L*Math.sin(this.theta);
	var tipY = this.L*Math.cos(this.theta)+cartHeight;
	
	
	
	// ground
	ctx.strokeStyle="#333366";
	drawLine(ctx,-100,-.025,100,-.025,0.05);
	
	// cart
	ctx.fillStyle="#4444FF";
	ctx.fillRect(this.x-cartWidth/2,0,cartWidth,cartHeight);
		
	// shaft
	ctx.strokeStyle="#AAAAFF";
    ctx.lineCap = 'round';
	drawLine(ctx,this.x,cartHeight,tipX,tipY,this.L/20.0);
		
	// tip-mass
	ctx.beginPath();
	ctx.arc(tipX, tipY, this.L/7, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#4444FF';
	ctx.fill();
	
	// force arrow
	var forceArrow = {x1:this.x,y1:0.5*cartHeight,x2:this.x+0.1*this.F,y2:0.5*cartHeight};
	ctx.strokeStyle="#FF0000";
    ctx.lineCap = 'round';	
	drawLine(ctx,forceArrow.x1,forceArrow.y1,forceArrow.x2,forceArrow.y2,this.L/40.0);
	drawLine(ctx,forceArrow.x2,forceArrow.y2,forceArrow.x2-Math.sign(this.F)*0.1,forceArrow.y2+0.05,this.L/40.0);
	drawLine(ctx,forceArrow.x2,forceArrow.y2,forceArrow.x2-Math.sign(this.F)*0.1,forceArrow.y2-0.05,this.L/40.0);
	
	
}



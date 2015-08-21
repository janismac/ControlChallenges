'use strict';
if (typeof Models == 'undefined') var Models = {};

Models.DoublePendulum = function(params)
{
	var nVars = Object.keys(this.vars).length;
	for(var i = 0; i < nVars; i++)
	{
		var key = Object.keys(this.vars)[i];
		this[key] = (typeof params[key] == 'undefined')?this.vars[key]:params[key];
	}
}

Models.DoublePendulum.prototype.vars = 
{
	m0: 10,
	m1: 2,
	m2: 4,
	L1: 0.618,
	L2: 1,
	g: 2,
	theta1: 0.001,
	dtheta1: 0.001,
	theta2: 0.001,
	dtheta2: 0.001,
	x: -1,
	dx: 0,
	F: 0,
	T: 0
};

Models.DoublePendulum.prototype.simulate = function (dt, controlFunc)
{
	var copy = new Models.DoublePendulum(this);
	var state = [this.x, this.dx, this.theta1, this.dtheta1, this.theta2, this.dtheta2];
	copy.F = controlFunc(new Models.DoublePendulum(this));
	var soln = numeric.dopri(0,dt,state,function(t,x){ return Models.DoublePendulum.ode(copy,x); },1e-4).at(dt);	
	
	copy.x = soln[0];
	copy.dx = soln[1];
	copy.theta1 = soln[2];
	copy.dtheta1 = soln[3];
	copy.theta2 = soln[4];
	copy.dtheta2 = soln[5];
	copy.T = this.T + dt;
	return copy;
}

Models.DoublePendulum.ode = function (_this, x)
{
	var s1 = Math.sin(x[2]);
	var c1 = Math.cos(x[2]);
	var s2 = Math.sin(x[4]);
	var c2 = Math.cos(x[4]);
	var dthetasq1 = x[3] * x[3];
	var dthetasq2 = x[5] * x[5];
	

	// colns:    ddx0    ddtheta1    ddtheta2        ddx1        ddx2        ddy1        ddy2          T1          T2
	var M =[[_this.m0,          0,          0,          0,          0,          0,          0,        -s1,          0],
			[       0,          0,          0,   _this.m1,          0,          0,          0,         s1,        -s2],
			[       0,          0,          0,          0,   _this.m2,          0,          0,          0,         s2],
			[       0,          0,          0,          0,          0,   _this.m1,          0,         c1,        -c2],
			[       0,          0,          0,          0,          0,          0,   _this.m2,          0,         c2],
			[      -1,-_this.L1*c1,         0,          1,          0,          0,          0,          0,          0],
			[       0,          0,-_this.L2*c2,        -1,          1,          0,          0,          0,          0],
			[       0,_this.L1*s1,          0,          0,          0,          1,          0,          0,          0],
			[       0,          0,_this.L2*s2,          0,          0,         -1,          1,          0,          0],];

	var b = [
		_this.F,
		0,
		0,
		-_this.m1*_this.g,
		-_this.m2*_this.g,
		-_this.L1*s1*dthetasq1,
		-_this.L2*s2*dthetasq2,
		-_this.L1*c1*dthetasq1,
		-_this.L2*c2*dthetasq2
	];
	var ddx = numeric.solve(M,b);

	return [x[1],ddx[0],x[3],ddx[1],x[5],ddx[2]];
}


Models.DoublePendulum.prototype.draw = function (ctx)
{
	var L = this.L1 + this.L2;
	// clear canvas
	context.setTransform(1,0,0,1,0,0);
	context.clearRect(0,0,canvas.width,canvas.height);
	
	ctx.setTransform(1,0,0,1,0,0);
	ctx.translate(canvas.width/2,canvas.height/2);
	ctx.scale(canvas.width/8.0,-canvas.width/8.0);
	ctx.translate(0,-L);
	
	var cartWidth = 0.2*L;
	var cartHeight = 0.7*cartWidth;
	
	var tipX = this.x+this.L1*Math.sin(this.theta1);
	var tipY = this.L1*Math.cos(this.theta1)+cartHeight;
	var tip2X = this.L2*Math.sin(this.theta2) + tipX;
	var tip2Y = this.L2*Math.cos(this.theta2) + tipY;
	
	// ground
	ctx.strokeStyle="#333366";
	drawLine(ctx,-100,-.025,100,-.025,0.05);
	
	// cart
	ctx.fillStyle="#4444FF";
	ctx.fillRect(this.x-cartWidth/2,0,cartWidth,cartHeight);
		
	// shaft
	ctx.strokeStyle="#AAAAFF";
    ctx.lineCap = 'round';
	drawLine(ctx,this.x,cartHeight,tipX,tipY,L/20.0);
	drawLine(ctx,tipX,tipY,tip2X,tip2Y,L/20.0);
		
	// tip-mass
	ctx.beginPath();
	ctx.arc(tipX, tipY, 0.1, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#4444FF';
	ctx.fill();
	ctx.beginPath();
	ctx.arc(tip2X, tip2Y, 0.1, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#4444FF';
	ctx.fill();
	
	// force arrow
	var forceArrow = {x1:this.x,y1:0.5*cartHeight,x2:this.x+0.1*this.F,y2:0.5*cartHeight};
	ctx.strokeStyle="#FF0000";
    ctx.lineCap = 'round';	
	drawLine(ctx,forceArrow.x1,forceArrow.y1,forceArrow.x2,forceArrow.y2,L/40.0);
	drawLine(ctx,forceArrow.x2,forceArrow.y2,forceArrow.x2-Math.sign(this.F)*0.1,forceArrow.y2+0.05,L/40.0);
	drawLine(ctx,forceArrow.x2,forceArrow.y2,forceArrow.x2-Math.sign(this.F)*0.1,forceArrow.y2-0.05,L/40.0);
}

Models.DoublePendulum.prototype.infoText = function ()
{
	return  "/* Horizontal position         */ pendulum.x       = " + round(this.x,2)
		+ "\n/* Horizontal velocity         */ pendulum.dx      = " + round(this.dx,2)
		+ "\n/* Angle from vertical (lower) */ pendulum.theta1  = " + round(this.theta1,2)
		+ "\n/* Angular velocity    (lower) */ pendulum.dtheta1 = " + round(this.dtheta1,2)
		+ "\n/* Angle from vertical (upper) */ pendulum.theta2  = " + round(this.theta2,2)
		+ "\n/* Angular velocity    (upper) */ pendulum.dtheta2 = " + round(this.dtheta2,2)
		+ "\n/* Simulation time             */ pendulum.T       = " + round(this.T,2);	
}

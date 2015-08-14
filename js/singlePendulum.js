function SinglePendulum()
{
	this.m0 = 8;
	this.m1 = 6;
	this.L = 80;
	this.g = 9.81;
	this.theta = 0.01;
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
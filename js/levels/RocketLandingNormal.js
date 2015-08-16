if (typeof Levels == 'undefined') Levels = {};

Levels.RocketLandingNormal = function()
{
	this.name = "RocketLandingNormal";
	this.title = "Level 3";
	this.sampleSolution = "";
	this.boilerPlateCode = "function controlFunction(rocket)\n{\n  return {\n    throttle:0.5*(100-rocket.y-rocket.dy),\n    gimbalAngle:rocket.theta+rocket.dtheta+0.01*rocket.dx\n  };\n}";
	this.description = "Land the rocket in the landing zone. The center of the landing zone has the coordinates (x,y)==(0,0). Steer the rocket by calculating the engine thrust (range 0 to 1) and engine steering angle (range -0.2 to 0.2 radians). The rocket has a thrust to weight ratio of 2. A throttle value of 0.5 can make it hover.";
	
	this.model = new Models.RocketLanding();
	this.resetModel();
}


Levels.RocketLandingNormal.prototype.isSolved = function(){return false;}

Levels.RocketLandingNormal.prototype.resetModel = function()
{
	this.model.TWR = 2;
	this.model.theta = 0.1;
	this.model.dtheta = 0.1;
	this.model.L = 40;
	this.model.W = 5;
	this.model.x = -100;
	this.model.dx = 20;
	this.model.y = 200;
	this.model.dy = 0;
	this.model.crashed = false;
	this.model.T = 0;
}
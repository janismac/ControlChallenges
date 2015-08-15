if (typeof Levels == 'undefined') Levels = {};

Levels.RocketLandingNormal = function()
{
	this.name = "RocketLandingNormal";
	this.title = "Level 3";
	this.sampleSolution = "";
	this.boilerPlateCode = "function controlFunction(pendulum)\n{\n  return 10*Math.sin(8*pendulum.T);\n}";
	this.description = "-";
	
	this.model = new Models.SinglePendulum();
	this.resetModel();
}


Levels.RocketLandingNormal.prototype.isSolved = function(){return false;}

Levels.RocketLandingNormal.prototype.resetModel = function()
{
	/**/
}
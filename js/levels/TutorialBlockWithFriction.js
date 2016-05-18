'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.TutorialBlockWithFriction = function()
{
	this.name = "TutorialBlockWithFriction";
	this.title = "Tutorial #1";

	this.sampleSolution = "function controlFunction(block)\n{\n  // Idea: If the block is on the left (negative x)\n  // it should be pushed to the right (positive force),\n  // and vice versa. The farther away the block is from\n  // its target, the harder it should be pushed.\n  // This is called a 'proportional controller'.\n  \n  return -3*block.x;\n}";
	this.boilerPlateCode = "function controlFunction(block)\n{\n  return 5*Math.sin(10*block.T);\n}";
	this.description = "Push the block under the arrow (x=0) and make it stop there. Write a <u>JavaScript</u> function that calculates the horizontal force on the block necessary to achieve this.";
	this.model = new Models.BlockOnSlope({g: 0,x: -2,dx: 0,slope: 0,friction: 1});
}


Levels.TutorialBlockWithFriction.prototype.levelComplete = function()
{
	return Math.abs(this.model.x) < 0.01 
		&& Math.abs(this.model.dx) < 0.01;
}

Levels.TutorialBlockWithFriction.prototype.levelFailed = function()
{
	return false;
}


Levels.TutorialBlockWithFriction.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.TutorialBlockWithFriction.prototype.getSimulationTime = function() {return this.model.T;}

Levels.TutorialBlockWithFriction.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.TutorialBlockWithFriction.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
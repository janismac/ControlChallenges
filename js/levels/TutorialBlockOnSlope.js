'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.TutorialBlockOnSlope = function()
{
	this.name = "TutorialBlockOnSlope";
	this.title = "Tutorial #3";

	this.sampleSolution = "var position_error = 0;\nfunction controlFunction(block)\n{\n  // Using the PD Controller form tutorial #2\n  // the block comes to rest, but the slope force\n  // pulls it away from its target.\n  // Idea: Measure the position-error over time.\n  // The longer the block is on the right of the\n  // arrow, the harder it should be pulled to the left.\n  // This is known as a proportional-integral-derivative (or PID) controller.\n  \n  position_error += block.x;  \n  monitor('position_error',position_error);  \n  return -3*block.x -5*block.dx -0.05*position_error;\n}";
	this.boilerPlateCode = "function controlFunction(block)\n{\n  return 0;\n}";
	this.description = "Push the block under the arrow (x=0) and make it stop there. Calculate the horizontal force on the block necessary to achieve this. This time the block is on a slope. The PD controller alone will not work.";
	this.model = new Models.BlockOnSlope({g: 5,x: -2,dx: 0,slope: -0.4,friction: 0});
}


Levels.TutorialBlockOnSlope.prototype.levelComplete = function()
{
	return Math.abs(this.model.x) < 0.01 
		&& Math.abs(this.model.dx) < 0.01;
}

Levels.TutorialBlockOnSlope.prototype.levelFailed = function()
{
	return false;
}


Levels.TutorialBlockOnSlope.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.TutorialBlockOnSlope.prototype.getSimulationTime = function() {return this.model.T;}

Levels.TutorialBlockOnSlope.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.TutorialBlockOnSlope.prototype.infoText = function(ctx, canvas){return this.model.infoText();}
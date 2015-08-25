'use strict';
if (typeof Levels == 'undefined') var Levels = {};

Levels.TutorialBlockWithoutFriction = function()
{
	this.name = "TutorialBlockWithoutFriction";
	this.title = "Tutorial #2";

	this.sampleSolution = "function controlFunction(block)\n{\n  // Idea: The block should slow down.\n  // It should be pushed against its direction of movement.\n  // We add this force to the proportional controller.\n  // This is known as a proportional-derivative (or PD) controller.\n  \n  return -3*block.x -1.5*block.dx;\n}";
	this.boilerPlateCode = "function controlFunction(block)\n{\n  return 5*Math.sin(10*block.T);\n}";
	this.description = "Push the block under the arrow (x=0) and make it stop there. Calculate the horizontal force on the block necessary to achieve this. This time the block has no friction (as if on ice). The proportional controller alone will not work.";
	this.model = new Models.BlockOnSlope({g: 0,x: -2,dx: 0,slope: 0,friction: 0});
}


Levels.TutorialBlockWithoutFriction.prototype.levelComplete = function()
{
	return Math.abs(this.model.x) < 0.01 
		&& Math.abs(this.model.dx) < 0.01;
}


Levels.TutorialBlockWithoutFriction.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.TutorialBlockWithoutFriction.prototype.getSimulationTime = function() {return this.model.T;}

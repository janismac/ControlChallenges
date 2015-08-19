if (typeof Levels == 'undefined') Levels = {};

Levels.RocketLandingNormal = function()
{
	this.name = "RocketLandingNormal";
	this.title = "Rocket Landing";
	this.boilerPlateCode = "function controlFunction(rocket)\n{\n  return {throttle:1,gimbalAngle:-0.2};\n}";
	//this.sampleSolution = "// This takes ~120 seconds, be patient :)\nfunction controlFunction(rocket)\n{\n  if(Math.abs(rocket.x) < 10 \n     && Math.abs(rocket.dx) < 1 \n     && Math.abs(rocket.dtheta) < 0.05\n     && Math.sin(rocket.theta) < 0.05)\n    return { \n      throttle:\n      	0.5\n        -0.01*rocket.y\n        -0.3*rocket.dy,\n      gimbalAngle:      	\n        8*rocket.theta\n        +2*rocket.dtheta\n        +0.08*rocket.dx\n  	};\n  else \n    return {\n      throttle:\n          0.5\n          +0.01*(200-rocket.y)\n          -0.01*rocket.dy,\n      gimbalAngle:\n        8*rocket.theta\n        +2*rocket.dtheta\n        +0.08*rocket.dx\n        +0.03*Math.sign(rocket.x)*Math.min(30,Math.abs(rocket.x))\n  };\n}";
	this.sampleSolution = "// This scheme is based on random optimization, it may not always complete the level.\n\ncc_lastThrottle = 0.5;\ncc_lastAngle = 0;\n\nfunction controlFunction(rocket)\n{\n  var bestInput = {t1:0.5,a1:0,t2:0.5,a2:0};\n  var minPenalty = 1e300;\n  for(var i = 0; i < 30; i++)\n  {\n    var newInput = {\n      t1:Math.random(),\n      a1:Math.random()*0.4-0.2,\n      t2:Math.random(),\n      a2:Math.random()*0.4-0.2\n    };\n    \n    var newPenalty = cc_control_penalty(rocket,newInput);\n    if(newPenalty < minPenalty)\n    {\n      minPenalty = newPenalty;\n      bestInput = newInput;\n    }\n  }  \n  cc_lastThrottle = 0.9*cc_lastThrottle + 0.1*bestInput.t1;\n  cc_lastAngle    = 0.9*cc_lastAngle    + 0.1*bestInput.a1;\n  \n  return {throttle:cc_lastThrottle,gimbalAngle:cc_lastAngle};\n}\n\nfunction cc_control_penalty(rocket,input)\n{\n  var penalty = 0;\n  for(var i=0;i<2;i++) {\n  	rocket = rocket.simulate(2,function(){return {throttle:input.t1,gimbalAngle:input.a1};});  \n    penalty += cc_state_penalty(rocket);\n  }\n  for(var i=0;i<4;i++) {\n  	rocket = rocket.simulate(2,function(){return {throttle:input.t2,gimbalAngle:input.a2};});  \n    penalty += cc_state_penalty(rocket);\n  }  \n  return penalty;\n}\n\nfunction cc_state_penalty(rocket)\n{\n  var p_angle = Math.abs(Math.sin(rocket.theta));\n  var groundFactor = (Math.tanh((40-rocket.y)/10)+1)/2;\n  var airFactor = 1-groundFactor;\n  var xRanged = Math.max(0,Math.abs(rocket.x)-20);\n  \n  return 10*(1+200000*groundFactor)*p_angle \n    + 1000*groundFactor*xRanged*xRanged \n  	+ 500*airFactor*rocket.x*rocket.x\n    + 100*(1+80*groundFactor)*rocket.dy*rocket.dy \n  	+ 100*(1+80*groundFactor)*rocket.dx*rocket.dx \n    + 100*rocket.y*rocket.y;\n}";
	this.description = "Land the rocket in the landing zone. The center of the landing zone has the coordinates (x,y)==(0,0). Steer the rocket by calculating the engine thrust (range 0 to 1) and engine steering angle (range -0.2 to 0.2 radians). The rocket has a thrust to weight ratio of 2. A throttle value of 0.5 can make it hover. Touch down gently (less than 5 m/s).";
	this.resetModel();
}


Levels.RocketLandingNormal.prototype.levelComplete = function(){return this.model.landed();}


Levels.RocketLandingNormal.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.RocketLandingNormal.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.RocketLandingNormal.prototype.resetModel = function()
{
	this.model = new Models.RocketLanding({TWR: 2,theta: -0.3,dtheta: 0,Length: 40,Width: 5,x: -100,dx: 0,y: 200,dy: -20,T: 0});
}
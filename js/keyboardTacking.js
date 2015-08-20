'use strict';
// keystate tracking
var keystates = [];
for(var i = 0;i<255;i++) keystates[i]=false;

$(document).keydown(function (e) { 
	var code = e.keyCode || e.which;
	keystates[code]=true;
});
$(document).keyup(function (e) { 
	var code = e.keyCode || e.which;
	keystates[code]=false;
});
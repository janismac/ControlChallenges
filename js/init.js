'use strict';

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var canvas = document.getElementById('cas');
var context = canvas.getContext('2d');
var level_constructors = [
	Levels.TutorialBlockWithFriction,
	Levels.TutorialBlockWithoutFriction,
	Levels.TutorialBlockOnSlope,
	Levels.StabilizeSinglePendulum,
	Levels.SwingUpSinglePendulum,
	Levels.RocketLandingNormal,
	Levels.StabilizeDoublePendulum
];
var level_menu_linebreaks = [false,false,true,false,false,false,false];
var activeLevel = null;
var activeLevelConstructor = null;
var runSimulation = false;
$(document).ready(function() {$('[data-toggle="tooltip"]').tooltip();});
$('#toggleVariableInfoShowButton').hide();
var editor = CodeMirror.fromTextArea(document.getElementById("CodeMirrorEditor"), {lineNumbers: true, mode: "javascript", matchBrackets: true, lineWrapping:true});
editor.on("change", function () {localStorage.setItem(activeLevel.name+"Code", editor.getValue());});
shortcut.add("Alt+Enter",function() {if(loadCodeAndReset())playSimulation();}, {'type':'keydown','propagate':true,'target':document});
shortcut.add("Alt+P",function() {if(runSimulation)pauseSimulation();else playSimulation();}, {'type':'keydown','propagate':true,'target':document});
shortcut.add("Esc",function() {showPopup(null);}, {'type':'keydown','propagate':true,'target':document});

$('.popup').prepend($('<button type="button" class="btn btn-danger closeButton" onclick="showPopup(null);" data-toggle="tooltip" data-placement="bottom" title="Close [ESC]"><span class="glyphicon glyphicon-remove"> </span></button>'));

$( window ).resize(resizeCanvas);
$('#buttons').cleanWhitespace();
$('.popup').cleanWhitespace();

// load level names into level menu.
for(var i=0; i<level_constructors.length;++i) {
	var level = new level_constructors[i]();
	var e = $('<button type="button" class="btn btn-primary" onclick="loadLevel('+i+');">'+level.title+'</button>');	
	$('#levelList').append(e);
	if(level_menu_linebreaks[i])
		$('#levelList').append($('<br />'));
}
setErrorBoxSize(false);
resizeCanvas();
try { loadLevel(localStorage.getItem("lastLevel")||0); } 
catch (e) { logError(e); }
loadCodeAndReset();
pauseSimulation();
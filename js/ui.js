'use strict';

var CC = {};

CC.canvas = document.getElementById('cas');
CC.context = CC.canvas.getContext('2d');

(function(){
	var $canvas = $('#cas');
	function resizeCanvas() {
		CC.canvas.width = $canvas.width();
		CC.canvas.height = $canvas.height();
	}
	$( window ).resize(resizeCanvas);
	resizeCanvas();
})();

function loadCodeAndReset() {
	CC.activeLevel = new CC.levelConstructors[CC.activeLevelIndex]();
	$('#userscript').remove();
	try {
		var e = $("<script id='userscript'>\ncontrolFunction=undefined;controlFunction = (function(){\n	'use strict';\n	"+CC.editor.getValue()+"\n	return controlFunction;\n})();\n</script>");	
		$('body').append(e);
	}
	catch(e) {
		CC.pause();
		logError(e);
		return false;
	}
	return true;
}


CC.loadLevel = function(i) {
	if(0 <= i && i < this.levelConstructors.length) {
		localStorage.setItem("lastLevel",i);
		this.activeLevelIndex = i;
		this.activeLevel = new this.levelConstructors[i]();
		$('#levelDescription').text(this.activeLevel.description);
		$('#levelTitle').text(this.activeLevel.title);
		document.title = this.activeLevel.title +': Control Challenges';
		var savedCode = localStorage.getItem(this.activeLevel.name+"Code");
		if(typeof savedCode == 'string' && savedCode.length > 10)
			this.editor.setValue(savedCode);
		else 
			this.editor.setValue(this.activeLevel.boilerPlateCode);
		loadCodeAndReset();
		showPopup('#levelStartPopup');
	}
};

(function(){
	var runSimulation = false;
	const pauseButton = $('#pauseButton');
	const playButton = $('#playButton');
	CC.pause = function () {
		pauseButton.hide();
		playButton.show();
		runSimulation = false;
	};
	CC.play = function () {
		pauseButton.show();
		playButton.hide();
		runSimulation = true;
	};
	CC.running = function(){return runSimulation;};

})();

CC.editorSetCode_preserveOld = function(code) {
	var lines = CC.editor.getValue().split(/\r?\n/);
	for (var i = 0; i < lines.length; i++) if(!lines[i].startsWith('//') && lines[i].length > 0) lines[i] = '//'+lines[i];
	var oldCode = lines.join("\n");
	CC.editor.setValue(code + "\n\n"+oldCode+"\n");
}

CC.loadBoilerplate = function(){ this.editorSetCode_preserveOld(this.activeLevel.boilerPlateCode); };
CC.loadSampleSolution = function(){ this.editorSetCode_preserveOld(this.activeLevel.sampleSolution); };


function toggleVariableInfo() {
	$('#variableInfo').toggle();
	$('#toggleVariableInfoShowButton').toggle();
	$('#toggleVariableInfoHideButton').toggle();
}

function setErrorBoxSize(big) {
	if(big) {
		$('#errorsBoxUp').hide();
		$('#errorsBoxDown').show();
		$('.smallErrorBox').removeClass('smallErrorBox').addClass('bigErrorBox');
	} else {
		$('#errorsBoxUp').show();
		$('#errorsBoxDown').hide();
		$('.bigErrorBox').removeClass('bigErrorBox').addClass('smallErrorBox');		
	}
}


function clearErrors(){$('#errorsBox pre').text('');}
function logError(s) {
	var timeStamp = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	var logText = $('#errorsBox pre');
	logText.text((logText.text()+"\n["+timeStamp+"] "+s).trim());
	logText.scrollTop(logText.prop("scrollHeight") - logText.height());
}

function clearMonitor() {$('#variableInfo').text('');}
function monitor(name,val) {
	if(typeof val == 'number') val = ""+round(val,4);
	$('#variableInfo').text($('#variableInfo').text()+name+" = "+val+"\n");
}

function showPopup(p) {
	$('.popup').hide();
	$(p).show();
	if(p!=null)CC.pause();
}




CC.levelConstructors = [
	Levels.TutorialBlockWithFriction,
	Levels.TutorialBlockWithoutFriction,
	Levels.TutorialBlockOnSlope,
	Levels.StabilizeSinglePendulum,
	Levels.SwingUpSinglePendulum,
	Levels.RocketLandingNormal,
	Levels.StabilizeDoublePendulum
];
CC.levelMenuLinebreaks = [false,false,true,false,false,false,false];

$(document).ready(function() {$('[data-toggle="tooltip"]').tooltip();});
$('#toggleVariableInfoShowButton').hide();
CC.editor = CodeMirror.fromTextArea(document.getElementById("CodeMirrorEditor"), {lineNumbers: true, mode: "javascript", matchBrackets: true, lineWrapping:true});
CC.editor.on("change", function () {localStorage.setItem(CC.activeLevel.name+"Code", CC.editor.getValue());});
shortcut.add("Alt+Enter",function() {if(loadCodeAndReset())CC.play();}, {'type':'keydown','propagate':true,'target':document});
shortcut.add("Alt+P",function() {if(runSimulation)CC.pause();else CC.play();}, {'type':'keydown','propagate':true,'target':document});
shortcut.add("Esc",function() {showPopup(null);}, {'type':'keydown','propagate':true,'target':document});

$('.popup').prepend($('<button type="button" class="btn btn-danger closeButton" onclick="showPopup(null);" data-toggle="tooltip" data-placement="bottom" title="Close [ESC]"><span class="glyphicon glyphicon-remove"> </span></button>'));


$('#buttons').cleanWhitespace();
$('.popup').cleanWhitespace();

// load level names into level menu.
for(var i=0; i<CC.levelConstructors.length;++i) {
	var level = new CC.levelConstructors[i]();
	var e = $('<button type="button" class="btn btn-primary" onclick="CC.loadLevel('+i+');">'+level.title+'</button>');	
	$('#levelList').append(e);
	if(CC.levelMenuLinebreaks[i])
		$('#levelList').append($('<br />'));
}
setErrorBoxSize(false);
try { CC.loadLevel(localStorage.getItem("lastLevel")||0); } 
catch (e) { logError(e); }
loadCodeAndReset();
CC.pause();
'use strict';

jQuery.fn.cleanWhitespace = function() {
	var textNodes = this.contents().filter(
	function() { return (this.nodeType == 3 && !/\S/.test(this.nodeValue)); })
	.remove();
	return this;
}

function resizeCanvas() {
	canvas.width = $('#cas').width();
	canvas.height = $('#cas').height();
}

function loadCodeAndReset() {
	activeLevel = new activeLevelConstructor();
	$('#userscript').remove();
	try {
		var e = $('<script id="userscript">'+editor.getValue() +'</script>');	
		$('body').append(e);
	}
	catch(e) {
		pauseSimulation();
		logError(e);
		return false;
	}
	return true;
}


function loadLevel(i) {
	if(0 <= i && i < level_constructors.length) {
		localStorage.setItem("lastLevel",i);
		activeLevelConstructor = level_constructors[i];
		activeLevel = new activeLevelConstructor();
		$('#levelDescription').text(activeLevel.description);
		$('#levelTitle').text(activeLevel.title);
		//$('#tipsText').text(activeLevel.tips);
		document.title = activeLevel.title +': Control Challenges';
		var savedCode = localStorage.getItem(activeLevel.name+"Code");
		if(typeof savedCode == 'string' && savedCode.length > 10)
			editor.setValue(savedCode);
		else 
			editor.setValue(activeLevel.boilerPlateCode);
		loadCodeAndReset();
		showPopup('#levelStartPopup');
	}
}

function editorSetCode_preserveOld(code) {
	var lines = editor.getValue().split(/\r?\n/);
	for (var i = 0; i < lines.length; i++) if(!lines[i].startsWith('//') && lines[i].length > 0) lines[i] = '//'+lines[i];
	var oldCode = lines.join("\n");
	editor.setValue(code + "\n\n"+oldCode+"\n");
}

function pauseSimulation() {
	$('#pauseButton').hide();
	$('#playButton').show();
	runSimulation = false;
}
function playSimulation() {
	$('#pauseButton').show();
	$('#playButton').hide();
	runSimulation = true;
}

function drawLine(ctx,x1,y1,x2,y2,width) {
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineWidth = width;
	ctx.stroke();
}

function round(x,d) {
	var shift = Math.pow(10, d);
	return Math.round(x*shift)/shift;
}

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

function animate() {
	
	clearMonitor();

	if(runSimulation) {
		try { activeLevel.simulate(0.02,controlFunction); }
		catch(e) {
			pauseSimulation();
			logError(e);
		}
		
		if(activeLevel.levelComplete()) {
			$('#levelSolvedTime').text(round(activeLevel.getSimulationTime(),2));
			showPopup('#levelCompletePopup');
		}
	}
	
	activeLevel.model.draw(context);
	
	$('#variableInfo').text($('#variableInfo').text()+activeLevel.model.infoText());	
	
	if(runSimulation)
		requestAnimationFrame(animate);
	else
		setTimeout( function() {requestAnimationFrame(animate);}, 200);
}



function clearErrors(){$('#errorsBox pre').text('');}
function logError(s) {
	var timeStamp = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	var logText = $('#errorsBox pre');
	logText.text(logText.text().trim()+"\n["+timeStamp+"] "+s);
	logText.scrollTop(logText.prop("scrollHeight") - logText.height());
}

function clearMonitor() {$('#variableInfo').text('');}
function monitor(name,val) {
	if(typeof val == 'number') val = ""+round(val,4);4
	$('#variableInfo').text($('#variableInfo').text()+name+" = "+val+"\n");
}

function showPopup(p) {
	$('.popup').hide();
	$(p).show();
	if(p!=null)pauseSimulation();
}

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var canvas = document.getElementById('cas');
var context = canvas.getContext('2d');
var level_constructors = [Levels.StabilizeSinglePendulum,Levels.SwingUpSinglePendulum,Levels.RocketLandingNormal,Levels.StabilizeDoublePendulum];
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
}
setErrorBoxSize(false);
resizeCanvas();
try { loadLevel(localStorage.getItem("lastLevel")||0); } 
catch (e) { logError(e); }
loadCodeAndReset();
pauseSimulation();
animate();
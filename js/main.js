jQuery.fn.cleanWhitespace = function() {
    textNodes = this.contents().filter(
        function() { return (this.nodeType == 3 && !/\S/.test(this.nodeValue)); })
        .remove();
    return this;
}

function resizeCanvas() {
	canvas.width = $('#cas').width();
	canvas.height = $('#cas').height();
}

function loadCodeAndReset()
{
	activeLevel = new level_constructors[level_idx]();
	$('#userscript').remove();
	try {
		var e = $('<script id="userscript">'+editor.getValue() +'</script>');	
		$('body').append(e);
	}
	catch(e){
		pauseSimulation();
		alert(e);
	}
}


function loadLevel(i)
{
	if(0 <= i && i < level_constructors.length)
	{
		level_idx = i;
		activeLevel = new level_constructors[i]();
		$('#levelDescription').text(activeLevel.description);
		$('#levelTitle').text(activeLevel.title);
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

function showSampleSolution()
{
	var lines = editor.getValue().split(/\r?\n/);
	editor.setValue(activeLevel.sampleSolution + "\n\n//"+lines.join("\n//")+"\n");
	loadCodeAndReset();
}

function pauseSimulation()
{
	$('#pauseButton').hide();
	$('#playButton').show();
	runSimulation = false;
}
function playSimulation()
{
	$('#pauseButton').show();
	$('#playButton').hide();
	runSimulation = true;
}

function drawLine(ctx,x1,y1,x2,y2,width)
{
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineWidth = width;
	ctx.stroke();
}

function round(x,d)
{
	var shift = Math.pow(10, d);
	return Math.round(x*shift)/shift;
}

function toggleVariableInfo()
{
	$('#variableInfo').toggle();
	$('#toggleVariableInfoButtonShow').toggle();
	$('#toggleVariableInfoButtonHide').toggle();
}

function animate() {
	
	var dt = (new Date().getTime()-T)/1000.0;
	T = new Date().getTime();
	
	if(runSimulation)
	{
		try { if(!isNaN(dt)) activeLevel.simulate(Math.min(0.2,dt),controlFunction); }
		catch(e){
			pauseSimulation();
			alert(e);
		}
		
		if(activeLevel.levelComplete()) 
		{
			$('#levelSolvedTime').text(round(activeLevel.getSimulationTime(),2));
			showPopup('#levelCompletePopup');
		}
	}
	
	activeLevel.model.draw(context);
	
	$('#variableInfo').text(activeLevel.model.infoText());	
	
	requestAnimationFrame(animate);
}

function showPopup(p)
{
	$('.popup').hide();
	$(p).show();
	pauseSimulation();
}

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var canvas = document.getElementById('cas');
var context = canvas.getContext('2d');
var level_constructors = [Levels.StabilizeSinglePendulum,Levels.RocketLandingNormal];
var level_idx = 0;
var runSimulation = false;
$(document).ready(function(){$('[data-toggle="tooltip"]').tooltip();});
$('#toggleVariableInfoButtonShow').hide();
var editor = CodeMirror.fromTextArea(document.getElementById("CodeMirrorEditor"), {lineNumbers: true, mode: "javascript", matchBrackets: true, lineWrapping:true});
editor.on("change", function () {localStorage.setItem(activeLevel.name+"Code", editor.getValue());});
shortcut.add("Alt+Enter",function() {loadCodeAndReset();playSimulation();},{'type':'keydown','propagate':true,'target':document});
$( window ).resize(resizeCanvas);
$('#buttons').cleanWhitespace();
$('.popup').cleanWhitespace();

// load level name into level menu.
for(var i=0; i<level_constructors.length;++i)
{
	var level = new level_constructors[i]();
	var e = $('<button type="button" class="btn btn-primary" onclick="loadLevel('+i+');">'+level.title+'</button>');	
	$('#levelList').append(e);
}
resizeCanvas();
loadLevel(0);
loadCodeAndReset();
pauseSimulation();
var T = new Date().getTime();
animate();
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
	levels[level_idx].resetModel();
	$('#userscript').remove();
	try {
		var e = $('<script id="userscript">'+editor.getValue() +'</script>');	
		$('body').append(e);
		levels[level_idx].model.setControlFunction(controlFunction)
	}
	catch(e){
		pauseSimulation();
		alert(e);
	}
}


function loadLevel(i)
{
	if(0 <= i && i < levels.length)
	{
		level_idx = i;
		$('#levelDescription').text(levels[level_idx].description);
		$('#levelTitle').text(levels[level_idx].title);
		document.title = levels[level_idx].title +': Control Challenges';
		var savedCode = localStorage.getItem(levels[level_idx].name+"Code");
		if(typeof savedCode == 'string' && savedCode.length > 10)
			editor.setValue(savedCode);
		else 
			editor.setValue(levels[level_idx].boilerPlateCode);
		loadCodeAndReset();
		showPopup('#levelStartPopup');
	}
}

function showSampleSolution()
{
	var lines = editor.getValue().split(/\r?\n/);
	editor.setValue(levels[level_idx].sampleSolution + "\n\n//"+lines.join("\n//")+"\n");
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
		try { if(!isNaN(dt)) levels[level_idx].model.simulate(Math.min(0.2,dt)); }
		catch(e){
			pauseSimulation();
			alert(e);
		}
		
		if(levels[level_idx].levelComplete()) 
		{
			$('#levelSolvedTime').text(round(levels[level_idx].getSimulationTime(),2));
			showPopup('#levelCompletePopup');
		}
	}
	
	levels[level_idx].model.draw(context);
	
	$('#variableInfo').text(levels[level_idx].model.infoText());	
	
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
var levels = [new Levels.StabilizeSinglePendulum(),new Levels.RocketLandingNormal()];
var level_idx = 0;
var runSimulation = false;
$(document).ready(function(){$('[data-toggle="tooltip"]').tooltip();});
$('#toggleVariableInfoButtonShow').hide();
var editor = CodeMirror.fromTextArea(document.getElementById("CodeMirrorEditor"), {lineNumbers: true, mode: "javascript", matchBrackets: true, lineWrapping:true});
editor.on("change", function () {localStorage.setItem(levels[level_idx].name+"Code", editor.getValue());});
shortcut.add("Alt+Enter",function() {loadCodeAndReset();},{'type':'keydown','propagate':true,'target':document});
$( window ).resize(resizeCanvas);
$('#buttons').cleanWhitespace();
$('.popup').cleanWhitespace();
for(var i=0; i<levels.length;++i)
{
	var e = $('<button type="button" class="btn btn-primary" onclick="loadLevel('+i+');">'+levels[i].title+'</button>');	
	$('#levelList').append(e);
}
resizeCanvas();
loadLevel(0);
loadCodeAndReset();
pauseSimulation();
var T = new Date().getTime();
animate();
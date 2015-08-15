var editor = CodeMirror.fromTextArea(document.getElementById("CodeMirrorEditor"), { lineNumbers: true, mode: "javascript", matchBrackets: true, lineWrapping:true });
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var canvas = document.getElementById('cas');
var context = canvas.getContext('2d');
var pendulum = new SinglePendulum();

function resizeCanvas() {
	canvas.width = $('#cas').width();
	canvas.height = $('#cas').height();
	context.setTransform(1,0,0,1,0,0);
	context.translate(canvas.width/2,canvas.height/2);
	context.scale(150,-150);
}
$( window ).resize(resizeCanvas);

function loadCodeAndReset()
{
	$('#userscript').remove();
	var e = $('<script id="userscript">'+editor.getValue() +'</script>');	
	$('body').append(e);
	pendulum = new SinglePendulum();
	T_start = new Date().getTime();
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
	$('#toggleVariableLabel').text( ($('#variableInfo').css('display')=='none')?'Show Variables':'Hide Variables' );
}

var T = new Date().getTime();
var T_start = new Date().getTime();
resizeCanvas();
loadCodeAndReset();
animate();
function animate() {


	var dt = (new Date().getTime()-T)/1000.0;
	T = new Date().getTime();
	
	pendulum.F = 0;
	try {
		pendulum.F = controlFunction(pendulum);
		if(!isNaN(dt)) pendulum.simulate(Math.min(0.2,dt));
	}
	catch(e){}
	
	// clear all
	context.save();
	context.setTransform(1,0,0,1,0,0);
	context.clearRect(0,0,canvas.width,canvas.height);
	context.restore();
	
	// draw pendulum
	pendulum.draw(context);
	
	// variableInfo
	$('#variableInfo').text(pendulum.infoText());
	
	requestAnimationFrame(animate);
}
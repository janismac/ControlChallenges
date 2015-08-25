'use strict';

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
	if(typeof val == 'number') val = ""+round(val,4);4
	$('#variableInfo').text($('#variableInfo').text()+name+" = "+val+"\n");
}

function showPopup(p) {
	$('.popup').hide();
	$(p).show();
	if(p!=null)pauseSimulation();
}
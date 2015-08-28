'use strict';

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
function gameLoop() {
	if(CC.running()) {
		clearMonitor();
		try { CC.activeLevel.simulate(0.02,controlFunction); }
		catch(e) {
			CC.pause();
			logError(e);
		}
		
		if(CC.activeLevel.levelComplete()) {
			$('#levelSolvedTime').text(round(CC.activeLevel.getSimulationTime(),2));
			showPopup('#levelCompletePopup');
		}
		$('#variableInfo').text($('#variableInfo').text()+CC.activeLevel.model.infoText());		
	}
	CC.activeLevel.model.draw(CC.context,CC.canvas);
	
	if(CC.running()) requestAnimationFrame(gameLoop);
	else setTimeout( function() {requestAnimationFrame(gameLoop);}, 200);
}

gameLoop();
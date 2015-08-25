'use strict';

function gameLoop() {
	if(runSimulation) {
		clearMonitor();
		try { activeLevel.simulate(0.02,controlFunction); }
		catch(e) {
			pauseSimulation();
			logError(e);
		}
		
		if(activeLevel.levelComplete()) {
			$('#levelSolvedTime').text(round(activeLevel.getSimulationTime(),2));
			showPopup('#levelCompletePopup');
		}
		activeLevel.model.draw(context);		
		$('#variableInfo').text($('#variableInfo').text()+activeLevel.model.infoText());
		requestAnimationFrame(gameLoop);
	}
	else setTimeout( function() {requestAnimationFrame(gameLoop);}, 200);
}

gameLoop();
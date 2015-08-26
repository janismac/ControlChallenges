'use strict';

function gameLoop() {
	if(simulation.running()) {
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
		$('#variableInfo').text($('#variableInfo').text()+activeLevel.model.infoText());		
	}
	activeLevel.model.draw(context);
	
	if(simulation.running()) requestAnimationFrame(gameLoop);
	else setTimeout( function() {requestAnimationFrame(gameLoop);}, 200);
}

gameLoop();
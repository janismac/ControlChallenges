'use strict';

jQuery.fn.cleanWhitespace = function() {
	var textNodes = this.contents().filter(
	function() { return (this.nodeType == 3 && !/\S/.test(this.nodeValue)); })
	.remove();
	return this;
}

function round(x,d) {
	var shift = Math.pow(10, d);
	return Math.round(x*shift)/shift;
}

function drawLine(ctx,x1,y1,x2,y2,width) {
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineWidth = width;
	ctx.stroke();
}

function padSpaces(str,count) {
   return String('                                 ' + str).slice(-count);
};

function resetCanvas(ctx,canvas){
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0,0,canvas.width,canvas.height);	
	ctx.translate(canvas.width/2,canvas.height/2);
	ctx.scale(canvas.width/8.0,-canvas.width/8.0);
}
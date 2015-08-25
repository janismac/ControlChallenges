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
'use strict';

var ImageDataCache = {};
ImageDataCache.images = {};


ImageDataCache.load = function(url){
	var img = new Image();
	img.onload = function () {
		console.log(img.width);
		var myCanvas = document.createElement('canvas');
		myCanvas.width = img.width;
		myCanvas.height = img.height;
		var ctx=myCanvas.getContext("2d");
		ctx.drawImage(img,0,0);
		var imgData=ctx.getImageData(0,0,img.width,img.height);
		ImageDataCache.images[url] = imgData;
		ImageDataCache.images[url].image = img;
	};
	img.src = url;

};
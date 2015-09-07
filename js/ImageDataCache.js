'use strict';

var ImageDataCache = {};
ImageDataCache.images = {};


ImageDataCache.load = function(url){
	if(typeof ImageDataCache.images[url] === 'undefined')
	{
		var img = new Image();
		ImageDataCache.images[url] = null;
		img.onload = function () {
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
	}
};

ImageDataCache.at = function(url, x, y){
	if(typeof ImageDataCache.images[url] === 'object' && ImageDataCache.images[url] !== null)
	{
		var img = ImageDataCache.images[url];
		var i = (y*img.width+x)*4;
		return [img.data[i],img.data[i+1],img.data[i+2],img.data[i+3]];
	}
};

ImageDataCache.get = function(url){ return ImageDataCache.images[url]; };
from scipy import misc
from scipy import interpolate
import numpy as np
from PIL import Image, ImageDraw

#asphalt_texture = misc.imread('asphalt_texture.jpg')
#rows,colns,__ = asphalt_texture.shape
asphalt_texture = Image.open("Asphalt-005.jpg")
background = Image.new("RGBA", asphalt_texture.size, color=(200,200,255,0))
mask = Image.new("RGBA", asphalt_texture.size, color=(0,0,0,0))
width,height = asphalt_texture.size

def getSpline():
	blob = [(1,1),(2,1),(3,1),(4,1),(5,1),(5,2),(4,2),(3,2),(2,2),(1,2),(1,3),(2,3),(3,3),(3,4),(2,4),(1,4),(1,5),(2,5),(3,5),(4,5),(5,5),(5,4),(3.8,3.5)]
	x = (np.array([p[0]/6.0 for p in blob])-.5)*1.2+.5
	y = (np.array([p[1]/6.0 for p in blob])-.5)*1.2+.5
	t = np.arange(x.shape[0])
	t2 = np.arange(0,x.shape[0]-1,0.005)
	x = width*interpolate.interp1d(t, x, kind='cubic')(t2)
	y = height*interpolate.interp1d(t, y, kind='cubic')(t2)
	return (x,y)

X,Y = getSpline()



drawMask = ImageDraw.Draw(mask,mode="RGBA")
drawTex = ImageDraw.Draw(asphalt_texture,mode="RGBA")
xy = [np.array([X[i],Y[i]]) for i in range(len(X))]

normalize = lambda x: x/np.sqrt(np.dot(x,x))
rotate = lambda x: np.array([-x[1],x[0]])

parallel = lambda p: [ xy[i]+width/1200.0*p*normalize(rotate(xy[min(i,len(X)-2)+1]-xy[min(i,len(X)-2)])) for i in range(len(xy))]

leftOuterSide = parallel(45)
leftInnerSide = parallel(35)
rightInnerSide = parallel(-35)
rightOuterSide = parallel(-45)


stepX = width*0.02
stepY = width*0.02
for x in np.arange(X[-1]-width*0.05,X[-1]+width*0.08,stepX).tolist():
	for y in np.arange(Y[-1]-height*0.1,Y[-1]+height*0.1,stepY).tolist():
		drawTex.rectangle([(x, y), (x+stepX, y+stepY)], fill=(0,0,0,255), outline=None)
		drawTex.rectangle([(x, y), (x+stepX/2, y+stepY/2)], fill=(255,255,255,255), outline=None)
		drawTex.rectangle([(x+stepX/2, y+stepY/2),(x+stepX, y+stepY)], fill=(255,255,255,255), outline=None)

step = 30
for i in range(0,len(leftOuterSide)-1,step):
	j = min(i+step+1,len(leftOuterSide))
	polyL = [(p[0],p[1]) for p in leftInnerSide[i:j] + list(reversed(leftOuterSide[i:j]))]
	polyR = [(p[0],p[1]) for p in rightInnerSide[i:j] + list(reversed(rightOuterSide[i:j]))]
	color = (255,0,0,244) if i%60 < 30 else (255,255,255,244)
	drawTex.polygon(polyL, fill=color, outline=None)
	drawTex.polygon(polyR, fill=color, outline=None)


#drawTex.polygon([(p[0],p[1]) for p in rightInnerSide + list(reversed(rightOuterSide))], fill=(200,0,0,180), outline=None)

drawMask.polygon([(p[0],p[1]) for p in leftOuterSide + list(reversed(rightOuterSide))], fill=(0,0,0,255), outline=None)


#for i in range(len(X)-1):
	#x1 = X[i]
	#y1 = Y[i]
	#x2 = X[i+1]
	#y2 = Y[i+1]
	#dx = x2-x1
	#dy = y2-y1
	#norm = np.sqrt(dx*dx+dy*dy)
	#dx /= norm
	#dy /= norm


background.paste(asphalt_texture, box=None, mask=mask)

background.resize((1200,int(1200.0/width*height)), resample=Image.ANTIALIAS).save('track.png', "PNG")


#misc.imsave('output.png', asphalt_texture)
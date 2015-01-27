canvasRender = (function() {
	var instance;
	var initialize = function () { 
		var canvas = document.getElementById('chronodex'),
			decorateCanvas = document.getElementById('decorate'),
			paletteCanvas = document.getElementById('palette'),
			ctx = canvas.getContext('2d'),
			dctx = decorateCanvas.getContext('2d'),
			pctx = paletteCanvas.getContext('2d'),
			size = 500,
			grid = size / 10,
			center = size / 2,
			radius = grid * 0.8;

	var prepare = function() {
			paletteCanvas.width = paletteCanvas.height =  size;
			decorateCanvas.width = decorateCanvas.height =  size;
			canvas.width =  canvas.height = size;
	};
	
	var renderTitle = function() {
			var str = "CHRONODEX";
			var len = str.length, s;
			var angle = Math.PI * 0.45;
			ctx.save();
			ctx.translate(center, center);
			ctx.rotate(Math.PI * 1.5);
			ctx.rotate(-1 * (angle / len) / 2);
			for(var n = 0; n < len; n++) {
				ctx.rotate(angle / len);
				ctx.save();
				ctx.translate(0, -2 * radius + 20);
				s = str[n];
				ctx.fillText(s, 0, 0);
			ctx.restore();
			}		
			ctx.restore();
	};
	var renderBackground = function() {
			dctx.save();
			dctx.beginPath();
			dctx.moveTo(center, center);
			for (var i = 0; i < 12; i++) {
				dctx.arc(center, center, radius * (3 + i % 3), i * Math.PI / 6, (i + 1) * Math.PI / 6, false);	
			}
			dctx.fillStyle = 'white';
			dctx.fill();
			dctx.restore();		
	};
	return {			
		renderPaletteGrids: function(strokStyle) {
			pctx.clearRect(0, 0, size, size);
			pctx.save();
			pctx.strokeStyle = strokStyle ? strokStyle : 'lightgrey';
			pctx.setLineDash([7, 5]);
			pctx.beginPath();
			for (var i = 0; i < 11; i++) {
				pctx.moveTo(0, i * grid);
				pctx.lineTo(size, i * grid);
				pctx.moveTo(i * grid, 0);
				pctx.lineTo(i * grid, size);
			}
			pctx.stroke();
		},
		renderDate: function() {
			var now = new Date();
			var date = now.getDate();
			var weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
			var weekday = weekdays[ now.getDay() ];
			ctx.save();
			ctx.translate(center, center);
			ctx.textAlign = 'center';
			ctx.font = 'bold 20pt sans-serif';
			ctx.fillText(date, 0, 5);
			ctx.font = '10pt sans-serif';
			ctx.fillText(weekday, 0, 20);
			ctx.restore();
		},
		renderArrow: function() {

			var now = new Date();
			var hh = now.getHours();
			var h = hh % 12;
			var c = hh < 9 ? 1 : 
				hh == 21 ? 3 :
				hh == 22 ? 4 :
				hh == 23 ? 5 : 2;
			var r = - c * radius;
			ctx.save();
			ctx.translate(center, center);
			ctx.rotate(Math.PI / 6 * h + Math.PI / 2);
			ctx.fillStyle = 'red';
			ctx.beginPath();
			ctx.moveTo(r - 5, 0);
			ctx.lineTo(r + 10,  -7);
			ctx.lineTo(r + 10,  +7);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		},
		renderChronodex: function() {
			prepare();
			this.renderPaletteGrids();
			renderBackground();
			this.renderDate();
			this.renderArrow();
		},
		renderSector: function (sector, style) {
			dctx.save();
			dctx.translate(center, center);
			dctx.beginPath();
			var inner = sector.cid;
			var outer = inner + 1;
			var sDgr = sector.rid * Math.PI / 6;
			var eDgr = (sector.rid + 1) * Math.PI / 6;
			dctx.arc(0, 0, outer * radius, sDgr, eDgr, false);
			dctx.arc(0, 0, inner * radius, eDgr, sDgr, true);
			dctx.closePath();
			dctx.fillStyle = style ? style : 'white';
			dctx.fill();
			dctx.restore();
		},
		renderPalette: function(style, i) {
			pctx.save();
			var row = Math.floor (i / 4) + 3;
			var col = i % 4 + 3 ;
			pctx.fillStyle = style;
			pctx.beginPath();
			pctx.rect(col * grid, row * grid, grid, grid);
			pctx.fill();
			var lastCol = col == 7 ? 3 : col + 1;
			var lastRow = lastCol == 3 ? row + 1 : row;
			pctx.restore();
		},
		renderPlusPlatte: function() {
			var i = categories.length;
			var row = Math.floor (i / 4) + 3;
			var col = i % 4 + 3;
			pctx.font = "20pt Arial";
			pctx.fillText("+", col * grid + grid / 3, row * grid + 35);	
		},
		renderColorWheel: function() {
			var imageObj = new Image();
			imageObj.onload = function() {
				pctx.drawImage(imageObj, 0, 0);
			};
			imageObj.src = 'img/colorwheel.png';
		},
		getPixelColor: function(x, y) {
			var imageData = pctx.getImageData(x, y, 1, 1);
			var pixel = imageData.data;
			var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
			var color = '#' + ('0000' + dColor.toString(16)).substr(-6);
			return color;
		},
		showChronodexView: function(){
			canvas.style.visibility = "visible";
			decorateCanvas.style.visibility = "visible";
			this.renderPaletteGrids('lightgrey');
		},
		showCategoryView: function(){
			canvas.style.visibility = "hidden";
			decorateCanvas.style.visibility = "hidden";	
			this.renderPaletteGrids('grey');
			for (var i = 0; i < categories.length; i++ ) {
				this.renderPalette(categories[i].style, i);
			}
			this.renderPlusPlatte();
		},
		getBoundingRect() {
			return canvas.getBoundingClientRect();
		}
		
		}
	};
	return {
		getRender: function () {
			if (instance == null) {
				instance = initialize();
			}
			return instance;
		}
	};
})();


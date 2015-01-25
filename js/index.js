var categoryKey = 'chronodex.category';
var	dataKey = 'chronodex.data';
var sectors;
var categories;
var container = document.getElementById('canvas-container');
var status = 0;
var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
		if (navigator.userAgent.match(/(iPhone|iPad|Android)/)) {
			document.addEventListener('deviceready', app.onDeviceReady, false);
		} else {
			app.onDeviceReady();
		}       
    },

    onDeviceReady: function() {
        canvasRender.renderChronodex();
		storageManager.getSectors();
		storageManager.getCategories();
		var sector;
		var style;
		for (var i = 0; i < sectors.length; i++ ) {
			sector = sectors[i];
			style = categories[sector.sid].style;
			canvasRender.renderSector(sector, style);
		}
		container.addEventListener('click', geometryManager.select, false);
		//window.addEventListener('beforeunload', storageManager.saveSectors, false);
    },
	
	fillSector: function(sector) {
		currStyle = currStyle ? currStyle : categories.length - 1;
		if (sector) {
			sector.sid = currStyle;
			canvasRender.renderSector(sector, categories[currStyle].style);		
			sectors.push(sector);
		}
	},
	showPalette: function(){
		isPalette = !isPalette;	
		if (isPalette) {
			canvas.style.visibility = "hidden";
			decorateCanvas.style.visibility = "hidden";	
			canvasRender.renderPaletteGrids('grey');
			canvasRender.renderColorWheel();
			for (var i = 0; i < categories.length; i++ ) {
				canvasRender.renderPalette(categories[i].style, i);
			}
		} else {
			canvas.style.visibility = "visible";
			decorateCanvas.style.visibility = "visible";
			canvasRender.renderPaletteGrids('lightgrey');
			container.addEventListener('click', app.fillSector, false);
		}
	},
	newCategory: function() {
		canvasRender.renderColorWheel();
		isColor = true;
	}
};

var isPalette = false;
var isColor = false;
var currStyle;
var size = 500;
var grid = size / 10;
var center = size / 2;
var radius = grid * 0.8;
var canvas = document.getElementById('chronodex');
var ctx = canvas.getContext('2d');
var decorateCanvas = document.getElementById('decorate');
var dctx= decorateCanvas.getContext('2d');
var paletteCanvas = document.getElementById('palette');
var pctx= paletteCanvas.getContext('2d');
var canvasRender = {
	colors: ["#B8D430", "#3AB745", "#029990", "#3501CB",
		          "#2E2C75", "#673A7E", "#CC0071", "#F80120",
                 "#F35B20", "#FB9A00", "#FFCC00", "#FEF200"],
	init: function() {
		paletteCanvas.width = paletteCanvas.height =  size;
		decorateCanvas.width = decorateCanvas.height =  size;
		canvas.width =  canvas.height = size;
	},
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
	renderBackground: function() {
		dctx.save();
		dctx.beginPath();
		dctx.moveTo(center, center);
		for (var i = 0; i < 12; i++) {
			dctx.arc(center, center, radius * (3 + i % 3), i * Math.PI / 6, (i + 1) * Math.PI / 6, false);	
		}
		dctx.fillStyle = 'white';
		dctx.fill();
		dctx.restore();
		
	},
	renderCobweb: function(){
		//dashed
		ctx.save();
		ctx.setLineDash([7, 5]);
		ctx.beginPath();
		ctx.arc(center, center, radius * 6, Math.PI, Math.PI * 1.5, false);
		ctx.stroke();
		for (var i = 0; i < 4; i ++) {
			ctx.beginPath();
			ctx.arc(center, center, radius * 5, i * Math.PI / 2, i * Math.PI / 2 + Math.PI / 3, false);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(center, center, radius * 4, i * Math.PI / 2, i * Math.PI / 2 + Math.PI / 6, false);	
			ctx.stroke();
		}
		ctx.beginPath();
		for (var i = 0; i < 12; i ++ ) {
			var outer = 5;
			if (i > 5 && i < 10) outer = 6;
			ctx.moveTo(center + Math.cos(Math.PI / 6 * i) * radius * 4, center + Math.sin(Math.PI / 6 * i) * radius * 4);
			ctx.lineTo(center + Math.cos(Math.PI / 6 * i) * radius * outer,  center + Math.sin(Math.PI / 6 * i) * radius * outer);
		}
		ctx.stroke();
		ctx.restore();
		
		//thick
		ctx.save();
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(center, center, radius * 2, 0, Math.PI * 2, false);	
		ctx.stroke();
		ctx.beginPath();
		for (var i = 0; i < 12; i++) {
			ctx.arc(center, center, radius * (3 + i % 3), i * Math.PI / 6, (i + 1) * Math.PI / 6, false);	
		}
		ctx.closePath();
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(center, center, radius * 2, 0, Math.PI * 2, false);	
		for (var i = 0; i < 12; i ++ ) {
			var outer = 5;
			if ( i % 3 == 1) outer = 4;
			ctx.moveTo(center + Math.cos(Math.PI / 6 * i) * radius * 2, center + Math.sin(Math.PI / 6 * i) * radius * 2);
			ctx.lineTo(center + Math.cos(Math.PI / 6 * i) * radius * outer,  center + Math.sin(Math.PI / 6 * i) * radius * outer);
		}
		ctx.stroke();	
		ctx.restore();
		
		//grey
		ctx.save();
		ctx.strokeStyle = 'lightgrey';
		ctx.beginPath();
		for (var i = 0; i < 4; i++) {
			ctx.beginPath();
			ctx.arc(center, center, radius * 4, i * Math.PI / 2 + Math.PI / 3 , (i + 1 )* Math.PI / 2, false);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(center, center, radius * 3, i * Math.PI / 2 + Math.PI / 6, (i + 1) * Math.PI / 2, false);
			ctx.stroke();			
		}
		for (var i = 0; i < 12; i ++ ) {
			var outer = 5;
			if (i == 7 || i == 8) continue;
			ctx.moveTo(center + Math.cos(Math.PI / 6 * i) * radius, center + Math.sin(Math.PI / 6 * i) * radius);
			ctx.lineTo(center + Math.cos(Math.PI / 6 * i) * radius * 2,  center + Math.sin(Math.PI / 6 * i) * radius * 2);
		}
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(center, center - radius);			
		ctx.arc(center, center, radius, Math.PI * 1.5, Math.PI, false);	
		ctx.stroke();		
		ctx.restore();		
	},	
	renderTitle: function() {
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
	renderTime: function() {
		ctx.save();
		ctx.translate(center, center);
		ctx.textAlign = 'center';
		//clockwise
		for(var i = 1; i < 7; i++){
			ctx.save();
			ctx.rotate( - Math.PI / 2  + Math.PI / 6 * i);
			ctx.fillText(i + 'am', radius * 1.5, 10);
			ctx.fillText(i + 'pm', radius * (2.5 + i % 3), 10);
			ctx.restore();
		}
		//counter clockwise
		for(var i = 7; i < 12; i++){
			ctx.save();
			ctx.rotate(Math.PI / 6 * ( i - 9));
			if (i < 9) {
				ctx.fillText(i + 'am', -radius * 1.5, -5);
				ctx.fillText(i + 'pm', -radius * (3.5 + (i - 1) % 3), -5);
			} else {
				ctx.fillText(i + 'am', -radius * (2.5 + i % 3), -5);
				ctx.fillText(i + 'pm', -radius * 5.5 , -5);
			}
			ctx.restore();
		}
		//12noon
		ctx.rotate(-Math.PI / 2);
		ctx.fillText('night', radius * 1.5 , 10);
		ctx.fillText('noon', radius * 2.5 , 10);
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
		this.init();
		this.renderPaletteGrids();
		this.renderBackground();
		this.renderCobweb();
		this.renderTitle();
		this.renderDate();
		this.renderTime();
		this.renderArrow();
	},
	renderSector: function (sector, style) {
		dctx.save();
		dctx.translate(center, center);
		dctx.beginPath();
		var inner = sector.cid;
		var outer = inner + 1;
		//var r = sector.rid > 8 ? sector.rid - 12 : sector.rid - 3;
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
		pctx.font = "Bold 20pt Arial";
		pctx.fillText("+", col * grid + grid / 3, row * grid + 35);	
	},
	renderColorWheel: function() {
		pctx.save();
		pctx.translate(center, center);
		for(var i = 0; i < 12; i++) {
			pctx.beginPath();
			var sDgr = i * Math.PI / 6;
			var eDgr = (i + 1) * Math.PI / 6;
			pctx.arc(0, 0, 6 * radius, sDgr, eDgr, false);
			pctx.arc(0, 0, 5 * radius, eDgr, sDgr, true);
			pctx.closePath();
			var grd=ctx.createLinearGradient(5 * radius * Math.cos(sDgr), 5 * radius * Math.sin(sDgr), 6 * radius * Math.cos(eDgr), 6 * radius * Math.sin(eDgr));
			grd.addColorStop(0,this.colors[i]);
			grd.addColorStop(1,this.colors[i+1]?this.colors[i+1]:this.colors[0]);
			pctx.fillStyle = grd; //this.colors[i];
			pctx.fill();		
		}	
		pctx.restore();		
	}
};

var geometryManager = {
	isValidSector: function(cid, rid) {
		if (cid < 1 || cid > 5) return false;
		if (cid == 5) {
			if (!(rid >= -6 && rid <= -4)) return false;
		}
		if (cid == 1) {
			if ((rid >= -6 && rid <= -4)) return false;
		}
		return true;
	},
	isBack: function(r) {
		if (r > radius * 6) return true;
		return false;
	},
	isValidColor: function(r) {
		if ( r >= radius * 5 && r <= radius * 6) return true;
		return false;
	},
	select: function(event) {
		var x = event.clientX;
		var y = event.clientY;
		var rect = canvas.getBoundingClientRect();
		x -= rect.left + center;
		y -= rect.top + center;
		var r = Math.sqrt(x * x + y * y);
		if(!isPalette) {
			var cid = Math.floor( r / radius);
			var rid = Math.floor( Math.atan2(y, x) / Math.PI * 6);
			if (geometryManager.isValidSector(cid, rid))  {
				app.fillSector({'cid': cid, 'rid': rid});
			} else {
				app.showPalette();
			}
		} else {
			if (geometryManager.isBack(r)) {
				app.showPalette();
			} else {
				if (isColor) {
					var row = Math.floor( y / grid);
					var column = Math.floor( x / grid);
					var i  = row * 10 + column - 1;
					if (i < categories.length ) {
						currStyle = i;
					} else {
						app.newCategory();
					}
				} else {
					if (!geometryManager.isValidColor(r)) {
						isColor = false;
						return;
					}
					pctx.save();
					var imageData = pctx.getImageData(x + center, y + center, 1, 1);
					var pixel = imageData.data;
					var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
					var color = '#' + ('0000' + dColor.toString(16)).substr(-6);
					var category = {'style': color, 'note': ''};
					categories.push(category);
					storageManager.saveCategories();
					currStyle = categories.length - 1;
					canvasRender.renderPalette(color, currStyle);
					canvasRender.renderPlusPlatte();
				}
			}
		}
	}
};

Storage.prototype.save = function(key, data) {
	data = typeof data === 'object' ? JSON.stringify(data) : data;
	localStorage.setItem(key, data);
};

Storage.prototype.get = function(key) {
	var data = localStorage.getItem(key);
	try {
		return JSON.parse(data);        
	} catch (e) { 
		return data;
	}
};

var storageManager = {
	saveSectors: function() {
		localStorage.save(dataKey, sectors);
	},
	getSectors: function() {
		sectors = localStorage.get(dataKey);
		sectors = sectors === null ? [] : sectors;
	},
	saveCategories: function() {
		localStorage.save(categoryKey, categories);
	},
	getCategories: function() {
		categories = localStorage.get(categoryKey);
		categories = categories === null ? [{'style': 'white', 'note': 'Clear'}, {'style': 'black', 'note': 'Unknown'}, {'style': 'grey', 'note': 'Sleep'}] : categories;
	},
	saveAll: function() {
		localStorage.save(dataKey, sectors);
		localStorage.save(categoryKey, categories);
	}
}
app.initialize();



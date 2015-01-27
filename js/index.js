var sectors;
var categories;
var status = 0;
var currStyle;
var app = {
	storageManager: new StorageManager,
	canvasRender: canvasRender.getRender(),
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
        this.canvasRender.renderChronodex();
		sectors = this.storageManager.getData();
		sectors = sectors === null? [] : sectors;
		categories = this.storageManager.getCategories();
		categories = categories === null ? [{'style': 'white', 'note': 'Clear'}, {'style': 'black', 'note': 'Unknown'}, {'style': 'grey', 'note': 'Sleep'}] : categories;
		var sector;
		var style;
		for (var i = 0; i < sectors.length; i++ ) {
			sector = sectors[i];
			style = categories[sector.sid].style;
			this.canvasRender.renderSector(sector, style);
		}
		sataus = 0;
		var container = document.getElementById('canvas-container');
		container.addEventListener('click', geometryManager.select, false);
		window.addEventListener('beforeunload', function () {
			app.storageManager.saveData(sectors);
			app.storageManager.saveCategories(categories);
		}, false);
    },
	
	fillSector: function(sector) {
		if (sector && currStyle !== undefined) {
			sector.sid = currStyle;
			this.canvasRender.renderSector(sector, categories[currStyle].style);	
			if (currStyle == 0) {
				sectors.splice(sector);
			} else {						
				sectors.push(sector);
			}
		}
	},
	showPalette: function(){
		if (status == '1') {
			this.canvasRender.showCategoryView(categories);
		} else {
			this.canvasRender.showChronodexView();
		}
	},
	newCategory: function() {
		this.canvasRender.renderColorWheel();
		isColor = true;
	}
};


var size = 500;
var grid = size / 10;
var center = size / 2;
var radius = grid * 0.8;
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
	isPlus: function(x, y){
		var row = Math.floor( y / grid);
		var column = Math.floor( x / grid);
		var i = (row - 3) * 4 + column - 3;
		if( i == categories.length) return true;
		return false;
	},
	getCategory: function(x,y) {
		var row = Math.floor( y / grid);
		var column = Math.floor( x / grid) ;
		var i = (row - 3) * 4 + column - 3;
		if (row >= 3 && row <= 6 && column >=3 && column <= 6 && i < categories.length) return i;
		return null;
	},
	select: function(event) {
		var x = event.clientX;
		var y = event.clientY;
		var rect = app.canvasRender.getBoundingRect();
		x -= rect.left;
		y -= rect.top;
		var cx =  x - center;
		var	cy = y - center;
		var r = Math.sqrt(cx * cx + cy * cy);
		switch (status) {
		case '0': // fill sector
			var cid = Math.floor( r / radius);
			var rid = Math.floor( Math.atan2(cy, cx) / Math.PI * 6);
			if (geometryManager.isValidSector(cid, rid))  {
				app.fillSector({'cid': cid, 'rid': rid});
			} else {
				status = 1;
				app.showPalette();	
			}
			break;
		case '1': //select a category
			var i = geometryManager.getCategory(x, y);
			if (i) { 
				currStyle = i; 	
			} else if (geometryManager.isPlus(x, y)) {
				app.canvasRender.renderColorWheel();
				status = 2;
			} else {
				status = 0;
				app.showPalette();
			}
			break;
		case '2':
			if (geometryManager.isValidColor(r)) {
				var color = app.canvasRender.getPixelColor(x, y);				
				var category = {'style': color, 'note': ''};
				categories.push(category);
				currStyle = category.length - 1;
				status = 1;	
				app.showPalette();
			} 
			if (geometryManager.isBack(r)) {
				status = 0;
				app.showPalette();
			}
			break;
		default:			
			break;
		}
	}
};

app.initialize();



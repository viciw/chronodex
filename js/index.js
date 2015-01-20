var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
		if (navigator.userAgent.match(/(iPhone|iPad|Android)/)) {
			document.addEventListener('deviceready', this.onDeviceReady, false);
		} else {
			app.onDeviceReady();
		}       
    },

    onDeviceReady: function() {
        canvasRender.renderChronodex();
		var container = document.getElementById('canvas-container');
		container.addEventListener('click', this.fillSector, false);
    },
	
	fillSector: function(event) {
		var x = event.clientX;
		var y = event.clientY;
		var rect = canvas.getBoundingClientRect();
		x -= rect.left + center; 
		y -= rect.top + center;
		var r = Math.sqrt(x * x + y * y);
		var inner = Math.floor( r / radius);
		var outer = inner + 1;
		var dgr = Math.atan2(y, x);
		var start = Math.floor( dgr / Math.PI * 6);
		var end = start + 1;
		if (inner < 1 || inner > 5) return;
		if (inner == 5) {
			if (!(start >= -6 && start <= -4)) return;
		}
		if (inner == 1) {
			if ((start >= -6 && start <= -4)) return;
		}
		canvasRender.renderSector(inner, outer, start, end, 'red');
		var h;
		h =  start > 0? start + 3: start + 6;
		if (inner > 1)  hh += 12;
	}
};

var size = 500;
var grid = size / 10;
var center = size / 2;
var radius = grid * 0.8;
var canvas = document.getElementById('chronodex');
var ctx = canvas.getContext('2d');
var decorateCanvas = document.getElementById('decorate');
var dctx= decorateCanvas.getContext('2d');
var canvasRender = {
	init: function() {
		decorateCanvas.width = decorateCanvas.height =  size;
		canvas.width =  canvas.height = size;
	},
	renderBackground: function() {
		dctx.save();
		dctx.strokeStyle = 'lightgrey';
		dctx.setLineDash([7, 5]);
		dctx.beginPath();
		for (var i = 0; i < 11; i++) {
			dctx.moveTo(0, i * grid);
			dctx.lineTo(size, i * grid);
			dctx.moveTo(i * grid, 0);
			dctx.lineTo(i * grid, size);
		}
		dctx.stroke();
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
			ctx.fillText(i + 'am', radius * 1.5, -5);
			ctx.fillText(i + 'pm', radius * (2.5 + (i - 1) % 3), -5);
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
			}ctx.restore();
		}
		//12noon
		ctx.rotate(Math.PI / 2);
		ctx.fillText(12 + 'noon', -radius * 5.5 , -5);
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
		this.renderBackground();
		this.renderCobweb();
		this.renderTitle();
		this.renderDate();
		this.renderTime();
		this.renderArrow();
	},
	renderSector: function (outer, inner, start, end, fillStyle) {
		dctx.save();
		dctx.translate(center, center);
		dctx.beginPath();
		var sDgr = start * Math.PI / 6;
		var eDgr = end * Math.PI / 6;
		dctx.arc(0, 0, outer * radius, sDgr, eDgr, false);
		dctx.arc(0, 0, inner * radius, eDgr, sDgr, true);
		dctx.closePath();
		dctx.fillStyle = fillStyle;
		dctx.fill();
		dctx.restore();
	}	
};

app.initialize();



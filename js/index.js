var app = {
    // Application Constructor
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
		canvasRender.renderSector(250, 250, radius, radius * 2, Math.PI / 2,  Math.PI / 2 + Math.PI / 6, 'grey');
		canvasRender.renderSector(250, 250, radius, radius * 2, Math.PI / 2 + Math.PI / 6,  Math.PI / 2 + Math.PI / 3, 'darkgrey');
		canvasRender.renderSector(250, 250, radius, radius * 2, Math.PI / 2 + Math.PI / 3,  Math.PI, 'lightgrey');
		canvasRender.renderTimes();
    }
};
var size = 500;

var grid = size / 10;
var center = size / 2;
var radius = grid * 0.8;
var canvas = document.querySelector('#chronodex');
var decorateCanvas = document.getElementById('decorate');

		decorateCanvas.width = size;
		decorateCanvas.height = size;		
		canvas.width = size;
		canvas.height = size;
var canvasRender = {
	renderChronodex: function() {
		var ctx = canvas.getContext('2d');
		
		ctx.save();
		ctx.setLineDash([7, 5]);
		ctx.beginPath();
		for (var i = 0; i < 11; i++) {
			ctx.moveTo(0, i * grid);
			ctx.lineTo(size, i * grid);
			ctx.moveTo(i * grid, 0);
			ctx.lineTo(i * grid, size);
		}
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(center, center, radius * 6, Math.PI * 1, Math.PI * 1.5, false);
		ctx.stroke();
		for (var i = 0; i < 4; i++) {
			ctx.beginPath();
			ctx.arc(center, center, radius * 5, i * Math.PI / 2, i * Math.PI / 2 + Math.PI / 3, false);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(center, center, radius * 4, i * Math.PI / 2, i * Math.PI / 2 + Math.PI / 6, false);	
			ctx.stroke();
		}
		for (var i = 0; i < 12; i ++ ) {
			var outer = 5;
			if (i == 8 || i == 7) outer = 6;
			ctx.moveTo(center + Math.cos(Math.PI / 6 * i) * radius * 4, center + Math.sin(Math.PI / 6 * i) * radius * 4);
			ctx.lineTo(center + Math.cos(Math.PI / 6 * i) * radius * outer,  center + Math.sin(Math.PI / 6 * i) * radius * outer);

		}
		ctx.stroke();
		ctx.restore();

		ctx.save();
		ctx.lineWidth = 2;
		ctx.fillStyle = 'rgba(255, 255, 255, 1)';
		var startX;
		var startY;
		for (var i = 0; i < 4; i++) {
			ctx.beginPath();
			startX = center + Math.cos(Math.PI / 2 * i) * radius * 5;
			startY = center + Math.sin(Math.PI / 2 * i) * radius * 5;
			ctx.arc(startX, startY, 10, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.stroke();
		}

		ctx.beginPath();
		for (var i = 0; i < 4; i++) {
			ctx.arc(center, center, radius * 3, i * Math.PI / 2, i * Math.PI / 2 + Math.PI / 6, false);	
			ctx.arc(center, center, radius * 4, i * Math.PI / 2  + Math.PI / 6, i * Math.PI / 2 + Math.PI / 3, false);
			ctx.arc(center, center, radius * 5, i * Math.PI / 2 + Math.PI / 3 , (i + 1 )* Math.PI / 2, false);	
		}
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc(center, center, radius * 2, 0, Math.PI * 2, false);	
		ctx.stroke();
		for (var i = 0; i < 12; i ++ ) {
			var outer = 5;
			if ( i % 3 == 1) outer = 4;
			ctx.moveTo(center + Math.cos(Math.PI / 6 * i) * radius * 2, center + Math.sin(Math.PI / 6 * i) * radius * 2);
			ctx.lineTo(center + Math.cos(Math.PI / 6 * i) * radius * outer,  center + Math.sin(Math.PI / 6 * i) * radius * outer);
		}
		ctx.stroke();		
	
		ctx.restore();
		
		ctx.save();
		ctx.strokeStyle = 'lightgrey';
		ctx.beginPath();
		for (var i = 0; i < 4; i++) {
			ctx.beginPath();
			ctx.arc(center, center, radius * 3, i * Math.PI / 2 + Math.PI / 6, (i + 1) * Math.PI / 2, false);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(center, center, radius * 4, i * Math.PI / 2 + Math.PI / 3 , (i + 1 )* Math.PI / 2, false);
			ctx.stroke();			
		}
		for (var i = 0; i < 12; i ++ ) {
			var outer = 5;
			if (i == 8 || i == 7) continue;
			ctx.moveTo(center + Math.cos(Math.PI / 6 * i) * radius, center + Math.sin(Math.PI / 6 * i) * radius);
			ctx.lineTo(center + Math.cos(Math.PI / 6 * i) * radius * 2,  center + Math.sin(Math.PI / 6 * i) * radius * 2);
		}
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(center, center - radius);			
		ctx.arc(center, center, radius, Math.PI * 1.5, Math.PI, false);	
		ctx.stroke();
		ctx.restore();	
		
		var str = "CHRONODEX";
		var len = str.length, s;
		var angle = Math.PI * 0.45;
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(Math.PI * 1.5);
        ctx.rotate(-1 * (angle / len) / 2);
        for(var n = 0; n < len; n++) {
          ctx.rotate(angle / len);
          ctx.save();
          ctx.translate(0, -1 * radius * 2 + 20);
          s = str[n];
          ctx.fillText(s, 0, 0);
          ctx.restore();
        }		
        ctx.restore();
		
		ctx.save();
		ctx.fillStyle = 'red';
		ctx.beginPath();
		ctx.moveTo(center - radius * 2 - 5, center);
		ctx.lineTo(center - radius * 2 + 10, center - 7);
		ctx.lineTo(center - radius * 2 + 10, center + 7);
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(center - radius * 5 - 22, center);
		ctx.lineTo(center - radius * 5 - 11, center - 7);
		ctx.lineTo(center - radius * 5 - 11, center + 7 );
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(center, center - radius );
		ctx.lineTo(center + 7, center - radius + 10);
		ctx.lineTo(center - 7, center - radius + 10);
		ctx.closePath();
		ctx.fill();
		ctx.restore();		
	},
	renderSector: function (x, y, outerRadius, innerRadius, sDeg, eDeg, fillStyle) {
		var ctx = decorateCanvas.getContext('2d');
		ctx.save();
		ctx.translate(x, y);
		ctx.beginPath();
		ctx.arc(0,0,outerRadius,sDeg, eDeg, false);
		ctx.arc(0,0,innerRadius,eDeg, sDeg, true);
		ctx.closePath();
		ctx.fillStyle = fillStyle;
		ctx.fill();
		ctx.restore();
	},
	renderTimes: function() {
			var ctx = decorateCanvas.getContext('2d');
		for(var i = 0; i < 6; i++){
			ctx.save();
			ctx.translate(250, 250);			
			ctx.rotate( - Math.PI / 2  + Math.PI / 6 * ( i + 1));
			ctx.textAlign = 'center';
			ctx.fillText(i + 1 + ' am', radius * 1.5, -5);
			ctx.restore();
		}
		for(var i = 7; i < 12; i++){
			ctx.save();
			ctx.translate(250, 250);			
			ctx.rotate(Math.PI / 6 * ( i - 9));
			ctx.textAlign = 'center';
			ctx.fillText(i + ' am', -radius * (2.5 + i % 3), -5);
			ctx.restore();
		}
		

	}
};


app.initialize();



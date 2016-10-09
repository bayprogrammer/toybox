var toybox = require('./toybox');

var width = 320;
var height = 200;
var pixel_bytes = 4;
var canvas = document.getElementById('canvas');

toybox.run(canvas, width, height, pixel_bytes);

var toybox = require('./toybox');
var mushrooms = require('./toybox/mushrooms');

var width = 320;
var height = 200;
var pixel_bytes = 4;
var canvas = document.getElementById('canvas');
var shroom = mushrooms[15];

toybox.shader_loop(canvas, width, height, pixel_bytes, shroom);

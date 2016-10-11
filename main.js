var toybox = require('./toybox');
var mushrooms = require('./toybox/mushrooms');
var Display = require('./toybox/display');

var canvas = document.getElementById('canvas');
var display = new Display(canvas, 320, 200);
console.log(display);

//toybox.shader_loop(display, mushrooms[12]);
toybox.apply_shader(display, mushrooms[12]);

var ToyBox = require('./toybox');
var Display = require('./toybox/display');

var mushrooms = require('./toybox/mushrooms');

var canvas = document.getElementById('canvas');
var display = new Display(canvas, 320, 200);
var box = new ToyBox();

window.display = display

display.loop(() => {
    display.apply_shader(mushrooms[12]);
});

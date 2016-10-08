var mushrooms = require('./toybox/mushrooms');
var display = require('./toybox/display');

var toybox = {
    run: function(width, height, pixel_bytes) {
        var canvas = document.getElementById('canvas');
        display.prepare_canvas(canvas, width, height);
        var bitmap = new Uint8ClampedArray(width * height * pixel_bytes);

        var offset_x = 0;
        var offset_y = 0;

        var shroom = mushrooms[15]

        var loop = (timestamp) => {
            if (true) {
                display.draw(bitmap, width, height, pixel_bytes, offset_x, offset_y, shroom);
                display.blit(bitmap, canvas);

                offset_x = (offset_x +1) & 0xFF;
                offset_y = (offset_y +2) & 0xFF;

                window.requestAnimationFrame(loop);
            }
        };

        window.requestAnimationFrame(loop);
    }
};

module.exports = toybox;

var mushrooms = require('./toybox/mushrooms');
var display = require('./toybox/display');

var toybox = {
    run: function(canvas, width, height, pixel_bytes) {
        display.prepare_canvas(canvas, width, height);
        var bitmap = new Uint8ClampedArray(width * height * pixel_bytes);
        var shroom = mushrooms[15];

        var loop = (timestamp) => {
            // TODO(zmd): replace bool literal with means to stop loop
            if (true) {
                display.shade_bitmap(bitmap, width, height, pixel_bytes, shroom);
                display.blit(bitmap, canvas);

                window.requestAnimationFrame(loop);
            }
        };

        window.requestAnimationFrame(loop);
    }
};

module.exports = toybox;

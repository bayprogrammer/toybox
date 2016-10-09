var display = require('./toybox/display');

var toybox = {
    shader_loop: function(canvas, width, height, pixel_bytes, shader) {
        display.prepare_canvas(canvas, width, height);
        var bitmap = new Uint8ClampedArray(width * height * pixel_bytes);

        var loop = (timestamp) => {
            // TODO(zmd): replace bool literal with means to stop loop
            if (true) {
                display.shade_bitmap(bitmap, width, height, pixel_bytes, shader);
                display.blit(bitmap, canvas);

                window.requestAnimationFrame(loop);
            }
        };

        window.requestAnimationFrame(loop);
    }
};

module.exports = toybox;

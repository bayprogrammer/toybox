var toybox = {
    shader_loop: function(display, shader) {
        var loop = (timestamp) => {
            // TODO(zmd): replace bool literal with means to stop loop
            if (true) {
                display.apply_shader(shader);
                display.draw();

                window.requestAnimationFrame(loop);
            }
        };

        window.requestAnimationFrame(loop);
    },

    apply_shader: function(display, shader) {
        display.apply_shader(shader);
        display.draw();
    }
};

module.exports = toybox;

class Display {

    constructor(canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.imageRendering = '-moz-crisp-edges';
        canvas.style.imageRendering = 'pixelated';

        // TODO(zmd): calculate canvas scaling relative to window size
        canvas.style.height = height * 4 + 'px';
        canvas.style.width = width * 4 + 'px';

        // TODO(zmd): handle display border and border color inside display?

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.stride = width * 4;  // 4 bytes per pixel
        this.image_data = this.ctx.getImageData(0, 0, width, height)
        this.backbuffer = this.image_data.data;
        this.backbuffer_dirty = false;
        this.infinite_loop = false;

        // TODO(zmd): use window.setTimeout to ask for frames less frequently
        //     and only when they're needed
        window.setTimeout(() => { this.main_loop() }, 33);
    }

    main_loop(timestamp) {
        // TODO(zmd): mechanism to flush only when backbuffer "dirty"
        //     if this.flush(); { window.requestAnimation... }

        if (this.backbuffer_dirty) {
            window.requestAnimationFrame(() => { this.flush() });
        }

        if (this.infinite_loop) {
            // TODO(zmd): shall we pass any args back to the infinite loop?
            this.infinite_loop();
        }

        window.setTimeout(() => { this.main_loop() }, 33);
    }

    // TODO(zmd): allow registering multiple loops, rather than just one
    loop(callback) {
        this.infinite_loop = callback;
    }

    // TODO(zmd): clear_loop() { }

    flush() {
        this.ctx.putImageData(this.image_data, 0, 0);
        this.backbuffer_dirty = false;
    }

    // TODO(zmd): peek()

    poke(value, addr) {
        // TODO(zmd): allow poking iterable or array?
        this.backbuffer[addr] = value;
        this.backbuffer_dirty = true;
    }

    poke_pixel(pixel, pixel_addr) {
        this.poke(pixel.red,   pixel_addr    );
        this.poke(pixel.green, pixel_addr + 1);
        this.poke(pixel.blue,  pixel_addr + 2);
        this.poke(pixel.alpha, pixel_addr + 3);
    }

    apply_shader(shader) {
        // TODO(zmd): generator or function to process each row and here just
        //     consume the current positions being yeilded? (research)
        for (var y = 0; y < this.height; ++y) {
            var pixel_addr = 0x00;

            // Set address to beginning of current row
            pixel_addr = y * this.stride;

            for (var x = 0; x < this.width; ++x) {
                // TODO(zmd): shader should receive current pixel value, or
                //     perhaps the whole backbuffer, so it can calculate things in
                //     terms of existing backbuffer data
                this.poke_pixel(
                    shader(pixel_addr, x,  y, this.backbuffer.length, this.stride),
                    pixel_addr
                );

                // Move address to next pixel of current row
                pixel_addr += 4;
            }
        }
    }

}

module.exports = Display;

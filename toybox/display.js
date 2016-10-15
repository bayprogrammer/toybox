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
        this.main_loop_speed = 40;

        // TODO(zmd): use window.setTimeout to ask for frames less frequently
        //     and only when they're needed
        window.setTimeout(() => { this.main_loop() }, this.main_loop_speed);
        window.requestAnimationFrame(() => { this.display_loop() });
    }

    // TODO(zmd): mainloop really belongs inside ToyBox (as does loop,
    //     infinite_loop); it should make use of Display's facilities
    main_loop(timestamp) {
        if (this.infinite_loop) {
            // TODO(zmd): shall we pass any args back to the infinite loop?
            this.infinite_loop();
        }

        window.setTimeout(() => { this.main_loop() }, this.main_loop_speed);
    }

    display_loop() {
        if (this.backbuffer_dirty) {
            this.flush();
        }
        window.requestAnimationFrame(() => { this.display_loop() });
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
        this.pokeq(value, addr);
        this.backbuffer_dirty = true;
    }

    pokeq(value, addr) {
        this.backbuffer[addr] = value;
    }

    poke_pixel(pixel, pixel_addr) {
        this.pokeq(pixel, pixel_addr);
        this.backbuffer_dirty = true;
    }

    pokeq_pixel(pixel, pixel_addr) {
        this.pokeq(pixel.red,   pixel_addr    );
        this.pokeq(pixel.green, pixel_addr + 1);
        this.pokeq(pixel.blue,  pixel_addr + 2);
        this.pokeq(pixel.alpha, pixel_addr + 3);
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

        // Don't signal a draw until we've filled up the back buffer
        //this.backbuffer_dirty = true;
    }

}

module.exports = Display;

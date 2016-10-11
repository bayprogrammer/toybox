class Display {

    constructor(canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.imageRendering = '-moz-crisp-edges';
        canvas.style.imageRendering = 'pixelated';

        // TODO: calculate canvas scaling relative to window size
        canvas.style.height = height * 4 + 'px';
        canvas.style.width = width * 4 + 'px';

        //this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.stride = width * 4;  // 4 bytes per pixel
        this.image_data = this.ctx.getImageData(0, 0, width, height)
        //this.backbuffer = new Uint8ClampedArray(width * height * 4);
        this.backbuffer = this.image_data.data;
    }

    // TODO(zmd): flush a better name?
    draw() {
        // TODO(zmd): is it possible to just directly draw the backbuffer? Or
        //     do we really have to instantiate a new ImageData every time?
        //var image = new ImageData(this.backbuffer, this.width, this.height);
        //this.ctx.putImageData(image, 0, 0);
        this.ctx.putImageData(this.image_data, 0, 0);
    }

    // TODO(zmd): are poke and peek really analogious? we're only poking values
    //     into a back buffer, not directly into the "canvas memory"... think
    //     upon this

    // TODO(zmd): peek() ?

    poke(value, addr) {
        this.backbuffer[addr] = value;
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

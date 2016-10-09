var display = {

    prepare_canvas: function (canvas, width, height) {
        canvas.width = width;
        canvas.height = height;

        canvas.style.imageRendering = '-moz-crisp-edges';
        canvas.style.imageRendering = 'pixelated';

        // TODO: calculate canvas scaling relative to window size
        canvas.style.height = height * 4 + 'px';
        canvas.style.width = width * 4 + 'px';
    },

    blit: function (bitmap, canvas) {
        // TODO: any advantage to caching this context in the main function?
        var ctx = canvas.getContext('2d');

        //var image_data = ctx.getImageData(0, 0, width, height);
        //var bitmap = imgdata.data;

        var image_data = new ImageData(bitmap, canvas.width, canvas.height)
        ctx.putImageData(image_data, 0, 0);
    },

    shade_pixel: function() {
        // TODO(zmd)
    },

    shade_bitmap: function (bitmap, width, height, pixel_bytes, shader) {
        var stride = width * pixel_bytes;
        var pixel_addr = 0x00;

        for (var y = 0; y < height; ++y) {

            // Set address to beginning of current row
            pixel_addr = y * stride;

            for (var x = 0; x < width; ++x) {
                pixel_r = pixel_addr;
                pixel_g = pixel_addr + 1;
                pixel_b = pixel_addr + 2;
                pixel_a = pixel_addr + 3;

                pixel = shader(pixel_addr, x,  y, bitmap.length, stride);

                bitmap[pixel_r] = pixel.red;
                bitmap[pixel_g] = pixel.green;
                bitmap[pixel_b] = pixel.blue;
                bitmap[pixel_a] = pixel.alpha;

                // Move address to next pixel of current row
                pixel_addr += pixel_bytes;
            }
        }
    }

};

module.exports = display;

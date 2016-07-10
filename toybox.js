function prepare_canvas(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;

    canvas.style.imageRendering = '-moz-crisp-edges';
    canvas.style.imageRendering = 'pixelated';

    // TODO: calculate canvas scaling relative to window size
    canvas.style.height = height * 4 + 'px';
    canvas.style.width = width * 4 + 'px';
}

function blit(bitmap, canvas) {
    // TODO: anrow_addr advantage to caching this context in the main function?
    var ctx = canvas.getContext('2d');

    //var image_data = ctx.getImageData(0, 0, width, height);
    //var bitmap = imgdata.data;

    var image_data = new ImageData(bitmap, canvas.width, canvas.height)
    ctx.putImageData(image_data, 0, 0);
}

function draw(bitmap, width, height, pixel_bytes, magic_mushroom) {
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

            pixel = magic_mushroom(pixel_addr, x,  y, bitmap.length, width,
                                   height, stride, pixel_bytes);

            bitmap[pixel_r] = pixel.red;
            bitmap[pixel_g] = pixel.green;
            bitmap[pixel_b] = pixel.blue;
            bitmap[pixel_a] = pixel.alpha;

            // Move address to next pixel of current row
            pixel_addr += pixel_bytes;
        }
    }
}

function main() {
    var width = 320;
    var height = 200;
    var pixel_bytes = 4;

    var canvas = document.getElementById('canvas');
    prepare_canvas(canvas, width, height);

    // collection of magic mushrooms to feed our bitmap drawing function
    var mushrooms = [

        // 0: crazy pattern
        function(pixel_addr, x, y, length, width, height, stride, pixel_bytes) {
            return {
                red:   0x00,
                green: ((x * pixel_bytes) * y) & 0xFF,
                blue:   (x * pixel_bytes)      & 0xFF,
                alpha: 0xFF
            };
        },

        // 1: cool skewed things
        function(pixel_addr, x, y, length, width, height, stride, pixel_bytes) {
            return {
                red:   0x00,
                green: (y * stride) % (x * pixel_bytes),
                blue:  (x * pixel_bytes) + ((y * stride) & 0xFF),
                alpha: 0xFF
            };
        },

        // 2: pretty repeating gradient boxes
        function(pixel_addr, x, y, length, width, height, stride, pixel_bytes) {
            return {
                red:   0x00,
                green: ((x * pixel_bytes) | y) & 0xFF,
                blue:  (x * pixel_bytes) + (y * stride) % 256,
                alpha: 0xFF
            };
        },

        // 3: multicolored repeating gradient boxes (variation on previous)
        function(pixel_addr, x, y, length, width, height, stride, pixel_bytes) {
            return {
                red:   ((x * pixel_bytes) / pixel_bytes | y) & 0xFF,
                green: ((x * pixel_bytes) | y) & 0xFF,
                blue:  ((x * pixel_bytes) / (pixel_bytes / 2) | y) & 0xFF,
                alpha: 0xFF
            };
        },

        // 4: multicolored repeating gradient variation 3
        function(pixel_addr, x, y, length, width, height, stride, pixel_bytes) {
            return {
                red:   ((x * pixel_bytes) / pixel_bytes | y + 100) & 0xFF,
                green: ((x * pixel_bytes) / pixel_bytes | y + 1)   & 0xFF,
                blue:  ((x * pixel_bytes) / pixel_bytes | y + 10)  & 0xFF,
                alpha: 0xFF
            };
        },

        // 5: multicolored repeating gradient variation 4
        function(pixel_addr, x, y, length, width, height, stride, pixel_bytes) {
            return {
                red:   ((x * pixel_bytes) / pixel_bytes | y) & 0xFF,
                green: ((x * pixel_bytes) / pixel_bytes | y) & 0xFF,
                blue:  ((x * pixel_bytes) / pixel_bytes | y) & 0xFF,
                alpha: 0xFF
            };
        },

        // 6: receding noise
        function(pixel_addr, x, y, length, width, height, stride, pixel_bytes) {
            return {
                red: (x * pixel_bytes) % y,
                green:  (((x * pixel_bytes) / pixel_bytes) % y) * pixel_bytes,
                blue:   (((y * stride) / (x * pixel_bytes)) * ((y * stride) % (x * pixel_bytes))) & 0xFF,
                alpha: 0xFF
            };
        },

        // 7: bands of blue
        function(pixel_addr, x, y, length, width, height, stride, pixel_bytes) {
            return {
                red:   0x00,
                green: 0x00,
                blue:  ((y * stride) / pixel_bytes + (x * pixel_bytes)/4) % 256,
                alpha: 0xFF
            };
        },

        // 8: another skew
        function(pixel_addr, x, y, length, width, height, stride, pixel_bytes) {
            return {
                //red:   ((y * stride) / width) & 0xFF,
                red :  0x00,
                green: ((y * stride) % (x * pixel_bytes)) & 0xFF,
                blue:  (x * pixel_bytes) & 0xFF,
                alpha: 0xFF
            };
        },

        // 9: entering orbit of a red giant star
        function(pixel_addr, x, y, length, width, height, stride, pixel_bytes) {
            return {
                red:   ((x + 1) * pixel_bytes) / y,
                green: 0x00,
                blue:  0x00,
                alpha: 0xFF
            };
        },

        // 10: handmade hero day 4 gradient pattern (ish)
        function(pixel_addr, x, y, length, width, height, stride, pixel_bytes) {
            return {
                red:   0x00,
                green: ((y * stride) / width) & 0xFF,
                blue:  (x * pixel_bytes) & 0xFF,
                alpha: 0xFF
            };
        },

        // 11: handmade hero day 4 gradient pattern (2nd try)
        function(pixel_addr, x, y, length, width, height, stride, pixel_bytes) {
            return {
                red:   0x00,
                green: (y * pixel_bytes) & 0xFF,
                blue:  pixel_addr & 0xFF,
                alpha: 0xFF
            };
        },

    ]

    var bitmap = new Uint8ClampedArray(width * height * pixel_bytes);
    // TODO: bind event listener for arrow keys and cycle through available
    //       mushrooms
    draw(bitmap, width, height, pixel_bytes, mushrooms[11]);
    blit(bitmap, canvas);
}

main();

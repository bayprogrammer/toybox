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

    // loop over rows
    for (var row_addr = 0; row_addr < bitmap.length; row_addr += stride) {

        // figure out what row we're on
        var row = row_addr / stride;

        // loop through pixels of current row
        for (var col_addr = 0; col_addr < stride; col_addr += pixel_bytes) {
            var col = col_addr / pixel_bytes;
            var pixel_addr = row_addr + col_addr

            // calculate color channel indices
            var r = pixel_addr;
            var g = pixel_addr + 1;
            var b = pixel_addr + 2;
            var a = pixel_addr + 3;

            // run our current state through the magic mushroom we received
            values = magic_mushroom(col_addr, row_addr, pixel_addr, col, row,
                                    bitmap.length, width, height, stride,
                                    pixel_bytes);

            // let's do this!
            bitmap[r] = values.red;
            bitmap[g] = values.green;
            bitmap[b] = values.blue;
            bitmap[a] = values.alpha;
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

        // crazy pattern
        function(col_addr, row_addr, pixel_addr, col, row, length,
                 width, height, stride, pixel_bytes) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.green = (col_addr * row) % 256;
            values.blue  = col_addr % 256;
            return values;
        },

        // cool skewed things
        function(col_addr, row_addr, pixel_addr, col, row, length,
                 width, height, stride, pixel_bytes) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.green = row_addr % col_addr;
            values.blue  = col_addr + row_addr % 256;
            return values;
        },

        // pretty repeating gradient boxes
        function(col_addr, row_addr, pixel_addr, col, row, length,
                 width, height, stride, pixel_bytes) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.green = (col_addr | row) % 256;
            values.blue  = col_addr + row_addr % 256;
            return values;
        },

        // multicolored repeating gradient boxes (variation on previous)
        function(col_addr, row_addr, pixel_addr, col, row, length,
                 width, height, stride, pixel_bytes) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.green = (col_addr | row) % 256;
            values.blue  = (col_addr / (pixel_bytes / 2) | row) % 256;
            values.red   = (col_addr / pixel_bytes | row) % 256;
            return values;
        },

        // multicolored repeating gradient variation 3
        function(col_addr, row_addr, pixel_addr, col, row, length,
                 width, height, stride, pixel_bytes) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.green = (col_addr / pixel_bytes | row + 1)   % 256;
            values.blue  = (col_addr / pixel_bytes | row + 10)  % 256;
            values.red   = (col_addr / pixel_bytes | row + 100) % 256;
            return values;
        },

        // multicolored repeating gradient variation 4
        function(col_addr, row_addr, pixel_addr, col, row, length,
                 width, height, stride, pixel_bytes) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.green = (col_addr / pixel_bytes | row) % 256;
            values.blue  = (col_addr / pixel_bytes | row) % 256;
            values.red   = (col_addr / pixel_bytes | row) % 256;
            return values;
        },

        // receding noise
        function(col_addr, row_addr, pixel_addr, col, row, length,
                 width, height, stride, pixel_bytes) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.green = col_addr % row;
            values.blue  = ((col_addr / pixel_bytes) % row) * pixel_bytes
            values.red   = ((row_addr / col_addr) * (row_addr % col_addr)) % 256;
            return values;
        },

        // bands of blue
        function(col_addr, row_addr, pixel_addr, col, row, length,
                 width, height, stride, pixel_bytes) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.blue = (row_addr / pixel_bytes + col_addr/4) % 256;
            return values;
        },

        // another skew
        function(col_addr, row_addr, pixel_addr, col, row, length,
                 width, height, stride, pixel_bytes) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.red   = (row_addr / width) % 256;
            values.green = (row_addr % col_addr) % 256;
            values.blue  = col_addr % 256;
            return values;
        },

        // entering orbit of a red giant star
        function(col_addr, row_addr, pixel_addr, col, row, length,
                 width, height, stride, pixel_bytes) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.red = col_addr / row;
            return values;
        },

        // handmade hero day 4 gradient pattern (ish)
        function(col_addr, row_addr, pixel_addr, col, row, length,
                 width, height, stride, pixel_bytes) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.green = (row_addr / width) % 256;
            values.blue  = col_addr % 256;
            return values;
        },

    ]

    var bitmap = new Uint8ClampedArray(width * height * pixel_bytes);
    // TODO: bind event listener for arrow keys and cycle through available
    //       mushrooms
    draw(bitmap, width, height, pixel_bytes, mushrooms[10]);
    blit(bitmap, canvas);
}

main();

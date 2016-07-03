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
    // TODO: any advantage to caching this context in the main function?
    var ctx = canvas.getContext('2d');

    //var image_data = ctx.getImageData(0, 0, width, height);
    //var bitmap = imgdata.data;

    var image_data = new ImageData(bitmap, canvas.width, canvas.height)
    ctx.putImageData(image_data, 0, 0);
}

function draw(bitmap, width, height, pixel_bytes, magic_mushroom) {

    // loop over rows
    for (var y = 0; y < bitmap.length; y += width * pixel_bytes) {

        // figure out what row we're on
        var row = y / (width * pixel_bytes);

        // loop through pixels of current row
        for (var x = 0; x < width * pixel_bytes; x += pixel_bytes) {

            // calculate color channel indices
            var r = y + x;
            var g = y + x + 1;
            var b = y + x + 2;
            var a = y + x + 3;

            // run our current state through the magic mushroom we received
            values = magic_mushroom(x, y, row, bitmap.length, width, height,
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
        function(x, y, row, bitmap_length, width, height, bytes_per_pixel) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.green = (x * row) % 256;
            values.blue = x % 256;
            return values;
        },

        // cool skewed things
        function(x, y, row, bitmap_length, width, height, bytes_per_pixel) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.green = y % x;
            values.blue = x + y % 256;
            return values;
        },

        // pretty repeating gradient boxes
        function(x, y, row, bitmap_length, width, height, bytes_per_pixel) {
            var values = {red: 0x00, green: 0x00, blue: 0x00, alpha: 0xFF }
            values.green = (x | row) % 256;
            values.blue = x + y % 256;
            return values;
        },

    ]

    var bitmap = new Uint8ClampedArray(width * height * pixel_bytes);
    // TODO: bind event listener for arrow keys and cycle through available
    //       mushrooms
    draw(bitmap, width, height, pixel_bytes, mushrooms[2]);
    blit(bitmap, canvas);
}

main();

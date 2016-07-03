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

function draw(bitmap, width, height, bytes_per_pixel) {
    for (var i = 0; i < bitmap.length; i += bytes_per_pixel) {
        if (i % 8 == 0) {
            bitmap[i + 0] = 0xA5;  // r
            bitmap[i + 1] = 0xA5;  // g
            bitmap[i + 2] = 0xFF;  // b
            bitmap[i + 3] = 0xFF;  // a
        }
    }
}

function main() {
    var width = 320;
    var height = 200;
    var bytes_per_pixel = 4;

    var canvas = document.getElementById('canvas');
    prepare_canvas(canvas, width, height);

    // 4 bytes per pixel: RR GG BB AA
    var bitmap = new Uint8ClampedArray(width * height * bytes_per_pixel);

    draw(bitmap, width, height, bytes_per_pixel);

    blit(bitmap, canvas);
}

main();

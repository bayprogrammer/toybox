// collection of magic mushrooms (shaders) that can be used with toybox
var pixel_bytes = 4;

function with_offset(shader) {
    var offset_x = 0;
    var offset_y = 0;

    return (pixel_addr, x, y, length, stride) => {
        var pixel = shader(pixel_addr, x, y, length, stride, offset_x, offset_y);

        // increment offsets after computing the last pixel
        if (pixel_addr == 0x00) {
            offset_x = (offset_x + 4) & 0xFF;
            offset_y = (offset_y + 8) & 0xFF;
        }

        //for (var i = 0; i < 10; i++) {}

        return pixel;
    };
}

var mushrooms = [

    // 0: crazy pattern
    (pixel_addr, x, y, length, stride) => {
        return {
            red:   0x00,
            green: ((x * pixel_bytes) * y) & 0xFF,
            blue:   (x * pixel_bytes)      & 0xFF,
            alpha: 0xFF
        };
    },

    // 1: cool skewed things
    (pixel_addr, x, y, length, stride) => {
        return {
            red:   0x00,
            green: (y * stride) % (x * pixel_bytes),
            blue:  (x * pixel_bytes) + ((y * stride) & 0xFF),
            alpha: 0xFF
        };
    },

    // 2: pretty repeating gradient boxes
    (pixel_addr, x, y, length, stride) => {
        return {
            red:   0x00,
            green: ((x * pixel_bytes) | y) & 0xFF,
            blue:  (x * pixel_bytes) + (y * stride) % 256,
            alpha: 0xFF
        };
    },

    // 3: multicolored repeating gradient boxes (variation on previous)
    (pixel_addr, x, y, length, stride) => {
        return {
            red:   ((x * pixel_bytes) / pixel_bytes | y) & 0xFF,
            green: ((x * pixel_bytes) | y) & 0xFF,
            blue:  ((x * pixel_bytes) / (pixel_bytes / 2) | y) & 0xFF,
            alpha: 0xFF
        };
    },

    // 4: multicolored repeating gradient variation 3
    (pixel_addr, x, y, length, stride) => {
        return {
            red:   ((x * pixel_bytes) / pixel_bytes | y + 100) & 0xFF,
            green: ((x * pixel_bytes) / pixel_bytes | y + 1)   & 0xFF,
            blue:  ((x * pixel_bytes) / pixel_bytes | y + 10)  & 0xFF,
            alpha: 0xFF
        };
    },

    // 5: multicolored repeating gradient variation 4
    (pixel_addr, x, y, length, stride) => {
        return {
            red:   ((x * pixel_bytes) / pixel_bytes | y) & 0xFF,
            green: ((x * pixel_bytes) / pixel_bytes | y) & 0xFF,
            blue:  ((x * pixel_bytes) / pixel_bytes | y) & 0xFF,
            alpha: 0xFF
        };
    },

    // 6: receding noise
    (pixel_addr, x, y, length, stride) => {
        return {
            red: (x * pixel_bytes) % y,
            green:  (((x * pixel_bytes) / pixel_bytes) % y) * pixel_bytes,
            blue:   (((y * stride) / (x * pixel_bytes)) * ((y * stride) % (x * pixel_bytes))) & 0xFF,
            alpha: 0xFF
        };
    },

    // 7: bands of blue
    (pixel_addr, x, y, length, stride) => {
        return {
            red:   0x00,
            green: 0x00,
            blue:  ((y * stride) / pixel_bytes + (x * pixel_bytes)/4) % 256,
            alpha: 0xFF
        };
    },

    // 8: another skew
    (pixel_addr, x, y, length, stride) => {
        return {
            //red:   ((y * stride) / width) & 0xFF,
            red :  0x00,
            green: ((y * stride) % (x * pixel_bytes)) & 0xFF,
            blue:  (x * pixel_bytes) & 0xFF,
            alpha: 0xFF
        };
    },

    // 9: entering orbit of a red giant star
    (pixel_addr, x, y, length, stride) => {
        return {
            red:   ((x + 1) * pixel_bytes) / y,
            green: 0x00,
            blue:  0x00,
            alpha: 0xFF
        };
    },

    // 10: handmade hero day 4 gradient pattern (ish)
    (pixel_addr, x, y, length, stride) => {
        var width = stride / 4;
        return {
            red:   0x00,
            green: ((y * stride) / width) & 0xFF,
            blue:  (x * pixel_bytes) & 0xFF,
            alpha: 0xFF
        };
    },

    // 11: handmade hero day 4 gradient pattern (2nd try, more like
    // muratori's -- scaling based on constant to make up for smaller
    // canvas used here)
    (pixel_addr, x, y, length, stride) => {
        return {
            red:   0x00,
            green: (x * 4) & 0xFF,
            blue:  (y * 4) & 0xFF,
            alpha: 0xFF
        };
    },

    // 12: looping green gradient
    with_offset((pixel_addr, x, y, length, stride, offset_x, offset_y) => {
        return {
            red:   0x00,
            green: ((x + offset_x) * 4) & 0xFF,
            blue:  ((y + offset_y) * 4) & 0xFF,
            alpha: 0xFF
        };
    }),

    // 13: cool skewed things (animated)
    with_offset((pixel_addr, x, y, length, stride, offset_x, offset_y) => {
        return {
            red:   offset_x & offset_y,
            green: ((offset_x + y) * 400) % ((offset_x + x)),
            blue:  offset_y,
            alpha: 0xFF
        };
    }),

    // 14: looping accordion gradient!
    with_offset((pixel_addr, x, y, length, stride, offset_x, offset_y) => {
        return {
            red:   0x00,
            green: (x * 4) % offset_y & 0xFF,
            blue:  ((offset_x + y) * 4) & 0xFF,
            alpha: 0xFF
        };
    }),

    // 15: Gone to Plaid by Stephan
    with_offset((pixel_addr, x, y, length, stride, offset_x, offset_y) => {
        return {
            red:   (Math.sin(x) + 1) / 2 * 255 + offset_x & 0xFF,
            green: (Math.cos(y) + 1) / 2 * 255 + offset_y & 0xFF,
            blue:  (Math.cos(y) + 1) / 2 * 255 - offset_y & 0xFF,
            alpha: 0xFF
        };
    }),

    // 16: Dizzy Still by Stephan
    (pixel_addr, x, y, length, stride) => {
        return {
            red: Math.sqrt(Math.pow(100 - y, 2) + Math.pow(100 - x, 2)) & 0xFF,
            green: Math.sqrt(Math.pow(150 - y, 2) + Math.pow(150 - x, 2)) & 0xFF,
            blue: 0x80,
            alpha: 0xFF
        };
    },

    // 17: Dizzy 2 by Stephan
    with_offset((pixel_addr, x, y, length, stride, offset_x, offset_y) => {
        var height = length / stride;
        var width = stride / 4;

        return {
            red:   Math.sqrt(Math.pow(Math.cos(offset_x)*50 + height/2 - y, 2) + Math.pow(Math.sin(offset_x)*50 + width/2 - x, 2)) & 0xFF,
            green: Math.sqrt(Math.pow(Math.cos(offset_x) + height/2 - y, 2) + Math.pow(Math.sin(offset_x) + width/2 - x, 2)) & 0xFF,
            blue:  0x80,
            alpha: 0xFF
        };
    }),

];

module.exports = mushrooms;

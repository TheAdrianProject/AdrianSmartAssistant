class Channel {
    setBrightness(value) {}
    render(data) {}
    reset() {}
}

var ws281x = {
    RGB: 'rgb',
    BGR: 'bgr',
    GRB: 'grb',

    init: function(numLeds, options) {
        return new Channel();
    },

    init_: function() {}
};


// TOP-LEVEL

var channel = ws281x.init({
    // the channel-number (0 or 1)
    channel: 0,

    // number of leds
    numLeds: 100,

    // color-correction: if a value other than 1 is specified, will apply a
    // gamma-correction before data is sent
    gamma: 1 / 0.45,

    // color-format: specifies the output data-format (bit-ordering for the
    // pwm-signal) to be used.
    colorFormat: ws281x.RGB,

    // data-format: specifies the input data-format to be used:
    //  - UINT32: format 0x00rrggbb
    //  - UINT8_RGBA: 4 byte per pixel, format [0xrr, 0xgg, 0xbb, 0xaa]
    //  - UINT8: 3 byte per pixel, format [0xrr, 0xgg, 0xbb]
    dataFormat: ws281x.UINT32,

    // DMA and PWM settings (these have default-values per channel)
    gpio: ws281x.GPIO_PWM0, dma: ws281x.DMA_PWM0,

    //
    freq: 800,

    //
    invert: false
});

channel.setBrightness(1);

// option 1: a data-array is automatically created
channel.data[13] = 0xffeedd;
channel.render();

// option 2:
var data = new Uint32Array(100);
channel.render(data);
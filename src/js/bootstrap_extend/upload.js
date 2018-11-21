class Upload {
    constructor(element, options) {

    }
}

Upload.VERSION = '1.0.0';
Upload.TRANSITION_DURATION = 150;
Upload.DEFAULTS = {
    toggle: true
}

// Upload PLUGIN DEFINITION
// ==========================

function Plugin(option) {
    return this.each(function () {
        let $this = $(this);
        let data = $this.data('bs.upload');
        let options = $.extend({}, Upload.DEFAULTS, $this.data(), typeof option == 'object' && option);

        //if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
        if (!data) $this.data('bs.upload', (data = new Upload(this, options)));
        if (typeof option == 'string') data[option]();
    })
}

var old = $.fn.upload;

$.fn.upload = Plugin;
$.fn.upload.Constructor = Upload;

$.fn.select.noConflict = function () {
    $.fn.upload = old;
    return this;
}

$(document)
    .on('change.bs.upload.data-api', '[data-upload="input"]', function (e) {
        console.log(e)
    })


export default Upload;
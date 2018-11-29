class Loading {
    constructor(options) {
        this.options = $.extend({}, Loading.DEFAULTS, typeof options == 'object' && options);
        this.$element = $(this.options.template);
        this.$text = this.$element.find(this.options.text);
    }

    init() {
        if (this.options.message) {
            this.$text.text(this.options.message);
        }
        $('body').append(this.$element);
        return this;
    }

    show() {
        this.$element.show();
    }

    hide() {
        this.$element.hide();
    }

    destroy() {
        this.$element.remove();
    }
}

Loading.VERSION = '1.0.0';
Loading.DEFAULTS = {
    template: ' <div class="be-spin-nested-loading" data-loading="loading">\
        <div>\
            <div class="be-spin be-spin-spinning be-spin-show-text">\
                <span class="be-spin-dot be-spin-dot-spin"><i></i><i></i><i></i><i></i></span>\
                <div class="be-spin-text">\
                Loading...\
                </div>\
            </div>\
        </div>\
    </div>',
    text: ".be-spin-text"
}

function Plugin(option) {
    return new Loading(option).init();
}
$.extend({
    beLoading: Plugin
})

export default Loading;


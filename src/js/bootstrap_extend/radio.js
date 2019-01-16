class Radio {
    constructor(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Radio.DEFAULTS, options);
        this.$current = null;
        this.result = null;
        this.init();
        this.bindEvent();
    }
    init() {
        let _this = this;
        let $radioes = _this.$element.find(`${this.options.radio}.checked`);
        $radioes.each(function () {
            _this.result = $(this).data('value');
            _this.$current = $(this);
        })
    }
    bindEvent() {
        var _this = this;
        _this.$element.off('click');
        _this.$element.on('click', this.options.radio, function (e) {
            _this.$current = $(this);
            if (_this.$current.hasClass('disabled')) return false;
            _this.result = _this.$current.data('value');
            _this.check.call(_this);
            e.preventDefault();
            e.stopPropagation();
        })
    }
    check() {
        let $radioes = this.$element.find(this.options.radio);
        $radioes.removeClass('checked');
        this.$current && this.$current.addClass('checked');
        let changeEvent = $.Event('changed.bs.radio', {
            value: this.result,
            el: this.$current
        });
        this.$element.trigger(changeEvent);
    }

    select(value) {
        var $current = this.$element.find(`${this.options.radio}[data-value="${value}"]`);
        if ($current.length) {
            this.$current = $current;
            this.result = value;
        }else{
            this.$current = null;
            this.result = null;
        }
        this.check();
    }

    disable() {
        let $radioes = this.$element.find(this.options.radio);
        $radioes.addClass('disabled');
    }

    enable() {
        let $radioes = this.$element.find(this.options.radio);
        $radioes.removeClass('disabled');
    }
}

Radio.VERSION = '1.0.0';
Radio.DEFAULTS = {
    init: true,
    radio: '.be-radio-input'
}

// Radio PLUGIN DEFINITION
// ==========================

function Plugin(option, value) {
    return this.each(function () {
        let $this = $(this);
        let data = $this.data('bs.radio');
        let options = $.extend({}, Radio.DEFAULTS, data, typeof option == 'object' && option);
        if (!data && options.init && /select|disable|enable/.test(option)) options.init = false;
        if (!data) $this.data('bs.radio', (data = new Radio(this, options)));
        if (typeof option == 'string') data[option](value);
    })
}

var old = $.fn.radio;
$.fn.radio = Plugin;
$.fn.radio.Constructor = Radio;

$.fn.radio.noConflict = function () {
    $.fn.radio = old;
    return this;
}

$(document).on('click.bs.radio.data-api', '[data-radio="radio"]', function (e) {
    var $this = $(this);
    Plugin.call($this);
    if ($(e.target).is('.be-radio-input')) {
        $(e.target).trigger('click');
    }
})

export default Radio;
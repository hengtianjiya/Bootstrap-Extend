class CheckBox {
    constructor(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, CheckBox.DEFAULTS, options);
        this.result = [];
        this.init();
        this.bindEvent();
    }
    init() {
        let _this = this;
        let $checked = _this.$element.find(`${this.options.checkbox}.checked`);
        $checked.each(function () {
            _this.result.push($(this).data('value'));
        })
    }
    bindEvent() {
        var _this = this;
        _this.$element.off('click');
        _this.$element.on('click', this.options.checkbox, function (e) {
            _this.$current = $(this);
            if (_this.$current.hasClass('disabled')) return false;
            var value = _this.$current.data('value');
            var idx = _this.result.indexOf(value);
            if (idx > -1) {
                _this.result.splice(idx, 1);
            } else {
                _this.result.push(value);
            }

            _this.check.call(_this);
            e.preventDefault();
            e.stopPropagation();
        })
    }
    check() {
        let _this = this;
        let $checkboxes = this.$element.find(this.options.checkbox);
        $checkboxes.each(function () {
            let value = $(this).data('value');
            if (_this.result.includes(value)) {
                $(this).addClass('checked');
            } else {
                $(this).removeClass('checked');
            }
        })
        let changeEvent = $.Event('changed.bs.checkbox', {
            value: _this.result
        });
        this.$element.trigger(changeEvent);
    }

    select(valueArr) {
        if (valueArr.length) {
            this.result = valueArr;
            this.check();
        }
    }

    disable() {
        let $checkboxes = this.$element.find(this.options.checkbox);
        $checkboxes.addClass('disabled');
    }

    enable() {
        let $checkboxes = this.$element.find(this.options.checkbox);
        $checkboxes.removeClass('disabled');
    }
}

CheckBox.VERSION = '1.0.0';
CheckBox.DEFAULTS = {
    init: true,
    checkbox: '.be-checkbox-input'
}

// Radio PLUGIN DEFINITION
// ==========================

function Plugin(option, value) {
    return this.each(function () {
        let $this = $(this);
        let data = $this.data('bs.checkbox');
        let options = $.extend({}, CheckBox.DEFAULTS, data, typeof option == 'object' && option);
        if (!data && options.init && /select|disable|enable/.test(option)) options.init = false;
        if (!data) $this.data('bs.checkbox', (data = new CheckBox(this, options)));
        if (typeof option == 'string') data[option](value);
    })
}

var old = $.fn.checkbox;
$.fn.checkbox = Plugin;
$.fn.checkbox.Constructor = CheckBox;

$.fn.checkbox.noConflict = function () {
    $.fn.checkbox = old;
    return this;
}

$(document).on('click.bs.checkbox.data-api', '[data-checkbox="checkbox"]', function (e) {
    var $this = $(this);
    Plugin.call($this);
    if ($(e.target).is('.be-checkbox-input')) {
        $(e.target).trigger('click');
    }
})

export default CheckBox;
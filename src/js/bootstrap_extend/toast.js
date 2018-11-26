import { clearTimeout } from "timers";

class Toast {
    constructor(options, type) {
        var option = typeof options == 'object' ? options : false;
        this.options = $.extend({}, Toast.DEFAULTS, option ? option : {});
        this.options.message = option ? options.message : options;
        this.$element = $(this.options.template);
        this.$message = $(this.options.toast_content);
        this.type = typeof type == 'string' ? type : '';
        this.classType = this.type ? `alert-${this.type}` : 'alert-danger';
        this.timer = null;
        this.init();
    }

    init() {
        this.$element.addClass(this.classType);
        if (this.options.close_show) {
            this.$element.append(this.options.close_btn);
        }
        this.$message.append(this.options.message);
        this.$element.append(this.$message);
        $('body').append(this.$element);
        this.bindEvent();
        let _this = this;
        if (this.options.auto_close) {
            this.timer = setTimeout(() => {
                this.$element.alert('close');
            }, this.options.duration);
        }
    }

    bindEvent() {
        let _this = this;
        this.$element.off('close.bs.alert');
        this.$element.on('close.bs.alert', function () {
            _this.timer = null;
        })
        this.$element.off('closed.bs.alert');
        this.$element.on('closed.bs.alert', function () {
            if (_this.timer) {
                clearTimeout(_this.timer);
            }
            _this.$element.remove();
        })
    }
}

Toast.VERSION = '1.0.0';

Toast.DEFAULTS = {
    template: '<div class="be-alert alert alert-dismissible fadeIn animated faster fade in" role="alert"></div>',
    close_btn: '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>',
    toast_content: '<div class="alert-content"></div>',
    duration: 2000,
    close_show: true,
    auto_close: true
}

function Plugin(option) {
    return new Toast(option, this.type);
}

let type = ['success', 'danger', 'warning'];

type.forEach(function (v) {
    $.extend({
        [`beToast_${v}`]: Plugin.bind({ type: v })
    })
})
$.extend({
    beToast: Plugin
})

export default Toast;
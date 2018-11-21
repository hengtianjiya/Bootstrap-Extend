class Upload {
    constructor(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Upload.DEFAULTS, options);
        this.$trigger = this.$element.find('[data-upload="input"]');
        this.$hint = this.$element.find('.be-upload-hint-wrapper');
        this.$result = this.$element.find('.be-upload-result-wrapper');
        this.transitioning = null;
        this.fileFilter = null;
        this.fileLen = 0;
        this.index = 0;
        this.preupload();
    }

    preupload() {
        if (!window.FileReader) {
            this.traditionUpload();
        } else {
            this.upload();
        }
    }

    traditionUpload() {

    }

    upload() {
        console.log(this.options.e.target.files)
        let _this = this;
        let arr = [];
        let file = arr.concat(_this.filter(_this.options.e.target.files));
        this.fileFilter = file;
        this.fileLen = file.length;
        this.readFile();
    }

    readFile() {
        let _this = this;
        let file = _this.fileFilter[_this.index];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (e) {
                file.timeStamp = e.timeStamp;
                file.result = e.target.result;
                _this.$element.trigger($.Event('onread.bs.upload', {
                    file: file,
                    ele: _this.$element
                }))
                _this.index++;
                _this.readFile.call(_this);
            }
            reader.readAsDataURL(file);
        }
    }

    filter(file) {
        let arrFiles = [];
        for (let item of file) {
            if (this.formatRegExp(item.name)) {
                if (item.size > this.options.max_image_size) {
                    this.$element.trigger($.Event('loaderror.bs.upload', {
                        errorMessage: '您上传的文件太大了！'
                    }))
                } else {
                    arrFiles.push(item);
                }
            } else {
                this.$element.trigger($.Event('loaderror.bs.upload', {
                    errorMessage: '您上传文件的格式不符合规则哦！'
                }))
            }
        }
        return arrFiles;
    }

    formatRegExp(name) {
        return new RegExp('\.(' + this.options.format + ')$', 'i').test(name);
    }

}

Upload.VERSION = '1.0.0';
Upload.TRANSITION_DURATION = 150;
Upload.DEFAULTS = {
    format: 'jpg|jpeg|png|gif|rar|zip|doc|docx|xls|xlsx|ppt|pptx|pdf',
    max_image_size: 2 * 1024 * 1024,
    url: ''

}

// Upload PLUGIN DEFINITION
// ==========================

function Plugin(option, e) {
    return this.each(function () {
        let $this = $(this);
        let data = $this.data('bs.upload');
        let options = $.extend({}, Upload.DEFAULTS, $this.data(), typeof option == 'object' && option);
        options.e = e;
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
        var $this = $(this);
        if (!$this.attr('data-target')) e.preventDefault();
        var $target = $.beGetParent($this);
        var data = $target.data('bs.upload');
        var option = data ? 'preupload' : $this.data();
        Plugin.call($target, option, e);
    })


export default Upload;
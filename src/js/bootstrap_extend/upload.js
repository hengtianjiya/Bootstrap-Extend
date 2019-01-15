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
        this.$element.trigger($.Event('process.bs.upload', {
            ele: this.$element
        }))
        if (!window.FileReader) {
            this.traditionUpload();
        } else {
            this.upload();
        }
    }

    traditionUpload() {
        let _this = this;
        let _name = _this.options.name;
        let _url = _this.options.url;
        let $iframe = $(`<iframe name="${_name}" />`);
        let $form = $(`<form method="post" style="display:none" target="${_name}" action="${_url}" name="form_${_name}" enctype="multipart/form-data" />`);
        var csrf_token = $('meta[name="csrf-token"]');
        if(csrf_token.length){
            $(`<input type="hidden" name="_token" value="${csrf_token.attr('content')}">`).appendTo($form);
        }

        _this.$trigger.appendTo($form);
        $(document.body).append($iframe).append($form);
        let formatResult = _this.formatRegExp(_this.$trigger.val());

        if (formatResult) {
            $form.submit();
            _this.$trigger.val('');
        } else {
            _this.$element.trigger($.Event('loaderror.bs.upload', {
                errorMessage: '您上传文件的格式不符合规则哦！'
            }))
            _this.$trigger.appendTo(_this.$element);
            _this.$trigger.val('');
            $iframe.remove();
            $form.remove();
        }

        $iframe.load(function () {
            let data = $(this).contents().find('body').html();
            _this.$trigger.appendTo(_this.$element);
            $iframe.remove();
            $form.remove();

            _this.$element.trigger($.Event('success.bs.upload', {
                responseData: $.parseJSON(data),
                ele: _this.$element
            }))
        })
    }

    upload() {
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
                _this.processUpload(file);
                _this.index++;
                _this.readFile.call(_this);
            }
            reader.readAsDataURL(file);
        }
    }

    processUpload(file) {
        let _this = this;
        let xhr = new XMLHttpRequest();
        let formData = new FormData();
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', function (e) {
                var progress = Math.round(e.loaded / e.total * 100);
                _this.$element.trigger($.Event('onprogress.bs.upload', {
                    file: file,
                    progress: progress,
                    ele: _this.$element
                }))
            }, false);

            xhr.onreadystatechange = function (e) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        _this.$element.trigger($.Event('success.bs.upload', {
                            file: file,
                            responseData: $.parseJSON(xhr.responseText),
                            ele: _this.$element
                        }))
                    }
                    _this.fileLen--;
                    if (_this.fileLen <= 0) {
                        _this.$element.trigger($.Event('complete.bs.upload', {
                            file: file,
                            ele: _this.$element
                        }))
                        _this.fileLen = [];
                        _this.index = 0;
                        _this.$trigger.val('');
                    } else {
                        _this.$element.trigger($.Event('failure.bs.upload', {
                            file: file,
                            ele: _this.$element
                        }))
                        _this.fileLen = [];
                        _this.index = 0;
                        _this.$trigger.val('');
                    }
                };
            };
            formData.append("file", file);
            formData.append("file", file);
            xhr.open("POST", _this.options.url, true);

            var csrf_token = $('meta[name="csrf-token"]');
            if(csrf_token.length){
                xhr.setRequestHeader('X-CSRF-TOKEN', csrf_token.attr('content'))
            }
            
            xhr.send(formData);
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

$.fn.upload.noConflict = function () {
    $.fn.upload = old;
    return this;
}
console.log(111);
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
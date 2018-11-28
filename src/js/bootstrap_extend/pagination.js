class Pagination {
    constructor(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Pagination.DEFAULTS, options);
        this.total = parseInt(this.options.total);
        this.size = parseInt(this.options.size);
        this.current = parseInt(this.options.current);
        this.lengthMid = Math.floor(this.options.itemLength / 2);
        this.$prev = this.$element.find(this.options.prev);
        this.$next = this.$element.find(this.options.next);
        this.$select = this.$element.find(this.options.select);
        this.$input = this.$element.find(this.options.input);
        this.$itemWrap = this.$element.find(this.options.itemWrap);
        this.$jumpPrev = this.$element.find(this.options.jumpPrev);
        this.$jumpNext = this.$element.find(this.options.jumpNext);
        this.$first = this.$element.find(this.options.first);
        this.$last = this.$element.find(this.options.last);
        this.init();
        this.bindEvent();
    }

    init() {
        var min, max;
        this.page = Math.ceil(this.total / this.size);
        if (this.page <= 2) {
            min = max = 0;
            this.jumpPrevShow = this.jumpNextShow = this.prevShow = this.nextShow = this.itemWarpShow = this.selectShow = this.inputShow = false;
            if (this.page == 1) {
                this.lastShow = false;
            } else {
                this.lastShow = true;
            }
        } else if (this.page > 2 && this.page <= this.options.itemLength + 2) {
            min = 2;
            max = this.page - 1;
            this.jumpPrevShow = this.jumpNextShow = false;
            this.lastShow = this.selectShow = this.itemWarpShow = this.inputShow = true;
            this.prevShow = this.current == 1 ? false : true;
            this.nextShow = this.current == this.page ? false : true;
        } else {
            if (this.current - this.lengthMid <= 2) {                min = 2;
                max = min + this.options.itemLength - 1;
                this.jumpPrevShow = false;
            } else {
                min = this.current - this.lengthMid;
                this.jumpPrevShow = true;
            }

            if (this.current + this.lengthMid >= this.page - 1) {
                max = this.page - 1;
                min = max - this.options.itemLength + 1;
                this.jumpNextShow = false;
            } else {
                max = max ? max : this.current + this.lengthMid;
                this.jumpNextShow = true;
            }
            this.lastShow = this.selectShow = this.itemWarpShow = this.inputShow = true;
            this.prevShow = this.current == 1 ? false : true;
            this.nextShow = this.current == this.page ? false : true;

        }

        this.min = min;
        this.max = max;
        this.checkStatus();
        this.generateItem();
    }

    checkStatus() {
        //this.jumpPrevShow  this.jumpNextShow  this.prevShow  this.nextShow  this.itemWarpShow  this.selectShow  this.inputShow  this.lastShow
        this.$last.toggle(this.lastShow);
        this.setpage(this.$first, 1);
        if (this.lastShow) {
            this.setpage(this.$last, this.page);
        }
        this.$jumpPrev.toggle(this.jumpPrevShow);
        this.$jumpNext.toggle(this.jumpNextShow);
        this.$prev
            .attr('aria-disabled', !this.prevShow)
            .toggleClass('be-pagination-disabled', !this.prevShow);
        this.$next
            .attr('aria-disabled', !this.nextShow)
            .toggleClass('be-pagination-disabled', !this.nextShow);
        this.$itemWrap.toggle(this.itemWarpShow);
        this.$select.toggle(this.selectShow);
        this.$input.toggle(this.inputShow);
    }

    generateItem() {
        this.$itemWrap.find('ul').html('');
        for (var i = this.min; i <= this.max; i++) {
            var $item = $(this.options.itemTemplate);
            var $result = this.setpage($item, i);
            this.$itemWrap.find('ul').append($result);
        }
    }

    setpage(el, page) {
        el
            .attr('title', page)
            .text(page);
        if (page == this.current) {
            this.$element.find('li').removeClass('active');
            el.addClass('active');
        }
        return el;
    }

    bindEvent() {
        let _this = this;
        _this.$prev.off();
        _this.$prev.on('click', function (e) {
            if($(this).attr('aria-disabled') == 'true') return false;
            change(_this.current - 1, _this, e);
        })
        _this.$next.off();
        _this.$next.on('click', function (e) {
            if($(this).attr('aria-disabled') == 'true') return false; 
            change(_this.current + 1, _this, e);

        })
        _this.$jumpNext.off();
        _this.$jumpNext.on('click', function (e) {
            var cur = _this.current + _this.options.itemLength > _this.page ? _this.page : _this.current + _this.options.itemLength;
            change(cur, _this, e);
        })

        _this.$jumpPrev.off();
        _this.$jumpPrev.on('click', function (e) {
            var cur = _this.current - _this.options.itemLength < 1 ? 1 : _this.current - _this.options.itemLength;
            change(cur, _this, e);
        })
        _this.$first.add(_this.$last).off();
        _this.$first.add(_this.$last).on('click', function(e){
            var cur = $(this).attr('title');
            change(cur, _this, e);
        })
        _this.$itemWrap.off();
        _this.$itemWrap.on('click', '.be-pagination-item', function(e){
            var cur = $(this).attr('title');
            change(cur, _this, e);
        })
        _this.$select.find('.be-select').off();
        _this.$select.find('.be-select').on('selected.bs.select', function(e){            
            _this.size = parseInt(e.selectData.value);
            _this.page = Math.ceil(_this.total / _this.size);
            var cur = _this.current > _this.page ? _this.page : _this.current;
            change(cur, _this, e);
        })
        _this.$input.off('blur', 'input');
        _this.$input.on('blur', 'input', function(e){
            var val = parseInt($(this).val());
            if(isNaN(val) || val < 1){
                val = 1;            
            }else if( val > _this.page){
                val = _this.page;
            }
            $(this).val(val);
            change(val, _this, e);
        })
        function change(current, env, e){
            env.current = parseInt(current);
            env.init.call(env);
            let changeEvent = $.Event('change.bs.pagination',{
                current : env.current,
                e : e
            });
            env.$element.trigger(changeEvent);
        }
    }
}

Pagination.VERSION = '1.0.0';
Pagination.DEFAULTS = {
    prev: '.be-pagination-prev',
    next: '.be-pagination-next',
    select: '.be-pagination-setsize',
    input: '.be-pagination-options',
    jumpPrev: '.be-pagination-jump-prev',
    jumpNext: '.be-pagination-jump-next',
    first: '.be-pagination-first',
    last: '.be-pagination-last',
    itemWrap: '.be-pagination-item-wrapper',
    itemTemplate: '<li class="be-pagination-item be-pagination-btn"></li>',
    itemLength: 5
}

// Pagination PLUGIN DEFINITION
// ==========================

function Plugin(option) {
    return this.each(function () {
        let $this = $(this);
        let data = $this.data('bs.pagination');
        let options = $.extend({}, Pagination.DEFAULTS, $this.data(), typeof option == 'object' && option);
        if (!data) $this.data('bs.pagination', (data = new Pagination(this, options)));
        if (typeof option == 'string') data[option]();
    })
}

var old = $.fn.pagination;

$.fn.pagination = Plugin;
$.fn.pagination.Constructor = Pagination;

$.fn.select.noConflict = function () {
    $.fn.pagination = old;
    return this;
}

export default Pagination;
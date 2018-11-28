class Pagination {
    constructor(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Pagination.DEFAULTS, options);
        this.total = this.options.total;
        this.size = this.options.size;
        this.current = this.options.current;
        this.page = Math.ceil(this.total / this.size);
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
        if (this.current == 1) {
            this.prevShow = false;
        } else {
            this.prevShow = true;
        }
        if (this.current == this.page) {
            this.nextShow = false;
        } else {
            this.nextShow = true;
        }
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
            this.jumpPrevShow = this.jumpNextShow = this.prevShow = this.nextShow = false;
            this.lastShow = this.selectShow = this.itemWarpShow = this.inputShow = true;
        } else {
            if (this.current - this.lengthMid <= 2) {
                min = 2;
                this.jumpPrevShow = this.prevShow = false;
            } else {
                min = this.current - this.lengthMid;
                this.jumpPrevShow = this.prevShow = true;
            }

            if (this.current + this.lengthMid >= this.page - 1) {
                max = this.page - 1;
                this.jumpNextShow = this.nextShow = false;
            } else {
                max = this.current + this.lengthMid;
                this.jumpNextShow = this.nextShow = true;
            }
            this.lastShow = this.selectShow = this.itemWarpShow = this.inputShow = true;
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
        this.$prev.toggle(this.prevShow);
        this.$next.toggle(this.nextShow);
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
        _this.$prev.on('click', function () {
            _this.current = _this.current - 1;
            _this.init.call(_this);
        })
        _this.$next.off();
        _this.$next.on('click', function () {
            _this.current = _this.current + 1;
            _this.init.call(_this);
        })
    }
}

Pagination.VERSION = '1.0.0';
Pagination.DEFAULTS = {
    prev: '.be-pagination-prev',
    next: '.be-pagination-next',
    select: '.be-pagination-setsize .be-select',
    input: '.be-pagination-options .be-input',
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
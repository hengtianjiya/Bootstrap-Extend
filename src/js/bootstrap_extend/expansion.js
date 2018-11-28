class Expansion {
    constructor(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Expansion.DEFAULTS, options);
        this.$trigger = $('[data-toggle="expansion"][href="#' + element.id + '"],[data-toggle="expansion"][data-target="#' + element.id + '"]');
        this.transitioning = null;
        $.beAddAriaAndNarrowedClass(this.$element, this.$trigger, 'in', 'narrowed');
        if (this.options.toggle) this.toggle();
    }

    toggle() {
        this[this.$element.hasClass('in') ? 'narrow' : 'expand']()
    }

    expand() {
        if (this.transitioning || this.$element.hasClass('in')) return;
        let startEvent = $.Event('expand.bs.expansion');
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) return;

        let oritation = this.oritation();
        this.$element
            .removeClass('narrowed')
            .addClass('expanding')[oritation](0)
            .attr('aria-expanded', true);

        this.$trigger
            .removeClass('narrowed')
            .addClass('expanding')
            .attr('aria-expanded', true);

        this.transitioning = 1;

        let complete = function () {
            //return false;
            this.$element
                .removeClass('expanding')
                .addClass('expand in')[oritation]('');

            this.transitioning = 0;
            this.$trigger
                .removeClass('expanding');
            this.$element
                .trigger('expanded.bs.expansion');
        }

        if (!$.support.transition) return complete.call(this);

        var scrollSize = $.camelCase(['scroll', oritation].join('-'))

        this.$element
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Expansion.TRANSITION_DURATION)[oritation](this.$element[0][scrollSize]);
    }

    narrow() {
        if (this.transitioning || !this.$element.hasClass('in')) return;
        let startEvent = $.Event('narrow.bs.collapse');
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) return;

        let oritation = this.oritation();
        this.$element[oritation](this.$element[oritation]());

        this.$element
            .removeClass('expand in')
            .addClass('narrowing')[oritation](this.options.narrowDimension)
            .attr('aria-expanded', false)

        this.$trigger
            .addClass('narrowing')
            .attr('aria-expanded', false)

        this.transitioning = 1

        var complete = function () {
            this.transitioning = 0;
            this.$trigger
                .removeClass('narrowing')
                .addClass('narrowed');
            this.$element
                .removeClass('narrowing')
                .addClass('narrowed')[oritation](this.options.narrowDimension)
                .trigger('narrowed.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        this.$element
        [oritation](0)
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Expansion.TRANSITION_DURATION)
    }

    oritation() {
        let hasOritation = this.options.oritation;
        return hasOritation == 'vertical' ? 'width' : 'height';
    }
}
Expansion.VERSION = '1.0.0';
Expansion.TRANSITION_DURATION = 150;

Expansion.DEFAULTS = {
    toggle: true,
    oritation: 'vertical'
}

// SIDEBAR PLUGIN DEFINITION
// ==========================

function Plugin(option) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('bs.expansion');
        var options = $.extend({}, Expansion.DEFAULTS, $this.data(), typeof option == 'object' && option);
        if (!data && options.toggle && /expand|narrow/.test(option)) options.toggle = false;
        if (!data) $this.data('bs.expansion', (data = new Expansion(this, options)));
        if (typeof option == 'string') data[option]();
    })
}

var old = $.fn.expansion;

$.fn.expansion = Plugin;
$.fn.expansion.Constructor = Expansion;

$.fn.collapse.noConflict = function () {
    $.fn.expansion = old;
    return this;
}

$(document).on('click.bs.expansion.data-api', '[data-toggle="expansion"]', function (e) {
    var $this = $(this);

    if (!$this.attr('data-target')) e.preventDefault();

    var $target = $.beGetTargetFromTrigger($this);
    var data = $target.data('bs.expansion');
    var option = data ? 'toggle' : $this.data();

    Plugin.call($target, option);
})

export default Expansion;
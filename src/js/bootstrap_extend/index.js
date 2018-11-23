import Expansion from './expansion.js';
import Select from './select.js';
import Upload from './upload.js';

class Common {
    constructor() {
        $.extend({
            beReplaceReg: /.*(?=#[^\s]*$)/,
            beTargetAttr: 'data-target',
            beHrefAttr: 'href',
            beGetParent: this.getParent,
            beGetTargetFromTrigger: this.getTargetFromTrigger,
            beAddAriaAndNarrowedClass: this.addAriaAndNarrowedClass
        })
    }
    getParent($trigger) {
        var selector = $trigger.attr(this.beTargetAttr);
        if (!selector) {
            selector = $trigger.attr(this.beHrefAttr);
            selector = selector && selector.replace(this.beReplaceReg, ''); // strip for ie7
        }
        var $parent = selector && $(selector);
        return $parent && $parent.length ? $parent : $trigger.parent();
    }
    getTargetFromTrigger($trigger) {
        var href;
        var target = $trigger.attr(this.beTargetAttr)
            || (href = $trigger.attr(this.beHrefAttr)) && href.replace(this.beReplaceReg, '') // strip for ie7
        return $(target);

    }
    addAriaAndNarrowedClass($element, $trigger, classin, classout) {
        let isOpen = $element.hasClass(classin);

        $element.attr('aria-expanded', isOpen)
        $trigger
            .toggleClass(classout, !isOpen)
            .attr('aria-expanded', isOpen);
    }
    removeTags() {

    }
}
new Common();

$('.be-menu-submenu-wrapper').on('expand.bs.expansion narrow.bs.collapse', function (e) {
    if ($('#J_navigation').attr('aria-expanded') == 'false') {
        e.preventDefault();
    }
})

$('.be-select').on('selected.bs.select', function (e) {
    console.log(e.selectData)
})
$('.be-upload').on('success.bs.upload', function (data) {
    console.log('success');
    console.log(data)
})

$('.be-upload').on('process.bs.upload', function (data) {
    console.log('process');
    console.log(data)
})

$('.be-upload').on('error.bs.upload', function (data) {
    console.log(data)
})

$('[data-toggle="tooltip"]').tooltip()
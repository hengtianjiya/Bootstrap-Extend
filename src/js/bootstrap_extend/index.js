import Expansion from './expansion.js';
import Select from './select.js';
import Upload from './upload.js';
import Toast from './toast.js';
import Pagination from './pagination.js';
import Loading from './loading.js';
import Radio from './radio.js';
import CheckBox from './checkbox.js';
import DateTimePicker from './datetimepicker.js';

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

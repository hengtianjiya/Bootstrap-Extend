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
$(document).ready(function () {
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

    $.get(
        '/mock/menu.json',
        function (result) {
            $.beUtil.parseTmpl('/template/menu.html', result, function (html) {
                $('#J_menu').append(html);
            });
        }
    )

    $('#J_toast').on('click', function () {
        $.beToast('This is a default toast!')
    })
    $('#J_Success').on('click', function () {
        $.beToast_success({
            message: 'This is a successful toast',
            auto_close: false
        })
    })
    $('#J_Danger').on('click', function () {
        $.beToast_danger({
            message: 'This is a danger toast',
            auto_close: false
        })
    })
    $('#J_Warning').on('click', function () {
        $.beToast_warning({
            message: 'This is a warning toast',
            auto_close: false
        })
    })

    var path = $.bePath.setPathReg('/path/:path/user/:user?');
    console.log(path.pathObj)
    $('#J_one').on('click', function () {
        path.toPath({ path: 456 });
    })
    $('#J_two').on('click', function () {
        path.toPath({ path: 456, user: 789 });
    })
    $(window).on('beRouteUpdate', function (e) {
        console.log(e.pathObj)
    })
    $('[data-page="pagination"]').pagination();
    $('[data-page="pagination"]').on('change.bs.pagination', function (e) {
        if (e.current) {
            console.log(e.current)
            console.log(e.pagesize)
        }
    })

    $('[data-page="pagination"]').pagination('go', 2);

    var l = $.beLoading({ message: '加载中...' });
    $('#J_loading').on('click', function () {
        l.show();
        setTimeout(function () {
            l.hide();
        }, 2000);
    })

    $('.be-radio-group').on('changed.bs.radio', function (e) {
        console.log(e.value)
    })

    $('.be-checkbox-group').on('changed.bs.checkbox', function (e) {
        console.log(e.value)
    })

    $('[data-toggle="datatimepicker"]').on('changed.bs.calendar', function(e){
        console.log(e.value)
    })
})
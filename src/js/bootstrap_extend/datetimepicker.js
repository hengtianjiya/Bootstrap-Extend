
class Time {
    constructor() {

    }
}

class Day {
    constructor(options) {
        this.$el = options.$el;
        this.options = $.extend({}, options);
        this.defaultOptions = this.options.options;
        this.init();
        return this;
    }

    init() {
        var today = `${this.defaultOptions.y}-${this.defaultOptions.m}-${this.defaultOptions.d}`;
        var date = `${this.options.date.year}-${this.options.date.month}-${this.options.date.date}`;
        var isToday = today == date;
        this.$el.addClass(isToday ? 'today' : '')
        this.$el.html(`<div class="be-date-td">${this.options.date.date}</div>`);
        this.$el.attr('title', `${this.options.date.year}-${this.options.date.month + 1}-${this.options.date.date}`);
        this.$el.data({
            date: this.options.date
        })
    }

    setDay() {

    }
}

class Week {
    constructor(options) {
        this.$parent = options.$el;
        this.options = $.extend({}, options);
        this.defaultOptions = this.options.options;
        this.week = this.options.week;
        this.$td_arr = [];
        this.init();
        return this;
    }

    init() {
        this.generateDom();
    }

    generateDom() {
        var _this = this;
        this.options.week.forEach((v, k) => {
            _this[`$td_${k}`] = $('<td></td>');
            _this.$td_arr.push(_this[`$td_${k}`]);
            _this[`dayInstance${k}`] = new Day({
                date: v,
                d_id: k,
                $el: _this[`$td_${k}`],
                options: _this.defaultOptions
            })
            _this[`$td_${k}`].data({
                ins: _this[`dayInstance${k}`],
                id: k
            })
            _this[`$td_${k}`].addClass(v.type);
            if (v.current) {
                _this[`$td_${k}`].addClass('cur');
            }
            //_this[`$td_${k}`].append(_this[`dayInstance${k}`].$el);
        })
    }
}

class MonthDay {
    constructor(options) {
        this.$el = $('<tbody></tbody>');
        this.options = $.extend({}, options);
        this.defaultOptions = this.options.options;
        this.momentobj = this.options.momentobj;
        this.type = this.options.type;
        this.monthLength = 42;
        this.weekLength = 7;
        this.weeks = this.monthLength / this.weekLength;
        this.prevMonthArr = [];
        this.curMonthArr = [];
        this.nextMonthArr = [];
        this.year = null;
        this.month = null;
        this.date = null;
        this.weekday = null;
        this.prevYear = null;
        this.prevMonth = null;
        this.nextYear = null;
        this.nextMonth = null;
        this.monthTotal = [];
        return this;
    }

    init() {
        var year = this.momentobj.year();
        var month = this.momentobj.month();
        var date = this.momentobj.date();
        var weekday = this.momentobj.date(1).weekday();
        if (month == 1) {
            this.options.monthdate[month] = 28;
            if (this.isLeapYear(year)) {
                this.options.monthdate[month] = 29;
            }
        }
        this.year = year;
        this.month = month;
        this.date = date;
        this.weekday = weekday;
        this.monthdate = this.defaultOptions.monthdate[month];
        if (month == this.defaultOptions.monthdate.length - 1) {
            this.prevMonthDate = this.defaultOptions.monthdate[month - 1];
            this.nextMonthDate = this.defaultOptions.monthdate[0];
            this.prevMonth = month - 1;
            this.nextMonth = 0;
            this.prevYear = year;
            this.nextYear = year + 1;
        } else if (month == 0) {
            var pre = this.defaultOptions.monthdate.length - 1
            this.prevMonthDate = this.defaultOptions.monthdate[pre];
            this.nextMonthDate = this.defaultOptions.monthdate[month + 1];
            this.prevMonth = pre;
            this.nextMonth = month + 1;
            this.prevYear = year - 1;
            this.nextYear = year;
        } else {
            this.prevMonthDate = this.defaultOptions.monthdate[month - 1];
            this.nextMonthDate = this.defaultOptions.monthdate[month + 1];
            this.prevMonth = month - 1;
            this.nextMonth = month + 1;
            this.prevYear = year;
            this.nextYear = year;
        }
        this.getPrevMonth();
        this.getCurMonth();
        this.getNextMonth();
        this.parseMonth();
        this.generateDom();
    }

    setMoment(momentobj) {
        this.momentobj = momentobj;
    }

    parseMonth() {
        var monthTotal = this.monthTotal.concat(this.prevMonthArr, this.curMonthArr, this.nextMonthArr);
        var tmpArr = [];
        for (var i = 0; i < this.weeks; i++) {
            var start = i * this.weekLength;
            var end = start + 7;
            tmpArr.push(monthTotal.slice(start, end));
        }
        this.monthTotal = tmpArr;
    }

    getPrevMonth() {
        var prevStart = this.prevMonthDate - this.weekday + 1;
        for (var prev = prevStart; prev <= this.prevMonthDate; prev++) {
            this.prevMonthArr.push({
                date: prev,
                year: this.prevYear,
                month: this.prevMonth,
                type: 'previous',
                current: false
            })
        }
    }

    getCurMonth() {
        for (var cur = 1; cur <= this.monthdate; cur++) {
            this.curMonthArr.push({
                date: cur,
                year: this.year,
                month: this.month,
                type: 'current',
                current: cur == this.date
            })
        }
    }

    getNextMonth() {
        var nextEnd = this.monthLength - this.prevMonthArr.length - this.curMonthArr.length;
        for (var next = 1; next <= nextEnd; next++) {
            this.nextMonthArr.push({
                date: next,
                year: this.nextYear,
                month: this.nextMonth,
                type: 'next',
                current: false
            })
        }
    }

    generateDom() {
        var _this = this;
        _this.$el.data('id', this.options.m_id);
        this.monthTotal.forEach((v, k) => {
            if (!_this[`weekInstance${k}`]) {
                _this[`$tr_${k}`] = $('<tr></tr>');
                _this[`weekInstance${k}`] = new Week({
                    week: v,
                    w_id: k,
                    $el: _this.$tr,
                    options: _this.defaultOptions
                })
                _this[`$tr_${k}`].data({
                    ins: _this[`weekInstance${k}`],
                    id: k
                })

                _this[`weekInstance${k}`].$td_arr.forEach((vv, kk) => {
                    _this[`$tr_${k}`].append(vv);
                })
                _this.$el.append(_this[`$tr_${k}`]);
            } else {

            }
        })
    }

    isLeapYear(year) {
        return moment([year]).isLeapYear();
    }

}

class Month {
    constructor() {

    }
}

class DateTimePicker {
    constructor(element, options) {
        this.$element = $('.be-calendar');
        this.options = $.extend({}, DateTimePicker.DEFAULTS, options);
        this.fromMoment = null;
        this.toMoment = null;
        this.fromIncetance = null;
        this.toIncetance = null;
        this.momentArr = [];
        return this;
    }

    init() {
        this.fromMoment = this.checkMoment(this.options.from);
        this.operateMomentArr(this.fromMoment, 'from');
        if (this.options.span) {
            this.toMoment = this.checkMoment(this.options.to);
            this.operateMomentArr(this.toMoment, 'to');
        }
        this.getMonthDate();
        this.bindEvent();
    }

    bindEvent() {
        this.$element.off('click', this.options.$ym)
        this.$element.on('click', this.options.$ym, function () {
            console.log(111)
        })
        this.$element.off('click', this.options.$prevJump)
        this.$element.on('click', this.options.$prevJump, function () {
            var $table = $(this).closest('.be-calendar-date').find('table');
            console.log($table.data().ins.momentobj.year())
        })
    }

    operateMomentArr(moment, type) {
        this.momentArr.push({
            momentobj: moment,
            type: type
        })
    }

    checkMoment(momentobj) {
        return moment.isMoment(momentobj) ? momentobj : moment(momentobj, "YYYY-MM-DD");
    }

    getMonthDate() {
        for (var i = 0; i < this.momentArr.length; i++) {
            var m = this.momentArr[i].momentobj;
            var t = this.momentArr[i].type;
            this[`$el_${i}`] = $('<table></table>');
            this[`${t}Incetance`] = new MonthDay({
                options: this.options,
                m_id: i,
                momentobj: m,
                type: t
            })
            this[`$el_${i}`].data({
                ins: this[`${t}Incetance`],
                id: i,
                type: t
            });
            this[`${t}Incetance`].init();
            var $thead = $('<thead></thead>');
            this.options.wlanarr.forEach(((v, k) => {
                $thead.append($(`<th>${v}</th>`))
            }).bind(this))
            this[`$el_${i}`].append($thead);
            this[`$el_${i}`].append(this[`${t}Incetance`].$el);
            $($(this.options.$ym)[i]).find(this.options.$year).text(this.momentArr[i].momentobj.year() + this.options.ylan);
            $($(this.options.$ym)[i]).find(this.options.$month).text((this.momentArr[i].momentobj.month() + 1) + this.options.mlan);
            $($(this.options.$dateWrap)[i]).append(this[`$el_${i}`]);
        }
    }
}
var now = moment();
DateTimePicker.DEFAULTS = {
    now: now,
    nf: now.format("YYYY-MM-DD HH:mm:ss"),
    d: now.date(),
    m: now.month(),
    y: now.year(),
    wd: now.format('d'),
    h: now.format('H'),
    min: now.format('m'),
    s: now.format('s'),
    ms: now.format('x'),
    ylan: '年',
    mlan: '月',
    dlan: '日',
    mlanarr: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    wlanarr: ['日', '一', '二', '三', '四', '五', '六'],
    monthdate: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    span: true,
    timechose: true,
    yearchose: true,
    monthchose: true,
    datechose: true,
    from: now,
    to: moment().add(1, 'M'),
    fromEl: '',
    $panel: '.be-calendar-panel',
    $dateWrap: '.be-calendar-date-cotent',
    $prevJump: '.be-calendar-prev-jump-btn',
    $prev: '.be-calendar-prev-btn',
    $nextJump: '.be-calendar-next-jump-btn',
    $next: '.be-calendar-next-btn',
    $ym: '.be-calendar-ym',
    $year: '.be-calendar-year',
    $month: '.be-calendar-month'

}
console.log(DateTimePicker.DEFAULTS)
new DateTimePicker().init();
export default DateTimePicker;
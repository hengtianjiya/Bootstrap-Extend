class Time {
    constructor() {

    }
}

class Day {
    constructor(options) {
        //console.log(options)
        this.$el = options.$el;
        this.options = $.extend({}, options);
        this.date = this.options.date;
        this.select = options.select; 
        this.defaultOptions = options.options;
        this.init();
        return this;
    }

    init() {
        var today = `${this.defaultOptions.y}-${this.defaultOptions.m}-${this.defaultOptions.d}`;
        //console.log(today)
        var date = `${this.date.year}-${this.date.month}-${this.date.date}`;
        //console.log(date)
        var classStr = '';
        var isToday = today == date;
        var hasClass = this.defaultOptions.dateTime.length;
        var idx = this.options.m_id;
        if(isToday) classStr += 'current-today ';
        if(hasClass) {
            classStr += 'has-class ';
            var next = Boolean(this.select[idx + 1]);
            var prev = Boolean(this.select[idx - 1]);
            var cur = Boolean(this.select[idx]);

            if(cur){
                if(next){
                    var maxi = idx + 1;
                    var mini = idx;
                }else{
                    if(prev){
                        var mini = idx - 1;
                        var maxi = idx;
                    }else{
                        var mini = maxi = idx; 
                    }          
                }
            } else {
                var mini = maxi = idx-1; 
            }

            var minm = this.getMomentM(this.select[mini]);
            var maxm = this.getMomentM(this.select[maxi]);
            var currentm = this.getMomentM(`${this.date.year}-${this.date.month + 1}-${this.date.date}`);
            
            if((currentm > minm && currentm < maxm) || (currentm > maxm && currentm < minm)){
                classStr += 'span ';
            }
            if(currentm == minm) classStr += 'selected ';
            if(currentm == maxm) classStr += 'selected ';
        }
        this.$el.removeClass();
        this.$el.addClass(classStr);
        this.$el.html(`<div class="be-date-td">${this.date.date}</div>`);
        this.$el.attr('title', `${this.date.year}-${this.date.month + 1}-${this.date.date}`);
        //console.log(this.$el)
        this.$el.data({
            date: this.date
        })
    }
    getMomentM(dateStr){
        var f = this.defaultOptions.formatMap[this.defaultOptions.format];
        return parseInt(moment(dateStr, f).format('x'));
    }
    setDay(obj) {
        this.date = obj.v;
        this.select = obj.select;
        this.init();
    }
}

class Week {
    constructor(options) {
        this.$parent = options.$el;
        this.select = options.select;
        this.options = $.extend({}, options);
        this.defaultOptions = options.options;
        this.week = this.options.week;
        this.$td_arr = [];
        this.init();
        return this;
    }

    init() {
        this.generateDom();
    }
    setWeek(obj) {
        //console.log(week)
        this.week = obj.v;
        this.select = obj.select;
        this.$td_arr = [];
        this.generateDom();
    }
    generateDom() {
        var _this = this;
        this.week.forEach((v, k) => {
            if (!_this[`$td_${k}`]) {
                _this[`$td_${k}`] = $('<td></td>');
                _this.$td_arr.push(_this[`$td_${k}`]);
                _this[`dayInstance${k}`] = new Day({
                    date: v,
                    m_id: _this.options.m_id,
                    w_id: _this.options.w_id,
                    d_id: k,
                    $el: _this[`$td_${k}`],
                    options: _this.defaultOptions,
                    select : _this.select 
                })
                _this[`$td_${k}`].data({
                    ins: _this[`dayInstance${k}`],
                    id: k,
                    select : _this.select 
                })
            } else {
                _this[`$td_${k}`].removeClass()
                _this.$td_arr.push(_this[`$td_${k}`]);
                _this[`dayInstance${k}`].setDay({
                    v: v,
                    select: _this.select
                });
            }
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
        this.select = options.select;
        this.defaultOptions = options.options;
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
        this.init();
        return this;
    }

    init() {
        var year = this.momentobj.year();
        var month = this.momentobj.month();
        var date = this.momentobj.date();
        var weekday = this.momentobj.date(1).weekday();
        if (month == 1) {
            this.defaultOptions.monthdate[month] = 28;
            if (this.isLeapYear(year)) {
                this.defaultOptions.monthdate[month] = 29;
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
        this.reinit();
        
    }
    reinit(){
        this.prevMonthArr = [];
        this.curMonthArr = [];
        this.nextMonthArr = [];
        this.monthTotal = [];
        this.init();
    }

    setSelect(date){
        console.log(date)
        //console.log(this.select)
        //console.log(this.defaultOptions.dateTime)
        if(this.select.length == this.defaultOptions.dateTime.length){
            this.select = [];
        }
        this.select.push(date);
        var _this = this;
        var f = _this.defaultOptions.formatMap[_this.defaultOptions.format];
        _this.select.sort(function(next, prev){
            var n = moment(next, f).format('x');
            var p = moment(prev, f).format('x');
            return n - p;
        })
        var arr = _this.select.map((v) => moment(v, f));
        this.defaultOptions.selectTime = this.select;
        if(this.select.length == this.defaultOptions.dateTime.length){
            this.defaultOptions.dateTime = arr;
        }
        this.reinit();    
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
        //console.log(this.monthTotal);
        this.monthTotal.forEach((v, k) => {
            if (!_this[`weekInstance${k}`]) {
                _this[`$tr_${k}`] = $('<tr></tr>');
                _this[`weekInstance${k}`] = new Week({
                    week: v,
                    m_id: _this.options.m_id,
                    w_id: k,
                    $el: _this.$tr,
                    options: _this.defaultOptions,
                    select: _this.select 
                })
                _this[`$tr_${k}`].data({
                    ins: _this[`weekInstance${k}`],
                    id: k,
                    select: _this.select 
                })

                _this[`weekInstance${k}`].$td_arr.forEach((vv, kk) => {
                    _this[`$tr_${k}`].append(vv);
                })
                _this.$el.append(_this[`$tr_${k}`]);
            } else {
                _this[`weekInstance${k}`].setWeek({
                    v : v,
                    select: _this.select
                });
            }
        })
    }

    isLeapYear(year) {
        return moment([year]).isLeapYear();
    }

}

class Month {
    constructor(options) {
        this.$el = $('<tbody></tbody>');
        this.options = $.extend({}, options);
        this.defaultOptions = options.options;
        this.momentobj = options.momentobj;
        this.init();
        return this;
    }
    init() {
        this.year = this.momentobj.year();
        this.defaultY = this.defaultOptions.y;
        this.defaultM = this.defaultOptions.m;

        let $tr;
        for (let i = 0; i < this.defaultOptions.mlanarr.length; i++) {
            if (i % 3 == 0 && !this[`$tr${i}`]) {
                this[`$tr${i}`] = $('<tr></tr>');
                $tr = this[`$tr${i}`];
                this.$el.append($tr);
            }
            if (!this[`$td${i}`]) {
                this[`$td${i}`] = $(`<td><div class="be-month-td">${this.defaultOptions.mlanarr[i]}</div></td>`);
                $tr.append(this[`$td${i}`]);
            }
            this[`$td${i}`].removeClass();
            this[`$td${i}`]
                .addClass(this.defaultY == this.year && i == this.defaultM ? 'current-month' : '')
                .data({
                    year: this.year,
                    month: i
                })
        }
    }
    setMoment(momentobj) {
        this.momentobj = momentobj;
        this.init();
    }
}
class Decade {
    constructor(options) {
        this.options = $.extend({}, options);
        this.defaultOptions = options.options;
        this.year = this.options.year;
        this.type = this.options.type;
        this.min = this.options.min;
        this.max = this.options.max;
        this.init();
        return this;
    }
    init() {
        //console.log(this.year)
        //console.log(this.defaultOptions)
        if (!this.$td) {
            this.$td = $(`<td class="${this.type}"><span class="be-year-td">${this.year}</span></td>`);
        } else {
            this.$td
                .removeClass()
                .addClass(this.type)
                .find('.be-year-td')
                .text(this.year);
        }
        //console.log(this.options);
        //console.log(this.defaultOptions.dateTime[this.options.t]);
        //return false;
        this.$td
            .attr('title', this.year)
            .addClass(this.year == this.defaultOptions.dateTime[this.options.t].year() ? 'current-year' : '')
            .data({
                year: this.year,
                min: this.min,
                max: this.max,
                type: this.type
            });
    }

    setDecade(obj) {
        this.year = obj.year;
        this.type = obj.type;
        this.min = obj.min;
        this.max = obj.max;
        this.init();
    }
}

class Century {
    constructor(options) {
        this.options = $.extend({}, options);
        this.defaultOptions = options.options;
        this.year = this.options.year;
        this.type = this.options.type;
        this.min = this.options.min;
        this.max = this.options.max;
        this.minVal = this.options.minVal;
        this.maxVal = this.options.maxVal;
        this.init();
        return this;
    }
    init() {
        if (!this.$td) {
            this.$td = $(`<td class="${this.type}"><span class="be-century-td">${this.year}</span></td>`);
        } else {
            this.$td
                .removeClass()
                .addClass(this.type)
                .find('.be-century-td')
                .text(this.year);
        }
        //console.log(this.options)
        //return false;
        this.$td
            .attr('title', this.year)
            .addClass(this.defaultOptions.dateTime[this.options.t].year() >= this.minVal && this.defaultOptions.dateTime[this.options.t].year() <= this.maxVal ? 'current-century' : '')
            .data({
                year: this.year,
                min: this.min,
                max: this.max,
                minVal: this.minVal,
                maxVal: this.maxVal,
                type: this.type
            });
    }

    setCentury(obj) {
        this.year = obj.year;
        this.type = obj.type;
        this.min = obj.min;
        this.max = obj.max;
        this.minVal = obj.minVal;
        this.maxVal = obj.maxVal;
        this.init();
    }
}
class Year {
    constructor(options) {
        this.$elD = $('<tbody></tbody>');
        this.$elC = $('<tbody></tbody>');
        this.options = $.extend({}, options);
        this.defaultOptions = options.options;
        let year = this.options.momentobj.year();
        let dc = this.getDC(year);
        this.dc = dc;
        this.init();
    }
    init() {
        this.generateDecadeDom();
        this.generateCenturyDom();
    }
    getDC(year) {
        let decadeMin = Math.floor(year / 10) * 10;
        let decadeMax = decadeMin - 0 + 9;
        let centuryMin = Math.floor(year / 100) * 100;
        let centuryMax = centuryMin - 0 + 99;
        return {
            decade: {
                min: decadeMin,
                max: decadeMax
            },
            century: {
                min: centuryMin,
                max: centuryMax
            }
        };
    }
    setDC(year){
        let dc = this.getDC(year);
        this.dc = dc;
        this.init();
    }
    setDecade(decade) {
        if (this.dc) this.dc.decade = decade;
    }
    setCentury(century) {
        if (this.dc) this.dc.century = century;
    }
    generateDecadeDom() {
        let decade = this.dc.decade;
        let min = decade.min - 1;
        let max = decade.max + 1;
        let arr = [];
        for (let i = min; i <= max; i++) {
            arr.push(i);
        }
        let $tr;
        for (let j = 0; j < arr.length; j++) {
            if (j % 3 == 0 && !this[`$trD${j}`]) {
                this[`$trD${j}`] = $('<tr></tr>');
                $tr = this[`$trD${j}`];
                this.$elD.append(this[`$trD${j}`]);
            }
            let type;
            switch (j) {
                case 0:
                    type = 'previous';
                    break;
                case arr.length - 1:
                    type = 'next';
                    break;
                default:
                    type = 'current';
                    break;
            }

            if (!this[`$tdD${j}`]) {
                this[`$tdD${j}`] = new Decade({
                    options: this.defaultOptions,
                    year: arr[j],
                    type: type,
                    min: min,
                    max: max,
                    d_id: j,
                    t : this.options.type
                })
                $tr.append(this[`$tdD${j}`].$td);
            } else {
                this[`$tdD${j}`].setDecade({
                    year: arr[j],
                    type: type,
                    min: min,
                    max: max
                })
            }
        }
    }
    generateCenturyDom() {
        let century = this.dc.century;
        let min = century.min - 10;
        let max = century.max + 10;
        let arr = [];
        for (let i = min; i <= max; i += 10) {
            arr.push({
                min: i,
                max: i + 9
            });
        }
        let $tr;
        for (let j = 0; j < arr.length; j++) {
            if (j % 3 == 0 && !this[`$trC${j}`]) {
                this[`$trC${j}`] = $('<tr></tr>');
                $tr = this[`$trC${j}`];
                this.$elC.append(this[`$trC${j}`]);
            }
            let type;
            switch (j) {
                case 0:
                    type = 'previous';
                    break;
                case arr.length - 1:
                    type = 'next';
                    break;
                default:
                    type = 'current';
                    break;
            }
            if (!this[`$tdC${j}`]) {
                this[`$tdC${j}`] = new Century({
                    options: this.defaultOptions,
                    year: `${arr[j].min}-${arr[j].max}`,
                    minVal: arr[j].min,
                    maxVal: arr[j].max,
                    min: min,
                    max: max,
                    type: type,
                    t : this.options.type
                });
                $tr.append(this[`$tdC${j}`].$td);
            } else {
                this[`$tdC${j}`].setCentury({
                    year: `${arr[j].min}-${arr[j].max}`,
                    minVal: arr[j].min,
                    maxVal: arr[j].max,
                    min: min,
                    max: max,
                    type: type
                })
            }
        }
    }
}
class DateTimePicker {
    constructor(trigger, options) {
        this.$trigger = $(trigger);        
        this.options = $.extend(true, {}, options);
        this.momentArr = [];
        this.selectTime = [];
        this.init();
        if(this.options.toggle) this.toggle();
        return this;
    }

    init() {
        this.$trigger.append(this.options.$template);
        this.$element = this.$trigger.find('.be-calendar');
        this.operateDateTime();
        this.getMonthDate();
        this.bindEvent();
    }
    operateDateTime(){
        var f = this.options.formatMap[this.options.format];
        if(typeof this.options.dateTime == 'string') this.options.dateTime = eval(this.options.dateTime);
        if(!this.options.dateTime || !this.options.dateTime.length) this.options.dateTime = new Array(2).fill('');
        for(var i = 0; i < this.options.dateTime.length; i++){
            if(this.options.dateTime[i]){
                var m = this.checkMoment(this.options.dateTime[i]);
            }else{
                var m = moment().add(i, 'M');
            }
            this.selectTime[i] = m.format(f);
            this.options.dateTime[i] = m;
            this.operateMomentArr(m, i)
        }
    }

    select(datetime){
        this.momentArr = [];
        this.options.dateTime = datetime;
        this.operateDateTime();
        this.getMonthDate();
    }
    toggle(){
        this[this.$element.hasClass('in') ? 'hide' : 'show']();
    }
    show(){
        this.$element.addClass('in');
    }
    hide(){
        this.$element.removeClass('in');
    }
    setDatePicker(el, picker){
        this.options.datePicker = picker;
        var $calendar =  el.closest(this.options.$calendar);
        this.showCurrentOperation($calendar.find(this.options.$panel), $calendar.find(this.options.$dateWrap));
    }

    bindEvent() {
        var _this = this;
        //bind date event
        _this.$element.off('click', `${this.options.$ym} ${this.options.$year}`)
        _this.$element.on('click', `${this.options.$ym} ${this.options.$year}`, function () {
            _this.setDatePicker.call(_this, $(this), 'year');
        })

        _this.$element.off('click', `${this.options.$ym} ${this.options.$month}`)
        _this.$element.on('click', `${this.options.$ym} ${this.options.$month}`, function () {
            _this.setDatePicker.call(_this, $(this), 'month');
        })

        _this.$element.off('click', `${this.options.$prevJump},${this.options.$monthJumpPrev}`);
        _this.$element.on('click',`${this.options.$prevJump},${this.options.$monthJumpPrev}`, function () {
            var curObj = _this.getCurrentYM.call(_this, $(this));
            var y = _this.getPrevYear(curObj.year);
            var momentobj = _this.getMoment(`${y}-${curObj.m + 1}-1`);
            _this.setYM(
                curObj.$ym, 
                y + _this.options.ylan, 
                (curObj.m + 1) + _this.options.mlan,
                curObj.$calendar,
                y,
                (curObj.m + 1));
            curObj.$table.data().ins.setMoment(momentobj);
        })
        _this.$element.off('click', `${this.options.$nextJump},${this.options.$monthJumpNext}`);
        _this.$element.on('click', `${this.options.$nextJump},${this.options.$monthJumpNext}`, function () {
            var curObj = _this.getCurrentYM.call(_this, $(this));
            var y = _this.getNextYear(curObj.year);
            var momentobj = _this.getMoment(`${y}-${curObj.m + 1}-1`);
            _this.setYM(
                curObj.$ym, 
                y + _this.options.ylan, 
                (curObj.m + 1) + _this.options.mlan,
                curObj.$calendar,
                y,
                (curObj.m + 1));
            curObj.$table.data().ins.setMoment(momentobj);
        })

        _this.$element.off('click', this.options.$prev);
        _this.$element.on('click', this.options.$prev, function () {
            var curObj = _this.getCurrentYM.call(_this, $(this));
            var obj = _this.getPrevMonth(curObj.m, curObj.year);
            var momentobj = _this.getMoment(`${obj.y}-${obj.m + 1}-1`);
            _this.setYM(
                curObj.$ym, 
                obj.y + _this.options.ylan, 
                (obj.m + 1) + _this.options.mlan,
                curObj.$calendar,
                obj.y,
                (obj.m + 1));
            curObj.$table.data().ins.setMoment(momentobj);
        })
        _this.$element.off('click', this.options.$next);
        _this.$element.on('click', this.options.$next, function () {
            var curObj = _this.getCurrentYM.call(_this, $(this));
            var obj = _this.getNextMonth(curObj.m, curObj.year);
            var momentobj = _this.getMoment(`${obj.y}-${obj.m + 1}-1`);
            _this.setYM(
                curObj.$ym, 
                obj.y + _this.options.ylan, 
                (obj.m + 1) + _this.options.mlan,
                curObj.$calendar,
                obj.y,
                (obj.m + 1));
            curObj.$table.data().ins.setMoment(momentobj);
        })
        _this.$element.off('click', `${this.options.$contentDate} td`);
        _this.$element.on('click', `${this.options.$contentDate} td`, function(){
            var curData = $(this).data();
            var $tabledate = $(_this.$element).find(_this.options.$contentDate);
            for(var i = 0; i < $tabledate.length; i++){
                var data = $($tabledate[i]).data();
                data.ins.setSelect(`${curData.date.year}-${curData.date.month + 1}-${curData.date.date}`);
            }
            console.log(_this.options.selectTime);
            _this.setInput.call(_this);
            if(_this.options.selectTime.length == _this.options.dateTime.length){
                var changeEvent = $.Event('changed.bs.calendar', {
                    value: _this.options.selectTime
                });
                _this.$trigger.trigger(changeEvent);
                _this.hide();
            }
        })
        //bind month event
        _this.$element.off('click', `${this.options.$contentMonth} td`);
        _this.$element.on('click', `${this.options.$contentMonth} td`, function(){
            var curObj = _this.getCurrentYM.call(_this, $(this));
            var $data = $(this).data();
            var momentobj = _this.getMoment(`${curObj.year}-${$data.month + 1}-1`);
            var $calendar =  $(this).closest(_this.options.$calendar);
            var $table = $calendar.find(_this.options.$contentMonth);
            var $tdata =  $table.data();
            _this.setYM(
                curObj.$ym, 
                curObj.year + _this.options.ylan, 
                ($data.month + 1) + _this.options.mlan,
                curObj.$calendar,
                curObj.year,
                ($data.month + 1));
            $tdata.ins.setMoment(_this.getMoment(`${curObj.year}-${$data.month + 1}-1`));
            curObj.$table.data().ins.setMoment(momentobj);
            _this.setDatePicker.call(_this, $(this), 'date');
        });
        
        //bind year event
        _this.$element.off('click', `${this.options.$yearJumpPrev}, ${this.options.$contentYear} .previous`);
        _this.$element.on('click', `${this.options.$yearJumpPrev}, ${this.options.$contentYear} .previous`, function(){
            var $calendar =  $(this).closest(_this.options.$calendar);
            var $table = $calendar.find(_this.options.$contentYear);
            var $data =  $table.data();
            var $ins = $data.ins;
            var dc = $ins.dc;
            var year = dc.decade.min - 10;
            $ins.setDC(year);
            _this.setYD($calendar.find(_this.options.$panel), dc);

        });
        _this.$element.off('click', `${this.options.$yearJumpNext}, ${this.options.$contentYear} .next`);
        _this.$element.on('click', `${this.options.$yearJumpNext}, ${this.options.$contentYear} .next`, function(){
            var $calendar =  $(this).closest(_this.options.$calendar);
            var $table = $calendar.find(_this.options.$contentYear);
            var $data =  $table.data();
            var $ins = $data.ins;
            var dc = $ins.dc;
            var year = dc.decade.max + 10;
            $ins.setDC(year);
            _this.setYD($calendar.find(_this.options.$panel), dc);

        });
        _this.$element.off('click', `${this.options.$contentYear} .current`);
        _this.$element.on('click', `${this.options.$contentYear} .current`, function(){
            var $calendar =  $(this).closest(_this.options.$calendar);
            var curObj = _this.getCurrentYM.call(_this, $(this));
            var $data = $(this).data();
            var momentobj = _this.getMoment(`${$data.year}-${curObj.m + 1}-1`);
            _this.setYM(
                curObj.$ym, 
                $data.year + _this.options.ylan, 
                (curObj.m + 1) + _this.options.mlan,
                curObj.$calendar,
                $data.year,
                (curObj.m + 1));
            curObj.$table.data().ins.setMoment(momentobj);
            _this.setDatePicker.call(_this, $(this), 'date');
        });

        _this.$element.off('click', this.options.$yearShow);
        _this.$element.on('click', this.options.$yearShow, function(){
            _this.setDatePicker.call(_this, $(this), 'century');
        });
        //bind century event
        _this.$element.off('click', `${this.options.$centuryJumpPrev}, ${this.options.$contentCentury} .previous`);
        _this.$element.on('click', `${this.options.$centuryJumpPrev}, ${this.options.$contentCentury} .previous`, function(){
            var $calendar =  $(this).closest(_this.options.$calendar);
            var $table = $calendar.find(_this.options.$contentCentury);
            var $data =  $table.data();
            var $ins = $data.ins;
            var dc = $ins.dc;
            var year = dc.century.min - 100;
            $ins.setDC(year);
            _this.setYD($calendar.find(_this.options.$panel), dc);

        });

        _this.$element.off('click', `${this.options.$centuryJumpNext}, ${this.options.$contentCentury} .next`);
        _this.$element.on('click', `${this.options.$centuryJumpNext}, ${this.options.$contentCentury} .next`, function(){
            var $calendar =  $(this).closest(_this.options.$calendar);
            var $table = $calendar.find(_this.options.$contentCentury);
            var $data =  $table.data();
            var $ins = $data.ins;
            var dc = $ins.dc;
            var year = dc.century.max + 100;
            $ins.setDC(year);
            _this.setYD($calendar.find(_this.options.$panel), dc);

        });

        _this.$element.off('click', `${this.options.$contentCentury} .current`);
        _this.$element.on('click', `${this.options.$contentCentury} .current`, function(){
            var $calendar =  $(this).closest(_this.options.$calendar);
            var $table = $calendar.find(_this.options.$contentCentury);
            var $data =  $table.data();
            var $ins = $data.ins;
            var dc = $ins.dc;
            var $thisdata = $(this).data();
            var year = $thisdata.minVal;
            $ins.setDC(year);
            _this.setYD($calendar.find(_this.options.$panel), dc);
            _this.setDatePicker.call(_this, $(this), 'year');
        });

    }
    getMoment(dateStr) {
        return moment(dateStr, 'YYYY-MM-DD');
    }

    getPrevMonth(month, year) {
        return {
            m: month == 0 ? this.options.monthdate.length - 1 : month - 1,
            y: month == 0 ? this.getPrevYear(year) : year
        };
    }

    getNextMonth(month, year) {
        return {
            m: month == this.options.monthdate.length - 1 ? 0 : month + 1,
            y: month == this.options.monthdate.length - 1 ? this.getNextYear(year) : year
        };
    }

    getPrevYear(year) {
        return year < 1000 ? 1000 : year - 1;
    }

    getNextYear(year) {
        return year + 1;
    }

    getCurrentYM($el) {
        var $calendar = $el.closest(this.options.$calendar);
        var $table = $calendar.find('table');
        var $ym = $calendar.find(this.options.$ym);
        var year = $table.data().ins.momentobj.year();
        var m = $table.data().ins.momentobj.month();
        return {
            $calendar: $calendar,
            $table: $table,
            $ym: $ym,
            year: year,
            m: m
        }
    }
    operateMomentArr(moment, type) {
        this.momentArr.push({
            momentobj: moment,
            type: type
        })
    }

    checkMoment(momentobj) {
        return moment.isMoment(momentobj) ? momentobj : this.getMoment(momentobj);
    }
    setYM($el, y, m, calendar, calendaryear, calendarmonth) {
        $el.find(this.options.$year).text(y);
        $el.find(this.options.$month).text(m);
        if(calendar && calendaryear){
            this.setMY(calendar.find(this.options.$monthShow), calendaryear);
            var $table = calendar.find(this.options.$contentMonth);
            var $tdata =  $table.data();
            $tdata.ins.setMoment(this.getMoment(`${calendaryear}-${calendarmonth}-1`));
        }
    }
    setYD(el, dc){
        $(el).find(this.options.$yearShow).text(`${dc.decade.min}-${dc.decade.max}`);
        $(el).find(this.options.$centuryShow).text(`${dc.century.min}-${dc.century.max}`);
    }
    setMY(el, y){
        el.text(y);
    }
    setInput(){
        this.options.selectTime.forEach((v, k)=>{
            $(this.$element.find(this.options.$input)[k]).val(v);
            $(this.$trigger.find(this.options.$pickerInput)[k]).val(v);
        })
    }
    generatePanelDom(el) {
        $(el)
            .append(this.options.$panelDate)
            .append(this.options.$panelYear)
            .append(this.options.$panelCentury)
            .append(this.options.$panelDay)
            .append(this.options.$panelMonth);
    }
    showCurrentOperation(panel, content) {
        $(panel).find('.be-panel').hide();
        $(content).find('table').hide();
        $(panel)
            .find(`${this.options.generateMap[this.options.datePicker].panel}`)
            .show();

        $(content)
            .find(`${this.options.generateMap[this.options.datePicker].content}`)
            .show();
    }
    enable(){
        this.$trigger.removeClass('disabled');
    }
    disable(){
        this.hide();
        this.$trigger.addClass('disabled');
    }
    getMonthDate() {
        //console.log(this.momentArr)
        var f = this.options.formatMap[this.options.format];
        for (var i = 0; i < this.momentArr.length; i++) {
            if(!this[`$date_${i}`]){
                $(this.$element).find(this.options.$calendarHead).append(this.options.$inputTemplate);
                $(this.$element).find(this.options.$calendarContent).append(this.options.$contentTemplate);
                this.generatePanelDom($(this.$element.find(this.options.$panel)[i]));
            }

            $(this.$element.find(this.options.$input)[i])
                .attr('plceholder', this.options.dateTimePlaceholder[i])
                .val(this.options.dateTime[i].format(f));
            var m = this.momentArr[i].momentobj;
            var t = this.momentArr[i].type;
            //generate date
            if(!this[`${t}Instance`]){
                this[`$date_${i}`] = $('<table class="be-calendar-date-cotent-wrapper"></table>');
                this[`${t}Instance`] = new MonthDay({
                    options: this.options,
                    m_id: i,
                    momentobj: m,
                    type: t,
                    select: this.selectTime
                })
                var $thead = $('<thead></thead>');
                this.options.wlanarr.forEach(((v, k) => {
                    $thead.append($(`<th>${v}</th>`))
                }).bind(this))
                this[`$date_${i}`].append($thead);
                this[`$date_${i}`].append(this[`${t}Instance`].$el);
            }else{
                this[`${t}Instance`].setMoment(m);
                //this[`${t}Instance`].setSelect(this.options.dateTime[i]);
            }
            this[`$date_${i}`].data({
                ins: this[`${t}Instance`],
                id: i,
                type: t,
                select: this.selectTime
            });

            //generate year
            if(!this[`${t}YearInstance`]){
                this[`$year_${i}`] = $('<table class="be-calendar-year-cotent-wrapper"></table>');
                this[`$century_${i}`] = $('<table class="be-calendar-century-cotent-wrapper"></table>');
                //console.log(this.options)
                this[`${t}YearInstance`] = new Year({
                    options: this.options,
                    y_id: i,
                    momentobj: m,
                    type: t,
                    select: this.selectTime
                })
                this.setYD($(this.$element.find(this.options.$panel)[i]), this[`${t}YearInstance`].dc);
                this[`$year_${i}`].append(this[`${t}YearInstance`].$elD);
                this[`$century_${i}`].append(this[`${t}YearInstance`].$elC);
            }else{
                this[`${t}YearInstance`].setDC(m.year());
            }
            
            this[`$year_${i}`]
                .add(this[`$century_${i}`])
                .data({
                    ins: this[`${t}YearInstance`],
                    id: i,
                    type: t,
                    select: this.selectTime
                });

            //generate month
            if(!this[`${t}MonthInstance`]){
                this[`$month_${i}`] = $('<table class="be-calendar-month-cotent-wrapper"></table>');
                this[`${t}MonthInstance`] = new Month({
                    options: this.options,
                    m_id: i,
                    momentobj: m,
                    type: t,
                    select: this.selectTime
                })
                this[`$month_${i}`].append(this[`${t}MonthInstance`].$el);
                $(this.$element.find(this.options.$dateWrap)[i])
                    .append(this[`$date_${i}`])
                    .append(this[`$year_${i}`])
                    .append(this[`$century_${i}`])
                    .append(this[`$month_${i}`]);
            }else{
                this[`${t}MonthInstance`].setMoment(m);
            }
            this[`$month_${i}`].data({
                ins: this[`${t}MonthInstance`],
                id: i,
                type: t,
                select: this.selectTime
            })

            this.setYM(
                $(this.$element.find(this.options.$ym)[i]), 
                this.momentArr[i].momentobj.year() + this.options.ylan, 
                (this.momentArr[i].momentobj.month() + 1) + this.options.mlan, 
                $(this.$element.find(this.options.$monthShow)[i]).closest(this.options.$calendar),
                this.momentArr[i].momentobj.year(),
                (this.momentArr[i].momentobj.month() + 1));

            this.showCurrentOperation($(this.$element.find(this.options.$panel)[i]), $(this.$element.find(this.options.$dateWrap)[i]));
        }
    }
}
var now = moment();
DateTimePicker.VERSION = '1.0.0';
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
    toggle: true,
    formatMap : {
        date : 'YYYY-MM-DD',
        dateTime : 'YYYY-MM-DD HH:mm:ss'
    },
    format : 'date',
    ylan: '年',
    mlan: '月',
    dlan: '日',
    mlanarr: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    wlanarr: ['日', '一', '二', '三', '四', '五', '六'],
    monthdate: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    datePicker: 'date',
    timechose: true,
    yearchose: true,
    monthchose: true,
    datechose: true,
    dateTime : ['', ''],
    selectTime : [],
    $calendar : '.be-calendar-date',
    $panel: '.be-calendar-panel',
    $dateWrap: '.be-calendar-date-cotent',
    $prevJump: '.be-calendar-prev-jump-btn',
    $prev: '.be-calendar-prev-btn',
    $nextJump: '.be-calendar-next-jump-btn',
    $next: '.be-calendar-next-btn',
    $ym: '.be-calendar-ym',
    $year: '.be-calendar-year',
    $month: '.be-calendar-month',
    generateMap: {
        date: {
            panel: '.be-calendar-panel-wrapper',
            content: '.be-calendar-date-cotent-wrapper'
        },
        year: {
            panel: '.be-calendar-year-panel-wrapper',
            content: '.be-calendar-year-cotent-wrapper'
        },
        century: {
            panel: '.be-calendar-century-panel-wrapper',
            content: '.be-calendar-century-cotent-wrapper'
        },
        day: {
            panel: '.be-calendar-day-panel-wrapper',
            content: '.be-calendar-day-cotent-wrapper'
        },
        month: {
            panel: '.be-calendar-month-panel-wrapper',
            content: '.be-calendar-month-cotent-wrapper'
        }
    },
    $pickerInput: '.be-calendar-picker-input',
    $input : '.be-calendar-input input',
    $calendarHead : '.be-calendar-header',
    $calendarContent : '.be-calendar-content',
    $inputTemplate : '<div class="be-calendar-input">\
        <input type="text" placeholder="选择日期"/>\
    </div>',
    $contentTemplate : '<div class="be-calendar-date">\
        <div class="be-calendar-panel">\
        </div>\
        <div class="be-calendar-date-cotent"></div>\
    </div>',
    $template : '<div class="be-calendar">\
        <div class="be-calendar-header">\
        </div>\
        <div class="be-calendar-content">\
        </div>\
        <div class="be-calendar-footer"></div>\
    </div>',
    $panelDate: '<div class="be-calendar-panel-wrapper be-panel" style="display:none;">\
        <div class="be-calendar-prev">\
            <span class="be-calendar-prev-jump-btn be-calendar-btn"><i class="icon iconfont icon-doubleleft"></i></span>\
            <span class="be-calendar-prev-btn be-calendar-btn"><i class="icon iconfont icon-left"></i></span>\
        </div>\
        <div class="be-calendar-ym">\
            <span class="be-calendar-year be-calendar-btn"></span>\
            <span class="be-calendar-month be-calendar-btn"></span>\
        </div>\
        <div class="be-calendar-next">\
            <span class="be-calendar-next-btn be-calendar-btn"><i class="icon iconfont icon-right"></i></span>\
            <span class="be-calendar-next-jump-btn be-calendar-btn"><i class="icon iconfont icon-doubleright"></i></span>\
        </div>\
    </div>',
    $contentDate: '.be-calendar-date-cotent-wrapper',
    $panelYear: '<div class="be-calendar-year-panel-wrapper be-panel" style="display:none">\
        <div class="be-calendar-year-prev">\
            <span class="be-calendar-year-prev-jump-btn be-calendar-btn"><i class="icon iconfont icon-doubleleft"></i></span>\
        </div>\
        <div class="be-calendar-year-ym">\
            <span class="be-calendar-year be-calendar-btn"></span>\
        </div>\
        <div class="be-calendar-year-next">\
            <span class="be-calendar-year-next-jump-btn be-calendar-btn"><i class="icon iconfont icon-doubleright"></i></span>\
        </div>\
    </div>',
    $contentYear: '.be-calendar-year-cotent-wrapper',
    $yearJumpPrev: '.be-calendar-year-prev-jump-btn',
    $yearJumpNext: '.be-calendar-year-next-jump-btn',
    $yearShow: '.be-calendar-year-ym .be-calendar-year',
    $panelCentury: '<div class="be-calendar-century-panel-wrapper be-panel" style="display:none">\
        <div class="be-calendar-century-prev">\
            <span class="be-calendar-century-prev-jump-btn be-calendar-btn"><i class="icon iconfont icon-doubleleft"></i></span>\
        </div>\
        <div class="be-calendar-century-ym">\
            <span class="be-calendar-century be-calendar-btn"></span>\
        </div>\
        <div class="be-calendar-century-next">\
            <span class="be-calendar-century-next-jump-btn be-calendar-btn"><i class="icon iconfont icon-doubleright"></i></span>\
        </div>\
    </div>',
    $contentCentury: '.be-calendar-century-cotent-wrapper',
    $centuryJumpPrev: '.be-calendar-century-prev-jump-btn',
    $centuryJumpNext: '.be-calendar-century-next-jump-btn',
    $centuryShow: '.be-calendar-century-ym .be-calendar-century',
    $panelMonth: '<div class="be-calendar-month-panel-wrapper be-panel" style="display:none">\
        <div class="be-calendar-month-prev">\
            <span class="be-calendar-month-prev-jump-btn be-calendar-btn"><i class="icon iconfont icon-doubleleft"></i></span>\
        </div>\
        <div class="be-calendar-month-ym">\
            <span class="be-calendar-month-show be-calendar-btn"></span>\
        </div>\
        <div class="be-calendar-month-next">\
            <span class="be-calendar-month-next-jump-btn be-calendar-btn"><i class="icon iconfont icon-doubleright"></i></span>\
        </div>\
    </div>',
    $contentMonth: '.be-calendar-month-cotent-wrapper',
    $monthJumpPrev: '.be-calendar-month-prev-jump-btn',
    $monthJumpNext: '.be-calendar-month-next-jump-btn',
    $monthShow: '.be-calendar-month-ym .be-calendar-month-show',
    $panelDay: '<div class="be-calendar-day-panel-wrapper be-panel" style="display:none">\
        <div class="be-calendar-day-prev">\
            <span class="be-calendar-day-prev-jump-btn be-calendar-btn"><i class="icon iconfont icon-doubleleft"></i></span>\
        </div>\
        <div class="be-calendar-day-ym">\
            <span class="be-calendar-day be-calendar-btn"></span>\
        </div>\
        <div class="be-calendar-day-next">\
            <span class="be-calendar-day-next-jump-btn be-calendar-btn"><i class="icon iconfont icon-doubleright"></i></span>\
        </div>\
    </div>',
    $contentDay: '.be-calendar-day-cotent-wrapper'

}
console.log(DateTimePicker.DEFAULTS)
//new DateTimePicker().init();

// DateTimePicker PLUGIN DEFINITION
// ==========================
function Plugin(option, param) {
    return this.each(function () {
        let $this = $(this);
        let data = $this.data('bs.calendar');
        let $input = $this.find('.be-calendar-picker-input');
        let dateTime = [];
        let dateTimePlaceholder = [];
        $input.each(function(){
            dateTime.push($(this).val());
            dateTimePlaceholder.push($(this).attr('placeholder'))
        })
        let options = $.extend({}, DateTimePicker.DEFAULTS, $this.data(), typeof option == 'object' && option);
        console.log(dateTime)
        options.dateTime = dateTime;
        options.dateTimePlaceholder = dateTimePlaceholder;
        if (!data && options.toggle && /show|hide|select|enable|disable/.test(option)) options.toggle = false;
        if (!data) $this.data('bs.calendar', (data = new DateTimePicker(this, options)));
        if (typeof option == 'string') data[option](param);
    })
}

var old = $.fn.datetimepicker;

$.fn.datetimepicker = Plugin;
$.fn.datetimepicker.Constructor = DateTimePicker;

$.fn.select.noConflict = function () {
    $.fn.datetimepicker = old;
    return this;
}

$(document).on('click.bs.datatimepicker.data-api', '[data-toggle="datatimepicker"] .be-calendar-input-picker-wrapper', function(e){
    var $this = $(this).closest('[data-toggle="datatimepicker"]');
    if($this.hasClass('disabled')) return false;
    var data = $this.data('bs.calendar');
    var option = data ? 'toggle' : $this.data();
    Plugin.call($this, option);
    e.preventDefault();
})

export default DateTimePicker;
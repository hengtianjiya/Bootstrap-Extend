
class Time {
    constructor() {

    }
}
class Day {
    constructor() {

    }
}
class MonthDay {
    constructor(options) {
        this.options = $.extend({}, options.options);
        this.momentobj = this.options.momentobj;
        this.type = this.options.type;
        return this;
    }

    init(){

    }

    isLeapYear(year){
        return moment([year]).isLeapYear();
    }

}

class Week {
    constructor() {

    }
}

class Month {
    constructor() {

    }
}

class DateTimePicker {
    constructor(options) {
        this.options = $.extend({}, DateTimePicker.DEFAULTS, options);
        this.fromMoment = null;
        this.toMoment = null;
        this.fromIncetance = null;
        this.toIncetance = null;
        this.momentArr = [];
        return this;
        /*this.year = this.options.y;
        this.month = this.options.m;
        this.date = this.options.d;
        this.weekday = this.options.wd;
        this.hour = this.options.h;
        this.minute = this.options.min;
        this.second = this.options.s;
        this.monthdate = this.options.monthdate;
        this.span = this.options.span;
        this.timechose = this.options.timechose;
        this.yearchose = this.options.yearchose;
        this.monthchose = this.options.monthchose;
        this.datechose = this.options.datechose;*/
    }

    init(){
        this.fromMoment = this.checkMoment(this.options.from);
        this.operateMomentArr(this.fromMoment, 'from');
        if(this.options.span){
            this.toMoment = this.checkMoment(this.options.to);
            this.operateMomentArr(this.toMoment, 'to');
        }
        this.getMonthDate();
    }

    operateMomentArr(moment, type){
        this.momentArr.push({
            momentobj : moment,
            type : type
        })
    }

    checkMoment(momentobj){
        return moment.isMoment(momentobj) ? momentobj : moment(momentobj);
    }

    getMonthDate(){
        for (var i = 0; i < this.momentArr.length; i++) {
            var m = this.momentArr[i].momentobj;
            var t = this.momentArr[i].type;
            this[`${t}Incetance`] = new MonthDay({
                options : this.options,
                momentobj : m,
                type : t
            }).init();
        }
    }
}
var now = moment();
DateTimePicker.DEFAULTS = {
    now: now,
    nf: now.format("YYYY-MM-DD HH:mm:ss"),
    d: now.format('D'),
    m: now.format('M'),
    y: now.format('YYYY'),
    wd: now.format('d'),
    h: now.format('H'),
    min: now.format('m'),
    s: now.format('s'),
    ms: now.format('x'),
    ylan: '年',
    mlan: '月',
    dlan: '日',
    mlanarr: ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
    wlanarr: ['一','二','三','四','五','六','日'],
    monthdate: [31,28,31,30,31,30,31,31,30,31,30,31],
    span: true,
    timechose: true,
    yearchose: true,
    monthchose: true,
    datechose: true,
    from: now,
    to: moment().add(1, 'y'),
    fromEl : ''

}
console.log(DateTimePicker.DEFAULTS)
new DateTimePicker().init();
export default DateTimePicker;
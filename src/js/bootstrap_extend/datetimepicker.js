
class Time {
    constructor() {

    }
}
class Day {
    constructor() {

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
        if(this.options.span){
            this.fromMoment = this.options.from;
            this.toMoment = this.options.to;
        }else{
            this.fromMoment = this.options.from;
        }
    }

    getMonthDate(){

    }

    isLeapYear(year){
        return moment([year]).isLeapYear();
    }
}
var now = moment();
DateTimePicker.DEFAULT = {
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
    to: now.add(1, 'y')

}
console.log(DateTimePicker.DEFAULT)
export default DateTimePicker;
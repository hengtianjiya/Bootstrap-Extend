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
    constructor() {

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
    s: now.format('s')
}
console.log(DateTimePicker.DEFAULT)
export default DateTimePicker;
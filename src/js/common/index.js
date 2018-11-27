import tmpl from './tmpl.js';
import parseTmpl from './parseTmpl.js';
import path from './router.js';


var util = {
    tmpl: tmpl,
    parseTmpl: parseTmpl
}
window.util = util;
$.extend({
    beUtil: util,
    bePath: new path()
});
export default util;
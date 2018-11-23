import tmpl from './tmpl.js';
import parseTmpl from './parseTmpl.js';

var util = {
    tmpl: tmpl,
    parseTmpl: parseTmpl
}
window.util = util;
$.extend({
    beUtil: util
});
export default util;
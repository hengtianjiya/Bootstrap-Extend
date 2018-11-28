function tmpl(str, data) {
    return Function("var html=[];\
    html.push('" + str.trim()
            .replace(/[\r\t\n]/g, "")
            .replace(/{%=(.+?)%}/g, "',$1,'")
            .replace(/{%/g, "');")
            .replace(/%}/g, "html.push('") + "');\
    return html.join('');")
        .call(data);
}
export default tmpl;
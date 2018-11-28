function parseTmpl(url, data, callback) {
    $.ajax({
        url: url,
        context: document.body
    }).done(function (content) {
        var tplHtml = $.beUtil.tmpl(content, data);
        callback && callback(tplHtml);
    });
}

export default parseTmpl;
import Router from 'path-to-regexp';
/*
    Method setPathReg
    @param String pathStr eg /path/:path?/end/:end(?optional)
    Method toPath
    @param Object {path:123, user: 456}
*/

class Path {
    constructor() {
        this.pathRule = '';
        this.keys = [];
        this.pathObj = {};
        this.bindEvent();
        return this;
    }

    bindEvent() {
        let _this = this;
        window.onhashchange = function (e) {
            _this.generatePath.call(_this);
            let updateEvent = $.Event('beRouteUpdate', {
                path: _this.path,
                pathObj: _this.pathObj,
                e: e
            })
            $(window).trigger(updateEvent);
        }
    }

    setPathReg(pathStr) {
        this.pathRule = pathStr;
        this.generatePath();
        return this;
    }

    generatePath() {
        this.keys = [];
        this.pathObj = {};
        this.path = this.trimPath();
        this.pathReg = Router(this.pathRule, this.keys);
        this.pathCompile = Router.compile(this.pathRule);
        if (this.path) {
            let result = this.pathReg.exec(this.path);
            let _this = this;
            this.keys.map(function (e, n) {
                _this.pathObj[e.name] = result[n + 1] ? _this.escape(result[n + 1]) : null;
            })
        }
    }

    toPath(obj) {
        try {
            var path = this.pathCompile(obj);
        } catch (e) {
            if (console && console.warn) {
                console.warn(e);
            } else {
                alert(e);
            }
        }
        if (!path) return false;
        location.hash = path;
    }
    trimPath() {
        return location.hash ? location.hash.slice(1) : '';
    }

    escape(str) {
        return str = "" + str,
            str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;")
    }
}

export default Path;
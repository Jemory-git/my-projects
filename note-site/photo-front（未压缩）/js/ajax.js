//异步请求模块
define(function () {
    var allHeaders = {
        useragent: 'User-Agent',
        accept: 'Accept',
        acceptlanguage: 'Accept-Language',
        acceptencoding: 'Accept-Encoding',
        acceptcharset: 'Accept-Charset',
        contenttype: 'Content-Type',
        connection: 'Connection',
        keepalive: 'Keep-Alive',
        cookie: 'cookie'
    };

    function post(url, jsonData, fn, headerObj) {//headerObj 的带‘-’的header名必须改为驼峰命名,或者去掉‘-’
        var xmlHttp = new XMLHttpRequest(), headers = headerObj || {}, headersNameArr;
        headersNameArr = Object.keys(headers);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                fn();
            }
        };
        xmlHttp.open('POST', url, true);
        if (headersNameArr.length > 0) {
            headersNameArr.forEach(function (c, i) {
                var lc = c.toLowerCase(),
                    headerName = allHeaders[lc];
                if (headerName) {
                    xmlHttp.setRequestHeader(headerName, headers[c]);
                } else {
                    console.log('您所要添加的header不存在');
                }
            });
        }
        xmlHttp.send(jsonData);
    };

    function get(url, fn, headerObj) {
        var xmlHttp = new XMLHttpRequest(), headers = headerObj || {}, headersNameArr;
        headersNameArr = Object.keys(headers);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                fn();
            }
        };
        xmlHttp.open('GET', url, true);
        if (headersNameArr.length > 0) {
            headersNameArr.forEach(function (c, i) {
                var lc = c.toLowerCase(),
                    headerName = allHeaders[lc];
                if (headerName) {
                    xmlHttp.setRequestHeader(headerName, headers[c]);
                } else {
                    console.log('您所要添加的header不存在');
                }
            });
        }
        xmlHttp.send();
    };
    var ajax = {
        get: get,
        post: post
    };
    return ajax;
});
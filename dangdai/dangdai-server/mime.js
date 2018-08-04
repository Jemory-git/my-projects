
var mimeType = {
    "js": "application/x-javascript",
    "css": "text/css",
    "htm": "text/html",
    "html": "text/html",
    "jpe": "image/jpeg",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "jfif": "image/pipeg",
    "gif": "image/gif",
    "png": "image/png",
    "ico": "image/x-icon",
    "zip": "application/zip",
    "svg": "image/svg+xml",
    "ttf": "application/octet-stream",
    "otf": "application/octet-stream",
    "eot": "application/vnd.ms-fontobject",
    "woff": "application/x-font-woff",
    "woff2": "application/x-font-woff"
}, mime;
module.exports = function (filepath) {
    var extendName = filepath.split(".").pop().toLowerCase();
    if (extendName) {
        mime = mimeType[extendName];
    } else {
        mime = "请传入带文件后缀名的路径";
    }
    if (!mime) {
        mime = "no extend name in mime type list";
    }
    return mime;
};
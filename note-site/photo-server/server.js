var http = require('http');
var fs = require('fs');
var mime = require('./mime');
var path = require('path');
var util = require('util');
var URL = require('url').URL;
var querystring = require('querystring');
var Socket = require('net').Socket;
var root = process.cwd();//从项目根目录打开服务器

var setResourceUrl = function (requrl) {
    var resourcerurl = path.join(root, 'photo-front', requrl);
    if (requrl === '/') {
        resourcerurl = path.join(resourcerurl, 'index.html');
        return resourcerurl;
    } else if (requrl.indexOf('.') < 0) {
        resourcerurl = path.join(resourcerurl, 'index.html');
        return resourcerurl;
    } else {
        return resourcerurl;
    }
};

function matchPath(path, noteData) {//用于新建笔记功能中，解析path,返回新笔记要保存的数组
    var pathArr = path.split(','), target = noteData;
    if (path.indexOf('[') > -1) {
        pathArr.forEach(function (c, i) {//获取目标位置
            var len = c.length,
                dividePoint = c.lastIndexOf('['),
                objPosition = c.substring(0, dividePoint),
                arrPosition = c.substr(dividePoint).match(/\d+/)[0];
            target = target[objPosition][arrPosition];
        });
        return target.files;
    } else {
        return target[path];
    }
};

//创建服务器
var httpserver = http.createServer(function (req, res) {
	var date = new Date();
    console.log(req.url, date.toLocaleDateString(), date.toLocaleTimeString());
     var requ = req.url;//请求地址开头如果多于一个斜杠‘/’，url就会报错。先对url进行处理
	//if (requ[1] === '/') {
        //res.writeHead(404, { 'content-type': "text/plain" });
        //res.end("The url is wrong!");
        //return;
    //};
	while(requ[1] === '/'){
		requ= requ.substring(1);
	};
    var requrl = new URL(requ, 'http://127.0.0.1:8100'),
        querystr = requrl.search.slice(1),
        resourceurl = setResourceUrl(requrl.pathname),
        reqMethod = req.method,
        urlArguments = querystring.parse(querystr),
		argumentsArr = Object.keys(urlArguments),
        argArrLen = argumentsArr.length;
    console.log('请求方式:' + reqMethod);

    if (argArrLen > 2) {
        res.writeHead(404, { 'content-type': "text/plain" });
        res.end("The url is wrong!");
        return;
    } else if ((argArrLen === 1 || argArrLen === 2) && (argumentsArr[0] !== 'v' && argumentsArr[0] !== 'type')){
        res.writeHead(404, { 'content-type': "text/plain" });
        res.end("The url is wrong!");
        return;
    } else if (argArrLen === 0 && resourceurl.split('.').pop() === 'php'){
        res.writeHead(404, { 'content-type': "text/plain" });
        res.end("The url is wrong!");
        return;
    }
    if (reqMethod == "GET" && urlArguments.type !== 'delete') {
        var mimeType = mime(resourceurl);
        if (mimeType === "no extend name in mime type list") { console.log(resourceurl); }//如果mime读取失败，查看原因

        fs.stat(resourceurl, function (err, stats) {
            if (err) {
                res.writeHead(404, { 'content-type': "text/plain" });
                res.end("The url is wrong!");
            } else if (stats.isFile()) {
                res.writeHead(200, {
                    'content-type': mimeType
                });
                fs.createReadStream('' + resourceurl).pipe(res);//pipe到响应体后，就不能执行 .end() 方法了, 而且如果加载超文本此步之前不能用write
            } else {
                res.writeHead(404, { 'content-type': "text/plain" });
                res.end("The url is wrong!");
            }
        });
    } else if (reqMethod == "GET" && urlArguments.type === 'delete') {//处理删除请求
        var noteUrl = root + '/photo-server/note.json',
            position = urlArguments.position,
            storagedNote,
            lastOne,
            len,
            dividePoint,
            lastArr,
            filePosition;

        if (!position) {
            console.log('请求数据中缺少关键数据');
            return;
        }

        position = position.split(',');//处理positon为数组
        lastOne = position.pop();//保存文件所在数组 和 文件位置，即要在数组lastArr 中删除位置为filePosition的文件
        len = lastOne.length;
        dividePoint = lastOne.lastIndexOf('[');
        lastArr = lastOne.substring(0, dividePoint);
        filePosition = lastOne.substr(dividePoint).match(/\d+/)[0];


        fs.readFile(noteUrl, function (err, data) {//读取笔记，进行修改
            if (err) {
                res.writeHead('500', { 'content-type': 'text/plain' });
                res.end(err + "....");
                return;
            } else {
                storagedNote = JSON.parse(data);
                var targetObj = storagedNote;

                position.forEach(function (c, i) {//获取目标位置
                    var len = c.length,
                        dividePoint = c.lastIndexOf('['),
                        objPosition = c.substring(0, dividePoint),
                        arrPosition = c.substr(dividePoint).match(/\d+/)[0];
                    targetObj = targetObj[objPosition][arrPosition];//lastArr所在的对象
                });

                //targetObj[lastArr].splice(filePosition, 1);//进行删除,删除后需要对被删除元素后面的对象修改position，暂时先不删除
                targetObj[lastArr][filePosition].showBoo = 'false';

                storagedNote = JSON.stringify(storagedNote);
                fs.writeFile(noteUrl, storagedNote, function (err) {//保存修改后的笔记
                    if (err) {
                        res.writeHead('500', { 'content-type': 'text/plain' });
                        res.end(err + "....");
                        return;
                    } else {
                        res.writeHead(200, {
                            'content-type': 'text/plain '
                        });
                        res.end("笔记删除成功");
                    }
                });
            }
        });//readfile结束

    } else if (reqMethod == "POST" && urlArguments.type === 'pull') {//拉取笔记数据
        // var socket = new Socket();
        var noteUrl = root + '/photo-server/note.json';
        var reqBody = "";
        req.on('data', function (chunk) {//数据过来的时候，拼接数据
            reqBody += chunk;
        });
        req.on('end', function () {//数据接收完毕后
            // var filesInfo = querystring.parse(decodeURI(reqBody));

            fs.readFile(noteUrl, function (err, data) {//读取笔记，进行修改
                if (err) {
                    res.writeHead('500', { 'content-type': 'text/plain' });
                    res.end(err + "....");
                    return;
                }
                res.writeHead(200, {
                    'content-type': 'application/json'
                });
                res.end(data);
            });
        });
    } else if (reqMethod == "POST" && urlArguments.type === 'save') {//修改笔记内容
        var noteUrl = root + '/photo-server/note.json',
            storagedNote,
            reqBody = "";
        req.on('data', function (chunk) {//数据过来的时候，拼接数据
            reqBody += chunk;
        });
        req.on('end', function () {//数据接收完毕后
            var reqBodyObj = JSON.parse(reqBody), propertysArr;
            propertysArr = Object.keys(reqBodyObj);
            if (!reqBodyObj.position) {
                console.log('请求数据中缺少关键数据');
                return;
            }
            fs.readFile(noteUrl, function (err, data) {//读取笔记，进行修改
                if (err) {
                    res.writeHead('500', { 'content-type': 'text/plain' });
                    res.end(err + "....");
                    return;
                } else {
                    storagedNote = JSON.parse(data);
                    var target = storagedNote;

                    reqBodyObj.position.forEach(function (c, i) {//获取目标位置
                        var len = c.length,
                            dividePoint = c.lastIndexOf('['),
                            objPosition = c.substring(0, dividePoint),
                            arrPosition = c.substr(dividePoint).match(/\d+/)[0];
                        target = target[objPosition][arrPosition];
                    });
                    propertysArr.forEach(function (c, i) {//修改目标的属性值
                        target[c] = reqBodyObj[c];
                    });

                    storagedNote = JSON.stringify(storagedNote);
                    fs.writeFile(noteUrl, storagedNote, function (err) {//保存修改后的笔记
                        if (err) {
                            res.writeHead('500', { 'content-type': 'text/plain' });
                            res.end(err + "....");
                            return;
                        } else {
                            res.writeHead(200, {
                                'content-type': 'text/plain '
                            });
                            res.end("笔记保存成功");
                        }
                    });
                }
            });//readfile结束
        });//onend事件结束
    } else if (reqMethod == "POST" && urlArguments.type === 'newnote') {//保存新建笔记
        var noteUrl = root + '/photo-server/note.json',
            storagedNote,
            reqBody = "";
        req.on('data', function (chunk) {//数据过来的时候，拼接数据
            reqBody += chunk;
        });
        req.on('end', function () {//数据接收完毕后
            var reqBodyObj = JSON.parse(reqBody), propertysArr, savePath, newFileObj;
            propertysArr = Object.keys(reqBodyObj);
            savePath = reqBodyObj.saveAddress;
            newFileObj = reqBodyObj.newFileObj;

            if (typeof(newFileObj) !== 'object' || typeof(savePath) !== 'string') {
                console.log('请求数据中缺少关键数据');
                res.writeHead('500', { 'content-type': 'text/plain' });
                res.end('请求数据中缺少关键数据' + "....");
                return;
            }

            fs.readFile(noteUrl, function (err, data) {//读取笔记，进行修改
                if (err) {
                    res.writeHead('500', { 'content-type': 'text/plain' });
                    res.end(err + "....");
                    return;
                } else {
                    storagedNote = JSON.parse(data);

                    var goalArr = matchPath(savePath, storagedNote);//得到保存笔记的数组
                    console.log(newFileObj);
                    goalArr.push(newFileObj);//保存

                    storagedNote = JSON.stringify(storagedNote);
                    fs.writeFile(noteUrl, storagedNote, function (err) {//保存修改后的笔记
                        if (err) {
                            res.writeHead('500', { 'content-type': 'text/plain' });
                            res.end(err + "....");
                            return;
                        } else {
                            res.writeHead(200, {
                                'content-type': 'text/plain '
                            });
                            res.end("笔记保存成功");
                        }
                    });
                }
            });//readfile结束
        });//onend事件结束
    }//else结束

});//创建服务器结束
httpserver.listen('8080', function () {
    var host = httpserver.address();
    console.log(httpserver.listening);
    console.log(host);

});
httpserver.on('request', function () {
    console.log(Buffer.byteLength("a"));
});

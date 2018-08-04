var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("./mime");

http.createServer(function(request,response){
    var root = process.cwd();
    var ru = request.url;

    if (ru.search(/\?/) > -1) {//font文件夹里个别文件路径里带？,导致找不到文件，所以做一下处理
        ru = ru.split("?").shift();
    }
    
    if (ru === "/") {//当只输入主机和端口号时，默认进入index.html
        ru = "dangdai-Mall/index.html";
    } else {
        ru = "dangdai-Mall/" + ru;
    }

    var reqPath = path.join(root,ru);
    var mimeType = mime(reqPath);//根据路径，查询mime类型
    if (mimeType === "no extend name in mime type list") {//如果mime读取失败，查看原因
        console.log(mimeType);
        console.log(reqPath);
    }

    fs.stat(reqPath,function(err,stats){//判断路径信息
        if (err) {
            response.statusCode = 404;
            response.setHeader("content-type","text/plain");
            response.end(reqPath + "请求路径错误");
            return;
        }
        if (stats.isFile()) {//如果是文件，就读取文件给客户端
            response.statusCode = 200;
            response.setHeader("content-type",mimeType);
            fs.createReadStream(reqPath).pipe(response);
        } else if(stats.isDirectory()){//如果是文件夹，就读取文件夹，将文件名返回给客户端
            fs.readdir(reqPath,function(err,files){
                response.statusCode = 200;
                response.setHeader("content-type","text/plain");
                response.end(files.join(","));
            });
        }
    });

}).listen(8000,function(){
	console.log('8000')
});




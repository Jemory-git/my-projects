const express = require('express');
const app = express();

app.get('/', function (req, res,next) {
    req.url = '/index.html';
    next();
});

app.use(express.static('srcout'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
var static = require('node-static'),
  http = require('http'),
  url = require('url'),
  util = require('util');

var webroot = './web', port = 8080;
var file = new static.Server(webroot, {
  cache: 600,
  headers: { 'X-Powered-By' : 'node-static'}
});

var proxyRequest = function(request, response) {
  var fullUrl = 'http://localhost:8001' + request.url;
  console.log('Making Query to HEM: ' + fullUrl);
  var req = http.request({
    host: '127.0.0.1',
    port: 8001,
    method: 'GET',
    path: fullUrl
  }, function (res) {
    res.on('data', function (data) {
      response.writeHead(200, res.headers);
      if(typeof data == 'undefined') {
        response.end('Error: No data.');
      } else {
        response.end(data.toString());
      }
    });
  });

  req.end();
};

http.createServer(function(req, res) {
  req.addListener('end', function() {
    file.serve(req, res, function(err, result) {
      if(err) {
        // Handle this by proxying to HEM
        urlObj = url.parse(req.url);
        if(urlObj.pathname === '/Query') {
          proxyRequest(req, res);
        } else {
          console.error('Error serving %s - %s', req.url, err.message);
          if(err.status === 404 || err.status === 500) {
            file.serveFile(util.format('/%d.html', err.status), err.status, {}, req, res);
          } else {
            res.writeHead(err.status, err.headers);
            res.end();
          }
        }
      } else {
        console.log('%s - %s', req.url, res.message)
      }
    });
    }).resume();
}).listen(port);

console.log('node-static running at http://localhost:%d', port);
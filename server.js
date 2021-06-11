let http = require('http');
let url = require('url');
let querystring = require('querystring');
let static = require('node-static');
const PORT = process.env.PORT || 8011
let fileServer = new static.Server('.');

let users = Object.create(null);

function onSubscribe(req, res) {
  let id = Math.random();

  res.setHeader('Content-Type', 'text/plain;charset=utf-8');
  res.setHeader("Cache-Control", "no-cache, must-revalidate");

  users[id] = res;

  req.on('close', function() {
    delete users[id];
  });

}

function frm(message) {

  for (let id in users) {
    let res = users[id];
    res.end(message);
  }

  users = Object.create(null);
}

function accept(req, res) {
  let urlParsed = url.parse(req.url, true);

  if (urlParsed.pathname == '/main') {
    onSubscribe(req, res);
    return;
  }

  if (urlParsed.pathname == '/frm' && req.method == 'POST') {
    req.setEncoding('utf8');
    let message = '';
    req.on('data', function(chunk) {
      message += chunk;
    }).on('end', function() {
      frm(message);
      res.end("ok");
    });

    return;
  }

  fileServer.serve(req, res);

}

function close() {
  for (let id in users) {
    let res = users[id];
    res.end();
  }
}

// -----------------------------------

if (!module.parent) {
  http.createServer(accept).listen(PORT);
  console.log('Server startuje na porcie '+PORT);
} else {
  exports.accept = accept;

  if (process.send) {
     process.on('message', (msg) => {
       if (msg === 'koniec') {
         close();
       }
     });
  }

  process.on('SIGINT', close);
}
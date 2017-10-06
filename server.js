const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const handlers = require('./handlers')


const server = http.createServer((req, res) => {
  // console.log(req);
  const headers = req.headers;
  const method = req.method;

  switch (method) {
    case "GET":
      handlers.getRequest(req, res);
      break;

    case "POST":
      handlers.postRequest(req, res);
      break;
  }

  // let body = [];
  // req.on('data', (data) => {
  //   body.push(data);
  // }).on('end', () => {
  //   body = Buffer.concat(body).toString();

  // });

});

server.listen(8080, () => {
  console.log('listening on port 8080');
});

// fs.stat('./public/hem.html', (err, stats) => {
//     console.log(stats);
// });
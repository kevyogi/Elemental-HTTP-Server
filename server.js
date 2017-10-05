const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');


const server = http.createServer((req, res) => {
  // console.log(req);
  const headers = req.headers;
  console.log(typeof headers.accept);
  const method = req.method;
  /*console.log(method);*/
  let url = req.url;
  console.log(url);
  if(url === "/"){
    url = "/index.html"
  }
  // let contentType = req.getHeader('Accept');
  // console.log(contentType);

  test = headers.accept.split(",")[0]

  fs.readFile(`.${url}`, (err, data) => {
    res.writeHead(200, {
      'Content-Type': test
    });
    res.write(data);
    res.end();
  });

});

server.listen(8080, () => {
  console.log('listening on port 8080');
});
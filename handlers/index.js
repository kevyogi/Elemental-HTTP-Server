const fs = require('fs');
const qs = require('querystring');
const helpers = require('../helpers');

module.exports = {
  getRequest: getRequest,
  postRequest: postRequest
}

function getRequest(req, res){
  if(req.url === '/'){
    req.url = '/index.html';
  }
  fs.readFile(`./public/${req.url}`, (err, data) => {
    if(err){
      helpers.sendError(req, res, 404);
    }else{
      res.writeHead(200, {
        'Content-Type': req.headers.accept.split(",")[0]
      });
      res.write(data);
      res.end();
      }
  });
}

function postRequest(req, res){
  if(req.url === '/elements'){
    req.on('data', (data) => {
      let body = qs.parse(data.toString());
      let elementName = body.elementName;
      let elementAtomicNumber = body.elementAtomicNumber;
      let elementDescription = body.elementDescription;
      let elementSymbol = body.elementSymbol;
      fs.stat(`./public/${elementName.toLowerCase()}.html`, (err, stats) => {
        if(stats){
          helpers.sendError(req, res, 400);
        }else{
          html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements - ${elementName}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${elementName}</h1>
  <h2>${elementSymbol}</h2>
  <h3>Atomic number ${elementAtomicNumber}</h3>
  <p>${elementDescription}</p>
  <p><a href="/">back</a></p>
</body>
</html>`
          fs.writeFile(`./public/${elementName.toLowerCase()}.html`, html, (err) => {
            if(err){
              console.log(err);
            }else{
              helpers.addToIndex(elementName);
              res.writeHead(200, {
                'Content-Type': 'application/json'
              });
              res.write('{"success": true}');
              res.end();
            }
          });
        }
      });
    });
  }else{
    helpers.sendError(req, res, 400);
  }
}

const fs = require('fs');
const qs = require('querystring');
const helpers = require('../helpers');

module.exports = {
  getRequest: getRequest,
  postRequest: postRequest,
  putRequest: putRequest
}

function getRequest(req, res){
  if(req.url === '/'){
    req.url = '/index.html';
  }
  fs.readFile(`./public/${req.url}`, (err, data) => {
    if(err){
      helpers.sendError(req, res, 404, '"error": "element not found"');
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
      fs.stat(`./public/${body.elementName.toLowerCase()}.html`, (err, stats) => {
        if(stats){
          helpers.sendError(req, res, 400, '"error": "file already exists"');
        }else{
          html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements - ${body.elementName}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${body.elementName}</h1>
  <h2>${body.elementSymbol}</h2>
  <h3>Atomic number ${body.elementAtomicNumber}</h3>
  <p>${body.elementDescription}</p>
  <p><a href="/">back</a></p>
</body>
</html>`
          fs.writeFile(`./public/${body.elementName.toLowerCase()}.html`, html, (err) => {
            if(err){
              console.log(err);
            }else{
              helpers.addToIndex(body.elementName);
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
    helpers.sendError(req, res, 400, '"error": "incorrect uri"');
  }
}

function putRequest(req, res){
  if(req.url === '/elements'){
    req.on('data', (data) => {
      let body = qs.parse(data.toString());
      if(body.elementName && body.elementDescription && body.elementSymbol && body.elementAtomicNumber){
        fs.stat(`./public/${body.elementName.toLowerCase()}.html`, (err, stats) => {
          if(!stats){
            helpers.sendError(req, res, 500, `"error": "resource /${body.elementName.toLowerCase()}.html does not exist"`)
          }else{
            html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements - ${body.elementName}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${body.elementName}</h1>
  <h2>${body.elementSymbol}</h2>
  <h3>Atomic number ${body.elementAtomicNumber}</h3>
  <p>${body.elementDescription}</p>
  <p><a href="/">back</a></p>
</body>
</html>`
            fs.writeFile(`./public/${body.elementName.toLowerCase()}.html`, html, (err) => {
              if(err){
                console.log(err);
              }else{
                helpers.addToIndex(body.elementName);
                res.writeHead(200, {
                  'Content-Type': 'application/json'
                });
                res.write('{"success": true}');
                res.end();
              }
            });
          }
        });
      }else{
        helpers.sendError(req, res, 400, '"error": "missing one or more required fields"');
      }
    })
  }else{
    helpers.sendError(req, res, 400, '"error": "incorrect uri"');
  }
}
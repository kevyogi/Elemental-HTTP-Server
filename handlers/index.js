const fs = require('fs');
const qs = require('querystring');
// const helpers = require('../helpers');

let count = 2;
const elementArray = [];

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
      sendError(req, res, 404);
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
          sendError(req, res, 400);
        }else{
          elementArray.push(elementName);
          count++;
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
              addToIndex(elementName);
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
    sendError(req, res, 400);
  }
}

function sendError(req, res, status){
  if(status === 404){
    fs.readFile('./public/404.html', (err, data) => {
      res.writeHead(status, {
        'Content-Type': req.headers.accept.split(",")[0]
      });
      res.write(data);
      res.end();
    });
  }else{
    res.writeHead(status, {
      'Content-Type': 'text/plain'
    });
    res.write('You\'re terrible. Make better requests');
    res.end();
  }
}

let index1 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>The Elements</h1>
  <h2>These are all the known elements.</h2>`
let index2 = `<h3>These are ${elementArray.length+2}</h3>`
let index3 = `<ol>
    <li>
      <a href="/hydrogen.html">Hydrogen</a>
    </li>
    <li>
      <a href="/helium.html">Helium</a>
    </li>`
let index4 = `</ol>
</body>
</html>`

function addToIndex(element){
  let newString = "";
  elementArray.forEach((element) => {
    newString += `\n<li><a href="/${element.toLowerCase()}.html">${element}</a>
</li>\n`
  })
  let newIndex = index1.concat(index2, index3, newString, index4);
  fs.writeFile('./public/index.html', newIndex, (err) => {
    console.log('new index created');
  });
}
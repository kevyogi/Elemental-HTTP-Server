const net = require('net');
const fs = require('fs');
let PORT = null;
let HOST = null;
let headers = {};

// console.log(process.argv);
let input = process.argv;
if(input[2] && input[2].split(".")[0] === "www"){
  PORT = 80;
  HOST = input[2];
}else{
  PORT = 8080;
  HOST = '0.0.0.0';
}

const server = new net.Socket();

server.connect(PORT, HOST, () => {

  let method;
  let host;
  let uri;

  let cli = process.argv.splice(2);
  if(cli.length === 0){
    console.log("Try node client.js -help for more information");
    server.end();
  }else if(cli.length === 1){
    if(cli[0].split("")[0] === "-"){
      if(cli[0].split("-")[1] === "help"){
        (process.stdout.write(`Usage: node client.js [options] <url>
options: '-I' for header only\n`));
        server.end();
      }else{
        console.log("Try 'node client.js -help' for more information");
        server.end();
      }
    }else if(cli[0].split("")[0] !== "-"){
      if(cli[0].split("/").length === 2){
        method = "GET";
        host = cli[0];
        uri = cli[0].split("/")[1];
      }else{
        method = "GET";
        host = cli[0];
        uri = "";
      }
      let newReq = buildRequest(method, host, uri);
      server.write(newReq, () => {
        server.on('data', (data) => {
          let response = data.toString();
          let message = response.split(/\n\s*\n/);
          headers[newReq] = message[0];
          process.stdout.write(message[1]);
        });
      });
    }
  }else if(cli.length === 2){
    if(cli[1].substring(0, 3) !== "www" || "loc"){
      console.log("Invalid Host");
      server.end();
    }else if(cli[0].split("")[0] === "-"){
      if(cli[0].split("")[1] === "I" && cli[1].split("/").length === 2){
        method = "HEAD";
        host = cli[1].split("/")[0];
        uri = cli[1].split("/")[1];
      }else{
        method = "HEAD";
        host = cli[1];
        uri = "";
      }
      let newReq = buildRequest(method, host, uri);
      server.write(newReq, () => {
        server.on('data', (data) => {
          let response = data.toString();
          headers[newReq] = response;
          process.stdout.write(response);
        })
      });
    }
  }
});

server.on('end', () => {
  console.log('ended connection');
});

function buildRequest(method, host, uri, I){
  let request = `${method} /${uri} HTTP/1.1\r
Date: ${new Date().toString()}\r
Host: ${host}\r
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36\n\n`
  return request;
}





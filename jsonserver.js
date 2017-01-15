// Program: jsonserver.js
// Author:  Jim Medlock
// Date written: 1/13/2017

'use strict'

//  Write an HTTP server that serves JSON data when it receives a GET request  
//  to the path '/api/parsetime'. Expect the request to contain a query string  
//  with a key 'iso' and an ISO-format time as the value.  
//   
//  For example:  
//   
//  /api/parsetime?iso=2013-08-10T12:10:15.474Z  
//   
//  The JSON response should contain only 'hour', 'minute' and 'second'  
//  properties. For example:  
//   
//     {  
//       "hour": 14,  
//       "minute": 23,  
//       "second": 15  
//     }  
//   
//  Add second endpoint for the path '/api/unixtime' which accepts the same  
//  query string but returns UNIX epoch time in milliseconds (the number of  
//  milliseconds since 1 Jan 1970 00:00:00 UTC) under the property 'unixtime'.  
//  For example:  
//   
//     { "unixtime": 1376136615474 }  
//   
//  Your server should listen on the port provided by the first argument to  
//  your program.  
//   
// ─────────────────────────────────────────────────────────────────────────────  
//   
//  HINTS  
//   
//  The request object from an HTTP server has a url property that you will  
//  need to use to "route" your requests for the two endpoints.  
//   
//  You can parse the URL and query string using the Node core 'url' module.  
//  url.parse(request.url, true) will parse content of request.url and provide  
//  you with an object with helpful properties.  
//   
//  For example, on the command prompt, type:  
//   
//     $ node -pe "require('url').parse('/test?q=1', true)"  
//   
//  Documentation on the url module can be found by pointing your browser  
//  here: 
//
//  file:///home/ubuntu/.nvm/versions/node/v4.6.1/lib/node_modules/learnyounode/node_apidoc/url.html  
//   
//  Your response should be in a JSON string format. Look at JSON.stringify()  
//  for more information.  
//   
//  You should also be a good web citizen and set the Content-Type properly:  
//   
//     res.writeHead(200, { 'Content-Type': 'application/json' })  
//   
//  The JavaScript Date object can print dates in ISO format, e.g. new  
//  Date().toISOString(). It can also parse this format if you pass the string  
//  into the Date constructor. Date#getTime() will also come in handy.

const http = require("http");
const moment = require("moment");
const url = require("url");

// ---------------------------------------------------------------------------
// HTTP Server 
// ---------------------------------------------------------------------------

http.createServer(function(request, response) {
    const urlParts = url.parse(request.url);
    const queryObject = url.parse(request.url, true).query;
    const dateTime = moment(queryObject["iso"]);
    let resultTime = null;

    switch (urlParts.pathname) {
        case '/api/parsetime':
            const hour = Number(dateTime.format("HH"));
            const minute = Number(dateTime.format("mm"));
            const second = Number(dateTime.format("ss"));
            resultTime = JSON.stringify({
                hour: hour,
                minute: minute,
                second: second
            });
            break;
        case '/api/unixtime':
            const unixtime = Number(dateTime.format("x"));
            resultTime = JSON.stringify({
                unixtime: unixtime
            });
            break;
        default:
            contentNotFound(request.url, request, response)
    }

    response.writeHead(200, {
        'Content-Type': 'application/json'
    })
    response.write(resultTime + "\n");
    response.end();
}).listen(process.argv[2]);

// ---------------------------------------------------------------------------
// Supporting Function Definitions
// ---------------------------------------------------------------------------

/**
 * If the URL content cannot be found display a 404 page
 * 
 * Returns: N/a
 */
function contentNotFound(url, request, response) {
    response.writeHead(404, {
        'Content-Type': 'text/html'
    });
    response.write("<h1>404 Not Found</h1>");
    response.end("The page you were looking for: " + url + " can not be found");
}

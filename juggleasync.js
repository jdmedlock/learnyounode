// Program: httpcollect.js
// Author:  Jim Medlock
// Date written: 1/9/2017

'use strict'

//  This problem is the same as the previous problem (HTTP COLLECT) in that  
//  you need to use http.get(). However, this time you will be provided with  
//  three URLs as the first three command-line arguments.  
//   
//  You must collect the complete content provided to you by each of the URLs  
//  and print it to the console (stdout). You don't need to print out the  
//  length, just the data as a String; one line per URL. The catch is that you  
//  must print them out in the same order as the URLs are provided to you as  
//  command-line arguments.  
//   
// ─────────────────────────────────────────────────────────────────────────────  
//  HINTS  
//   
//  Don't expect these three servers to play nicely! They are not going to  
//  give you complete responses in the order you hope, so you can't naively  
//  just print the output as you get it because they will be out of order.  
//   
//  You will need to queue the results and keep track of how many of the URLs  
//  have returned their entire contents. Only once you have them all, you can  
//  print the data to the console.  
//   
//  Counting callbacks is one of the fundamental ways of managing async in  
//  Node. Rather than doing it yourself, you may find it more convenient to  
//  rely on a third-party library such as [async](https://npmjs.com/async) or  
//  [after](https://npmjs.com/after). But for this exercise, try and do it  
//  without any external helper library

const http = require('http');
const URL_NOTRETRIEVED = 0;
const URL_RETRIEVED = 1;
const URL_PRINTED = 2;

// Retrieve the urls to be processed and retrieve the contents of each
let urls = [];
let urlContents = ["", "", ""];
let urlCallbackCount = 0;

let incrementCallbackCount = (() => urlCallbackCount += 1);

urls.push(process.argv[2]);
urls.push(process.argv[3]);
urls.push(process.argv[4]);

urls.forEach((url, urlIndex) => {
    http.get((url), (response) => {
        if (validateRequest(response)) {
            return;
        }
        retrieveData(response, urlIndex, incrementCallbackCount);
    }).on('error', (err) => {
        console.log("Got error: ${err.message}");
    });
});

// ---------------------------------------------------------------------------
// Function Definitions
// ---------------------------------------------------------------------------

// Examine the results of the URL retrieval operation and print the contents
// of the three URLS in the order in which they were specified in the 
// parameter list.
//
// Returns: N/a
function examineResults() {
    if (urlCallbackCount === 3) {
        console.log(urlContents[0]);
        console.log(urlContents[1]);
        console.log(urlContents[2]);
    }
}

// Retreive data from the url
//
// Returns: N/a
function retrieveData(response, urlIndex, callback) {
    response.setEncoding('utf8');
    let rawData = "";
    // Concatenate each chunk of data received onto an single string for 
    // analysis and output once all data has been read.
    response.on('data', (chunk) => rawData += chunk);
    // Once all data has been received use the string of raw data to create an
    // entry in the results array based on the order url order in the invocation
    // argument list 
    response.on('end', () => {
        try {
            urlContents.splice(urlIndex, 1, rawData);
            callback();
            examineResults();
        }
        catch (err) {
            console.log(err.message);
        }
    });
}


// Validate the request and handle any errors that are detected
//
// Returns: Error object instance if an error is detected, otherwise false.
function validateRequest(response) {
    const statusCode = response.statusCode;
    const contentType = response.headers['content-type'];
    let error = false;
    if (statusCode !== 200) {
        error = new Error(`Request Failed.\n` +
            `Status Code: ${statusCode}`);
    }
    if (error) {
        console.log(error.message);
        // consume response data to free up memory
        response.resume();
    }
    return error;
}

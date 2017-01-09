// Program: filterDir.js
// Author:  Jim Medlock
// Date written: 1/8/2017

'use strict'

//  These four things are the contract that your module must follow.  
//   
//   » Export a single function that takes exactly the arguments described.        
//   » Call the callback exactly once with an error or some data as described.     
//   » Don't change anything else, like global variables or stdout.                
//   » Handle all the errors that may occur and pass them to the callback.         
//   
//  The benefit of having a contract is that your module can be used by anyone  
//  who expects this contract. So your module could be used by anyone else who  
//  does learnyounode, or the verifier, and just work.  
//
//  This module exports a single function that takes three arguments: 
//      - directory name  
//      - filename extension string  
//          must be the same as what was passed to your program. Don't turn 
//          it into a RegExp or prefix with "." or do anything except pass it 
//          to your module where you can do what you need to make your  
//          filter work.
//      - callback function, in that order.  
//          The callback function must be called using the idiomatic 
//          node(err, data) convention. This convention stipulates that unless 
//          there's an error, the first argument passed to the callback will 
//          be null, and the second will be your data. In this exercise, the 
//          data will be your filtered list of files, as an Array. 
//
//  If you receive an error, e.g. from your call to fs.readdir(), the callback 
//  must be called with the error, and only the error, as the first 
//  argument.  
//   
//  In the case of an error bubbling up to your original program file, simply  
//  check for it and print an informative message to the console.  
//   

const fs = require('fs');
const path = require('path');

module.exports = function(directoryName, fileExt, callback) {
    let fileStr;
    let lines;

    fs.readdir(directoryName, function doneReading(err, fileList) {
        if (err) {
            return callback(err);
        }

        fileStr = fileList.toString();
        lines = fileStr.split(",");

        const filteredList = lines.reduce((accumulator, filePath) => {
            let fileObject = path.parse(filePath);
            if (fileObject.ext.slice(1) == fileExt) {
                return accumulator.concat(fileObject.name + fileObject.ext);
            }
            return accumulator;
        }, []);
        callback(null, filteredList);
    });
}

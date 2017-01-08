// Program: filteredLS.js
// Author:  Jim Medlock
// Date written: 1/8/2017

'use strict'

// Create a program that prints a list of files in a given directory,  
// filtered by the extension of the files. You will be provided a directory  
// name as the first argument to your program (e.g. '/path/to/dir/') and a  
// file extension to filter by as the second argument.  
//  
// For example, if you get 'txt' as the second argument then you will need to  
// filter the list to only files that end with .txt. Note that the second  
// argument will not come prefixed with a '.'.  
//
// Keep in mind that the first arguments of your program are not the first  
// values of the process.argv array, as the first two values are reserved for  
// system info by Node.  
// 
// The list of files should be printed to the console, one file per line. You  
// must use asynchronous I/O. 

const fs = require('fs');
const path = require('path');

const extFilter = "." + process.argv[3];

let fileStr;
let lines;


function countNewLines(callback) {
    fs.readdir(process.argv[2], function doneReading(err, fileList) {
        if (err) {
            console.log("Error");
            console.error(err);
        }

        fileStr = fileList.toString();
        lines = fileStr.split(",");
        callback();
    });
}

function outputFileList() {
    var filteredList = lines.reduce((accumulator, filePath) => {
        let fileObject = path.parse(filePath)
        if (fileObject.ext == extFilter) {
            return accumulator.concat(fileObject.name + fileObject.ext);
        }
        return accumulator;
    }, []);

    filteredList.forEach((fileName) => {
        console.log(fileName);
    });
}

countNewLines(outputFileList);

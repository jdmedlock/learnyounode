var fs = require('fs');
var fileStr;
var lines;

function countNewLines(callback) {
  fs.readFile(process.argv[2], function doneReading(err, fileContents) {
    if (err) {
      console.log("Error");
      console.error(err);
    }
    fileStr = fileContents.toString();
    lines = fileStr.split("\n");
    callback();
  });
}

function outputLineCount() {
  console.log(lines.length - 1);
}

countNewLines(outputLineCount);

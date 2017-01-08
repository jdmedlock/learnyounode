var fs = require('fs');
var fileContentBuffer = fs.readFileSync(process.argv[2]);
var str = fileContentBuffer.toString();
var lines = str.split('\n');
console.log(lines.length-1);
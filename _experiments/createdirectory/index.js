import Create from "./create.js";

var dir = './sapo';
var path = dir+"/feioso.js";
var breakLine = "\n";
var message = `First line` + breakLine;
message += `Second line` + breakLine;

Create.GenerateDir(dir);
Create.GenerateFile(path, message);

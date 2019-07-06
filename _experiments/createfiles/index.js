import CreateFile from "./create.js";

var path = "./files/feioso.js";
var breakLine = "\n";
var message = `First line` + breakLine;
message += `Second line` + breakLine;

CreateFile.Generate(path, message);

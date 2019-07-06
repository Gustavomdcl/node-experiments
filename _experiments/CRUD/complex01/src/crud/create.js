//SOURCES
//https://ourcodeworld.com/articles/read/297/how-to-create-a-file-using-the-filesystem-fs-module-in-node-js
//https://flaviocopes.com/how-to-check-if-file-exists-node/
import fs from "fs";

class CreateFile {
  constructor() {
    this.fs = fs;
  }
  Generate(path, message) {
    this.fs.access(path, this.fs.F_OK, err => {
      if (err) {
        var stream = this.fs.createWriteStream(path, "utf8");
        stream.once("open", fd => {
          stream.write(message);
          stream.end();
        });
        return;
      }
      //File exists
    });
  }
}

export default new CreateFile();
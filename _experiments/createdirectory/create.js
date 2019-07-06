//SOURCES
//FILE
//https://ourcodeworld.com/articles/read/297/how-to-create-a-file-using-the-filesystem-fs-module-in-node-js
//https://flaviocopes.com/how-to-check-if-file-exists-node/
//DIRECTORY
//https://stackoverflow.com/questions/21194934/node-how-to-create-a-directory-if-doesnt-exist
import fs from "fs";

class Create {
  constructor() {
    this.fs = fs;
  }
  GenerateDir(dir){
    if (!this.fs.existsSync(dir)){
        this.fs.mkdirSync(dir);
    }
  }
  GenerateFile(path, message) {
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

export default new Create();

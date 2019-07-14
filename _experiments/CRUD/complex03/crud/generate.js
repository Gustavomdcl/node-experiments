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

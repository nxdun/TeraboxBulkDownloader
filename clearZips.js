const fs = require("fs");
const path = require("path");

const clearZips = (res, bool) => {
  //delete zip files in project directory
  fs.readdir(__dirname, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      if (file.endsWith(".zip")) {
        fs.unlink(path.join(__dirname, file), (err) => {
          if (err) throw err;
        });
      }
    }
  });
  if(bool === 1){
    res.send("All zip files deleted");
  }
};

module.exports = clearZips;
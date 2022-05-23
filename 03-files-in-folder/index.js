const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

(async function deapRead(pathName) {
  try {
    const files = await readdir(pathName, { withFileTypes: true });
    for (let file of files)
      if (!file.isFile()) {
        null;
      } else {
        fs.stat(path.join(pathName, `${file.name}`), (err, stats) => {
          if (err) throw err;
          console.log(
            `${path.parse(file.name).name} - ${path
              .parse(file.name)
              .ext.replace(/^\./g, '')} - ${(stats.size / 1024).toFixed(3)}kb`
          );
        });
      }
  } catch (err) {
    console.error('Директория пуста', err.message);
  }
})(path.join(__dirname, 'secret-folder'));

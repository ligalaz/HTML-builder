const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const pathCurrentDir = path.join(__dirname, 'styles');
const writeStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css')
);

(async function bundler() {
  try {
    let files = await readdir(pathCurrentDir, { withFileTypes: true });
    for (let file of files) {
      if (file.isFile() && /\.css$/.test(file.name)) {
        fs.createReadStream(path.join(pathCurrentDir, file.name)).pipe(
          writeStream,
          { end: false }
        );
      } else null;
    }
  } catch (err) {
    console.log('Ошибка сборки', err.message);
  }
})();

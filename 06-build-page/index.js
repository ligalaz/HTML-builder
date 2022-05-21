const path = require('path');
const fs = require('fs');
const { access, readdir, copyFile, mkdir, rm } = require('fs/promises');

const pathStylesDir = path.join(__dirname, 'styles');
const pathCurrentDir = path.join(__dirname, 'assets');
const pathHtmlDir = path.join(__dirname, 'components');
const pathNewDir = path.join(__dirname, 'project-dist');
const readStream = fs.createReadStream(
  path.join(__dirname, 'template.html'),
  'utf-8'
);

/* HTML parse */

let data = '';

readStream.on('data', (chunk) => {
  data += chunk;
});
readStream.on('end', () => {
  console.log('End', data);
});

/* Copy files */

(async function checkDir(check) {
  try {
    await access(check);
    await rm(check, { recursive: true });
    deepRead(pathCurrentDir, pathNewDir);
    cssBundler();
  } catch (err) {
    deepRead(pathCurrentDir, pathNewDir);
    cssBundler();
  }
})(pathNewDir);

async function createDir(outputDir) {
  try {
    await mkdir(outputDir, { recursive: true });
  } catch (err) {
    console.log(err.message);
  }
}

async function copy(inputDir, outputDir) {
  try {
    await copyFile(path.join(inputDir), path.join(outputDir));
  } catch (err) {
    console.log('Копируемая директория не найдена:', err.message);
  }
}
async function deepRead(pathInputName, pathOutputName) {
  createDir(pathOutputName);
  try {
    const files = await readdir(pathInputName, { withFileTypes: true });

    for (let file of files) {
      if (!file.isFile()) {
        deepRead(
          path.join(pathInputName, `${file.name}`),
          path.join(pathOutputName, `${file.name}`)
        );
      } else {
        copy(
          path.join(pathInputName, `${file.name}`),
          path.join(pathOutputName, `${file.name}`)
        );
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

/* CSS bundle */

async function cssBundler() {
  try {
    const writeStream = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'style.css')
    );
    let files = await readdir(pathStylesDir, { withFileTypes: true });

    for (let file of files) {
      if (file.isFile() && /\.css$/.test(file.name)) {
        console.log(file.name);
        fs.createReadStream(path.join(pathStylesDir, file.name)).pipe(
          writeStream
        );
      }
    }
  } catch (err) {
    console.log('Ошибка сборки CSS', err.message);
  }
}

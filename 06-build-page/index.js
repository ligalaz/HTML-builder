const path = require('path');
const fs = require('fs');
const {
  access,
  readdir,
  readFile,
  copyFile,
  mkdir,
  rm,
} = require('fs/promises');
const { reverse } = require('dns');

const pathStylesDir = path.join(__dirname, 'styles');
const pathCurrentDir = path.join(__dirname, 'assets');
const pathHtmlDir = path.join(__dirname, 'components');
const pathNewDir = path.join(__dirname, 'project-dist');

/* Project */

(async function checkDir(check) {
  try {
    await access(check);
    await rm(pathNewDir, { recursive: true });
    makeBundle();
  } catch (err) {
    makeBundle();
  }
})(path.join(pathNewDir, 'assets'));

function makeBundle() {
  createDir(pathNewDir);
  deepRead(pathCurrentDir, path.join(pathNewDir, 'assets'));
  htmlParse();
  cssBundler();

  console.log('Сборка прошла успешно');
}

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

/* HTML bundle */

async function htmlParse() {
  try {
    const htmlFiles = await readdir(pathHtmlDir, { withFileTypes: true });
    let templateData = await readFile(
      path.join(__dirname, 'template.html'),
      'utf-8'
    );
    const htmlWriteStream = fs.createWriteStream(
      path.join(pathNewDir, 'index.html')
    );

    for (let html of htmlFiles) {
      let htmlCurrentPath = path.parse(path.join(pathHtmlDir, html.name));
      if (html.isFile() && /\.html$/.test(htmlCurrentPath.base)) {
        const htmlFragment = await readFile(
          path.join(pathHtmlDir, html.name),
          'utf-8'
        );

        templateData = templateData.replace(
          new RegExp(`{{${htmlCurrentPath.name}}}`, 'g'),
          htmlFragment
        );
      }
    }

    htmlWriteStream.write(templateData);
  } catch (err) {
    console.log('Сбой сборки шаблона', err.message);
  }
}

/* CSS bundle */

async function cssBundler() {
  try {
    const writeStream = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'style.css')
    );
    let files = await readdir(pathStylesDir, { withFileTypes: true });
    files = files.reverse();

    for (let file of files) {
      if (file.isFile() && /\.css$/.test(file.name)) {
        fs.createReadStream(path.join(pathStylesDir, file.name)).pipe(
          writeStream,
          { end: false }
        );
      }
    }
  } catch (err) {
    console.log('Ошибка сборки CSS', err.message);
  }
}

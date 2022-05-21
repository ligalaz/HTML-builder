const path = require('path');
const { access, readdir, copyFile, mkdir, rm } = require('fs/promises');

const pathCurrentDir = path.join(__dirname, 'files');
const pathNewDir = path.join(__dirname, 'files-copy');

(async function checkDir(check) {
  try {
    await access(check);
    await rm(check, { recursive: true });
    deepRead(pathCurrentDir, pathNewDir);
  } catch {
    deepRead(pathCurrentDir, pathNewDir);
  }
})(pathNewDir);

async function copy(inputDir, outputDir) {
  try {
    await copyFile(path.join(inputDir), path.join(outputDir));
  } catch (err) {
    console.log('Копируемая директория не найдена:', err.message);
  }
}

async function createDir(outputDir) {
  try {
    await mkdir(outputDir);
  } catch (err) {
    console.log(err.message);
  }
}

async function deepRead(pathInputName, pathOutputName) {
  try {
    const files = await readdir(pathInputName, { withFileTypes: true });
    createDir(pathOutputName);
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

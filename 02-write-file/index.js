const fs = require('fs');
const path = require('path');
const pathToCreateFile = path.join(__dirname, 'file.txt');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

function exit() {
  console.log(
    `Ввод данных в ${
      path.parse(pathToCreateFile).base
    } завершен, при повторном запуске файл будет обнулён`
  );
  rl.close();
}

function createFile() {
  fs.writeFile(path.join(__dirname, 'file.txt'), '', (err) => {
    if (err) throw err;
  });
}

fs.access(pathToCreateFile, (err) => {
  if (err) {
    createFile();
    process.stdout.write(
      `${path.parse(pathToCreateFile).base} создан и ожидает ввод данных:\n`
    );
  } else {
    createFile();
    process.stdout.write(
      `${path.parse(pathToCreateFile).base} обнулён и ожидает ввод данных:\n`
    );
  }
});

rl.on('line', (input) => {
  if (/^exit$/.test(input)) {
    exit();
  } else {
    fs.appendFile(pathToCreateFile, `${input} \n`, (err) => {
      if (err) throw err;
    });
    console.log(
      `${
        path.parse(pathToCreateFile).base
      } обновлён. Продолжите ввод данных или инициализируйте выход:`
    );
  }
});

rl.on('SIGINT', () => {
  exit();
});

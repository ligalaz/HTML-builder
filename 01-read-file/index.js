const fs = require('fs');
const path = require('path');

fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8').on(
  'data',
  (chunk) => {
    console.log(chunk);
  }
);

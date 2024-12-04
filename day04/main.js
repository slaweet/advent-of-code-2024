if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const filename = process.argv[2];

function verticalFlip(data) {
  const matrix = data.trim().split('\n').map((row) => row.split(''));
  const flipped = [];
  for (var i = 0; i < matrix.length; i++) {
    flipped.push(Array.from(Array(matrix.length).keys()).map((j) => matrix[j][i]));
  }
  return flipped.reverse().map((row) => row.join('')).join('\n');
}

function diagonalFlip(data) {
  const matrix = data.trim().split('\n').map((row) => row.split(''));
  const flipped = [];
  for (var i = 0; i < matrix.length * 2; i++) {
    flipped.push(Array.from(Array(i + 1).keys()).map((j) => matrix[i - j]?.[j] || ''));
  }
  return flipped.map((row) => row.join('')).join('\n');
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  const allVariations = data
    + ' ' + verticalFlip(data)
    + ' ' + diagonalFlip(data)
    + ' ' + diagonalFlip(verticalFlip(data));

  const matches = [
    ...allVariations.match(/XMAS/g),
    ...allVariations.match(/SAMX/g),
  ];

  const result = matches.length;

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

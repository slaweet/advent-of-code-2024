if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const filename = process.argv[2];

function getXmasCount(data) {
  const matrix = data.trim().split('\n').map((row) => row.split(''));
  let count = 0;
  for (var i = 0; i < matrix.length - 2; i++) {
    for (var j = 0; j < matrix[i].length - 2; j++) {
      if (
        ['MAS', 'SAM'].includes(`${matrix[i][j]}${matrix[i+1][j+1]}${matrix[i+2][j+2]}`)
        && ['MAS', 'SAM'].includes(`${matrix[i + 2][j]}${matrix[i+1][j+1]}${matrix[i][j+2]}`)
      ) { 
        count += 1;
      }
    }
  }
  return count;
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  const result = getXmasCount(data)

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

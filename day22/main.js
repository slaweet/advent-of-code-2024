if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

function getNthSecret(number) {
  for (i = 0; i < 2000; i++) {
    number = number ^ number << 6;
    number = number & 16777215;
    number = number ^ number >>> 5;
    number = number & 16777215;
    number = number ^ number << 11;
    number = number & 16777215;
  }
  return number;
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  let initialSecrets = data.trim().split('\n')
    .map((row) => parseInt(row));


  const result = initialSecrets.map(getNthSecret)
  .reduce((sum, current) => (sum + current), 0);
  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

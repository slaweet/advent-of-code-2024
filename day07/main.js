if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const filename = process.argv[2];

function canBeValidEquation([expectedTotal, ...operands]) {
  operators = [
    (a, b) => a + b,
    (a, b) => a * b,
  ];
  
  for (var i = 0; i < 2 ** (operands.length - 1); i++) {
    const actualTotal = operands.slice(1).reduce((acc, value, j) => {
      acc = operators[Number(i).toString(2).padStart(20, '0').at(-1 -j)](acc, value);
      return acc;
    }, operands[0]);

    if (expectedTotal == actualTotal) {
      return true;
    }
  }
  return false;
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  const parsedData = data.trim().split('\n').map((row) => row.split(/:? /).map((value) => parseInt(value)));


  const result = parsedData
    .filter(canBeValidEquation)
    .map(([value]) => value)
    .reduce((sum, current) => (sum + current), 0);

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

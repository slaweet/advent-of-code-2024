if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const filename = process.argv[2];

try {
  const data = fs.readFileSync(filename, 'utf8');

  const matches = data.match(/mul\(\d+,\d+\)/g);

  const products = matches.map((instruction) => {
    const args = instruction.replace('mul(', '').replace(')', '').split(',');
    return args[0] * args[1];
  });
  const result = products.reduce((sum, current) => (sum + current), 0);

  console.log(result);
} catch(e) {
  console.log('Error:', e.stack);
}

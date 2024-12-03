if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const filename = process.argv[2];

try {
  const data = fs.readFileSync(filename, 'utf8');
  const rows = data.toString().trim().split('\n');
  const twoLists = rows
    .map((row) => row.split('   '))
  const list1 = twoLists.map(([first]) => parseInt(first))
  const list2 = twoLists.map(([,second]) => parseInt(second))

  const counts = list2.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {})

  const scores = list1.map((value, i) => value * (counts[value] || 0))
  const output = scores.reduce((sum, current) => {
    sum += current;
    return sum;
  }, 0)

  console.log(output);
} catch(e) {
  console.log('Error:', e.stack);
}

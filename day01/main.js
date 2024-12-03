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
  const list1 = twoLists.map(([first]) => parseInt(first)).sort()
  const list2 = twoLists.map(([,second]) => parseInt(second)).sort()

  const diffs = list1.map((_, i) => Math.abs(list1[i] - list2[i]));
  const output = diffs.reduce((sum, current) => (sum + current), 0);

  console.log(output);
} catch(e) {
  console.log('Error:', e.stack);
}

if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const filename = process.argv[2];

function isIncorrectlyOrdered(update, orderings) {
  const seenNumbers = [];
  for (var i = 0; i < update.length; i++) {
    const disallowedPrevious = orderings
      .filter(([first, second]) => first === update[i])
      .map(([first, second]) => second)
    if (seenNumbers.some((number) => disallowedPrevious.includes(number))) {
      return true;
    }
    seenNumbers.push(update[i]);
  }
  return false;
}

function fixOrdering(update, orderings) {
  const seenNumbers = [];
  const joinedOrderings = orderings.map((ordering) => ordering.join(','));
  return update.sort((a, b) => {
    if (joinedOrderings.includes([a, b].join(','))) {
      return -1;
    }
    if (joinedOrderings.includes([b, a].join(','))) {
      return 1;
    }
    return 0;
  });
  return false;
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  const [data1, data2] = data.split('\n\n');

  const orderings = data1.trim().split('\n').map((row) => row.split('|').map((value) => parseInt(value)));
  const updates = data2.trim().split('\n').map((row) => row.split(',').map((value) => parseInt(value)));

  const result = updates.filter((update) => isIncorrectlyOrdered(update, orderings))
    .map((update) => fixOrdering(update, orderings))
    .map((update) => update[Math.floor(update.length / 2)])
    .reduce((sum, value) => (sum + value), 0);

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const filename = process.argv[2];

function isSafe(report) {
  const isGrowing = report[0] < report[1];

  const maxDiff = isGrowing ? 3 : -1;
  const minDiff = isGrowing ? 1 : -3;


  return report.filter((value, i) => {
    if (i === 0) {
      return false;
    }
    const diff = report[i] - report[i-1];
    return diff < minDiff || diff > maxDiff
  }).length === 0;
}

try {
  const data = fs.readFileSync(filename, 'utf8');
  const rows = data.toString().trim().split('\n');
  const twoLists = rows.map((row) => row.split(' '))
  const reports = twoLists.map((values) => values.map((value) => parseInt(value)))
  const output = reports.filter(isSafe).length;

  console.log(output);
} catch(e) {
  console.log('Error:', e.stack);
}

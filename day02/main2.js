if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const filename = process.argv[2];

function getDiffLimits(report) {
  const isGrowing = report[0] < report.at(-1); 

  return {
    maxDiff: isGrowing ? 3 : -1,
    minDiff: isGrowing ? 1 : -3,
  };
}

function isSafe(report) {
  const { maxDiff, minDiff } = getDiffLimits(report);

  return report.filter((value, i) => {
    if (i === 0) {
      return false;
    }
    const diff = report[i] - report[i-1];
    return diff < minDiff || diff > maxDiff
  }).length === 0;
}

function isSafePart2(report) {
  if (isSafe(report)) {
    return true;
  }
  const { maxDiff, minDiff } = getDiffLimits(report);

  const diffs = report.map((value, i) => {
    return report[i] - report[i-1];
  }).slice(1);

  const unsafeDiffIndex = diffs.findIndex((diff) => {
    return diff < minDiff || diff > maxDiff
  });

  const removed1 = [...report]
  removed1.splice(unsafeDiffIndex, 1);
  const removed2 = [...report]
  removed2.splice(unsafeDiffIndex + 1, 1);

  return isSafe(removed1) || isSafe(removed2);
}

try {
  const data = fs.readFileSync(filename, 'utf8');
  const rows = data.toString().trim().split('\n');
  const twoLists = rows.map((row) => row.split(' '))
  const reports = twoLists.map((values) => values.map((value) => parseInt(value)))
  const output = reports.filter(isSafePart2).length;

  console.log(output);
} catch(e) {
  console.log('Error:', e.stack);
}

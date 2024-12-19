if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

try {
  const data = fs.readFileSync(filename, 'utf8');

  const patterns = data.trim().split('\n\n')[0].split(', ');
  const designs = data.trim().split('\n\n')[1].split('\n');

  const patternsByStart = patterns.reduce((accumulator, pattern) => {
    accumulator[pattern[0]].push(pattern);
    return accumulator;
  }, {w: [], u: [], b: [], r: [], g: [] });

  const possibleDesignsCountCache = {}

  function getPossibleCount(design) {
    if (design in possibleDesignsCountCache) {
      return possibleDesignsCountCache[design];
    }
    if (design.length === 0) {
      return 1;
    }
    let count = 0;
    for (let i = 0; i < patternsByStart[design[0]].length; i++) {
      const pattern = patternsByStart[design[0]][i];
      const designRest = design.substring(patternsByStart[design[0]][i].length);
      if (design.startsWith(pattern)) {
        count += getPossibleCount(designRest)
      }
    }
    possibleDesignsCountCache[design] = count;
    return count;
  }

  const designCounts = designs.map(getPossibleCount)
  const result = designCounts.reduce((sum, current) => (sum + current), 0);

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

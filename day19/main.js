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

  const isPossibleDesignsCache = {}

  function isPossible(design) {
    if (design in isPossibleDesignsCache) {
      return isPossibleDesignsCache[design];
    }
    if (design.length === 0) {
      return true;
    }
    for (let i = 0; i < patternsByStart[design[0]].length; i++) {
      const pattern = patternsByStart[design[0]][i];
      const designRest = design.substring(patternsByStart[design[0]][i].length);
      if (design.startsWith(pattern) && isPossible(designRest)) {
        isPossibleDesignsCache[design] = true;
        return true;
      }
    }
    isPossibleDesignsCache[design] = false;
    return false;
  }

  const result = designs.filter(isPossible).length;

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

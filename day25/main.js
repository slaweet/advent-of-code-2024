if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {maxHeaderSize} = require('http');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

try {
  const data = fs.readFileSync(filename, 'utf8');

  const inputs = data.trim().split('\n\n')
    .map((row) => row.split('\n')
  );

  function parseHeights(schematic) {
    const heights = new Array(schematic[0].length).fill(-1);
    for(let i = 0; i < schematic[0].length; i++) {
      for(let j = 0; j < schematic.length; j++) {
        heights[i] += schematic[j][i] === '#' ? 1 : 0;
      }
    }
    return heights;
  }

  const keys = inputs.filter((entry) => entry[0].indexOf('#') === -1).map(parseHeights)
  const locks = inputs.filter((entry) => entry[0].indexOf('.') === -1).map(parseHeights)

  const result = keys
    .map((keyHeights) => (
      locks.filter((lockHeights) => (
         keyHeights.every((height, i) => height + lockHeights[i] < inputs[0].length - 1)
      ))
    ))
    .flat()
    .length;

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

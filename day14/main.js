if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

const planDimensions = filename === 'test.txt' ? [11, 7] : [101, 103];

function getFinalLocation([initialLocation, direction]) {
  return [
    (initialLocation[0] + 100 * direction[0] + 100 * planDimensions[0]) % planDimensions[0],
    (initialLocation[1] + 100 * direction[1] + 100 * planDimensions[1]) % planDimensions[1],
  ]
}

function getQuadrant(position) {
  return Object.entries({
    a: position[0] < Math.floor(planDimensions[0] / 2) && position[1] < Math.floor(planDimensions[1] / 2),
    b: position[0] < Math.floor(planDimensions[0] / 2) && position[1] > (planDimensions[1] / 2),
    c: position[0] > (planDimensions[0] / 2) && position[1] < Math.floor(planDimensions[1] / 2),
    d: position[0] > (planDimensions[0] / 2) && position[1] > (planDimensions[1] / 2),
  }).find(([_, isTrue]) => isTrue)?.[0]
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  let parsedData = data.trim().split('\n')
    .map((row) => 
      row.replace('p=', '')
        .split(' v=')
        .map((tuple) => tuple.split(',').map((value) => parseInt(value)))
    )

  const quadrantCounts = parsedData
    .map(getFinalLocation)
    .map(getQuadrant)
    .filter(Boolean)
    .reduce((accumulator, quadrant) => {
      accumulator[quadrant] += 1;
      return accumulator;
    }, {a: 0, b: 0, c: 0, d: 0 })

  const result = Object.values(quadrantCounts)
    .reduce((product, value) => product * value, 1);

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

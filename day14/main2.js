if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

const planDimensions = filename === 'test.txt' ? [11, 7] : [101, 103];

function getFinalLocation([initialLocation, direction], seconds) {
  return [
    (initialLocation[0] + seconds * direction[0] + seconds * planDimensions[0]) % planDimensions[0],
    (initialLocation[1] + seconds * direction[1] + seconds * planDimensions[1]) % planDimensions[1],
  ]
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  let parsedData = data.trim().split('\n')
    .map((row) => 
      row.replace('p=', '')
        .split(' v=')
        .map((tuple) => tuple.split(',').map((value) => parseInt(value)))
    )

  // Suspicious positions in my input: 42, 99, 145, 200, 248
  for (let i = 42; i < 10000; i += 103) {
    const finalLocations = parsedData
      .map((row) => getFinalLocation(row, i));

    const finalLocationsSet = new Set(finalLocations.map((location) => location.join()));

    const finalMap = [];
    for (let j = 0; j < planDimensions[0]; j++) {
      finalMap.push([]);
      for (let k = 0; k < planDimensions[1]; k++) {
        const hasRobot = finalLocationsSet.has([j, k].join());
        finalMap[j].push(hasRobot ? '■' : ' ');

      }
    }
    console.log('================================================================================');
    console.log(i);
    console.log(finalMap.map((row) => row.join('')).join('\n'));
  }

} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

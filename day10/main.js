if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const filename = process.argv[2];

function getTraiHeadScore(trailHead, areaMap) {
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  let trails = [[trailHead]];
  for (var k = 0; k < 9; k++) {
    const nextStepTrails = [];
    for (var i = 0; i < trails.length; i++) {
      for (var j = 0; j < directions.length; j++) {
        if ((areaMap[trails[i][k][0]]?.[trails[i][k][1]] + 1) === 
          areaMap[trails[i][k][0] + directions[j][0]]?.[trails[i][k][1] + directions[j][1]]) {
          nextStepTrails.push([
            ...trails[i],
            [trails[i][k][0] + directions[j][0], trails[i][k][1] + directions[j][1]]
          ]);
        }
      }
    }
    trails = nextStepTrails;
  }
  return new Set(trails.map((trail) => trail.at(-1).join(','))).size;
}

try {
  console.time('time taken');
  const data = fs.readFileSync(filename, 'utf8');

  const areaMap = data.trim().split('\n').map((row) => row.split('').map((v) => parseInt(v)));

  const trailHeads = [];
  for (var i = 0; i < areaMap.length; i++) {
    for (var j = 0; j < areaMap[i].length; j++) {
      if (areaMap[i][j] === 0) {
        trailHeads.push([i, j])
      }
    }
  }

  const result = trailHeads
    .map((trailHead) => getTraiHeadScore(trailHead, areaMap))
    .reduce((sum, score) => sum + score) ;

  console.log(result);
  console.timeEnd('time taken');
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

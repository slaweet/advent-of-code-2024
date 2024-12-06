if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const filename = process.argv[2];

function doesCauseLoop(data, extraObstacle) {
  const areaMap = data.trim().split('\n').map((row) => row.split(''));

  areaMap[extraObstacle[0]][extraObstacle[1]] = '#';

  const indexOfGuard = data.indexOf('^');

  let currentPosition = [Math.floor(indexOfGuard / (areaMap.length + 1)), indexOfGuard % (areaMap.length + 1)];
  let directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  let directionIndex = 0;
  let direction = directions[directionIndex];
  const visitedPositions = new Set();
  visitedPositions.add(currentPosition.join(','));
  let limit = data.length;
  while (areaMap[currentPosition[0] + direction[0]]?.[currentPosition[1] + direction[1]] && limit > 0) {
    direction = directions[directionIndex];
    if (areaMap[currentPosition[0] + direction[0]][currentPosition[1] + direction[1]] !== '#') {
      currentPosition = [currentPosition[0] + direction[0], currentPosition[1] + direction[1]];
      visitedPositions.add(currentPosition.join(','));
      limit -= 1;
    } else {
      directionIndex = (directionIndex + 1) % directions.length;
    }
  }
  return limit === 0;
}

function getLoopObstaclePositions(data) {
  const areaMap = data.trim().split('\n').map((row) => row.split(''));

  const positions = new Set();
  for (var i = 0; i < areaMap.length; i++) {
    for (var j = 0; j < areaMap[i].length; j++) {
      if (areaMap[i][j] === '.' && doesCauseLoop(data, [i, j])) {
        positions.add([i, j].join(','));
      }
    }
  }
  return Array.from(positions);
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  const loopObstaclePositions = getLoopObstaclePositions(data);

  const result = loopObstaclePositions.length;

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

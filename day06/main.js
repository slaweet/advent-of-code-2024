if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const filename = process.argv[2];

function getVisitedPositions(data) {
  const areaMap = data.trim().split('\n').map((row) => row.split(''));

  const indexOfGuard = data.indexOf('^');

  let currentPosition = [Math.floor(indexOfGuard / (areaMap.length + 1)), indexOfGuard % (areaMap.length + 1)];
  let directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  let directionIndex = 0;
  let direction = directions[directionIndex];
  const visitedPositions = new Set();
  visitedPositions.add(currentPosition.join(','));
  while (areaMap[currentPosition[0] + direction[0]]?.[currentPosition[1] + direction[1]]) {
    direction = directions[directionIndex];
    if (areaMap[currentPosition[0] + direction[0]][currentPosition[1] + direction[1]] !== '#') {
      currentPosition = [currentPosition[0] + direction[0], currentPosition[1] + direction[1]];
      visitedPositions.add(currentPosition.join(','));
    } else {
      directionIndex = (directionIndex + 1) % directions.length;
    }
  }
  return Array.from(visitedPositions);
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  const visitedPositions = getVisitedPositions(data);

  const result = visitedPositions.length;

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

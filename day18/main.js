if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

const mazeSize = filename === 'test.txt' ? 7 : 71;
const firstBytesToUse = filename === 'test.txt' ? 12 : 1024;

try {
  const data = fs.readFileSync(filename, 'utf8');
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  let locations = data.trim().split('\n')
    .map((row) => row.split(',').map((x) => parseInt(x)))
  .slice(0, firstBytesToUse);

  let maze = [];
  for (let i = 0; i < mazeSize; i++) {
    maze.push([]);
    for (let j = 0; j < mazeSize; j++) {
      maze[i].push(locations.find(([x, y]) => x === i && y === j) ? '#' : '.');
    }
  }

  const startPosition = [0,0];
  const toExplore = [startPosition];

  const scores = maze.map((row) => row.map(() => (Infinity)));
  scores[startPosition[0]][startPosition[1]] = 0;

  while (toExplore.length > 0) {
    const currentPosition = toExplore.shift();
    const currentScore = scores[currentPosition[0]][currentPosition[1]];
    
    directions.forEach((direction) => {
      const neighbourPosition = [
        currentPosition[0] + direction[0],
        currentPosition[1] + direction[1],
      ];
      if (scores[neighbourPosition[0]]?.[neighbourPosition[1]] > currentScore + 1
        && maze[neighbourPosition[0]]?.[neighbourPosition[1]] === '.') {
        scores[neighbourPosition[0]][neighbourPosition[1]] = currentScore + 1;
        toExplore.push(neighbourPosition);
      }
    })
  }

  const endPosition = [mazeSize - 1, mazeSize - 1];
  const result = scores[endPosition[0]][endPosition[1]];

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

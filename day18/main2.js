if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

const mazeSize = filename === 'test.txt' ? 7 : 71;

function canPassTrough(maze) {
  const startPosition = [0,0];
  const toExplore = [startPosition];
  const scores = maze.map((row) => row.map(() => (Infinity)));
  scores[startPosition[0]][startPosition[1]] = 0;

  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

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

  return result < Infinity;
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  let locations = data.trim().split('\n')
    .map((row) => row.split(',').map((x) => parseInt(x)));


  let maze = [];
  for (let i = 0; i < mazeSize; i++) {
    maze.push([]);
    for (let j = 0; j < mazeSize; j++) {
      maze[i].push('.');
    }
  }

  let result = '';
  for (let i = 0; i < locations.length && !result; i++) {
    maze[locations[i][0]][locations[i][1]] = '#';
    if (!canPassTrough(maze)) {
      result = locations[i].join();
    }
  }

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

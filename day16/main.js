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
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  let maze = data.trim().split('\n')
    .map((row) => row.split(''));

  const startPosition = maze.map((row, x) => ([x, row.indexOf('S')])).find(([_, y]) => y !== -1);
  const startDirectionIndex = 2;
  const toExplore = [{ position: startPosition, directionIndex: startDirectionIndex }];

  const scores = maze.map((row) => row.map(() => ([Infinity, Infinity, Infinity, Infinity])));
  scores[startPosition[0]][startPosition[1]][startDirectionIndex] = 0;

  while (toExplore.length > 0) {
    const current = toExplore.shift();
    const currentScore = scores[current.position[0]][current.position[1]][current.directionIndex];
    const nextToExplore = [
      current.position[0] + directions[current.directionIndex][0],
      current.position[1] + directions[current.directionIndex][1],
    ];
    
    const nextValue = maze[nextToExplore[0]]?.[nextToExplore[1]];
    if (['.', 'S', 'E'].includes(nextValue)
      && scores[nextToExplore[0]][nextToExplore[1]][current.directionIndex] > currentScore + 1
    ) {
      scores[nextToExplore[0]][nextToExplore[1]][current.directionIndex] = currentScore + 1
      toExplore.push({ position: nextToExplore, directionIndex: current.directionIndex });
    }

    [1, 2, -1].forEach((directionIndexDiff) => {
      const directionDiffPrice = 1000 * Math.abs(directionIndexDiff);
      const turnedDirectionIndex = (directions.length + current.directionIndex + directionIndexDiff) % directions.length;
      if (scores[current.position[0]][current.position[1]][turnedDirectionIndex] > currentScore + directionDiffPrice) {
        scores[current.position[0]][current.position[1]][turnedDirectionIndex] = currentScore + directionDiffPrice;
        toExplore.push({ position: current.position, directionIndex: turnedDirectionIndex });
      }
    })
  }

  const endPosition = maze.map((row, x) => ([x, row.indexOf('E')])).find(([_, y]) => y !== -1);
  const bestScores = scores.map((row) => row.map((values) => Math.min(...values)));
  const result = bestScores[endPosition[0]][endPosition[1]];

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

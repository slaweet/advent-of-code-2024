if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

function getScores(maze, start) {
  const toExplore = [start.position];

  const scores = maze.map((row) => row.map(() => Infinity));
  scores[start.position[0]][start.position[1]] = start.score;

  while (toExplore.length > 0) {
    const currentPosition = toExplore.shift();
    const currentScore = scores[currentPosition[0]][currentPosition[1]];
    
    directions.forEach((direction) => {
      const nextToExplore = [
        currentPosition[0] + direction[0],
        currentPosition[1] + direction[1],
      ];
      if (maze[nextToExplore[0]]?.[nextToExplore[1]] !== '#' && scores[nextToExplore[0]]?.[nextToExplore[1]] > currentScore + 1) {
        scores[nextToExplore[0]][nextToExplore[1]] = currentScore + 1;
        toExplore.push(nextToExplore);
      }
    })
  }
  return scores;
}

function getCheatValue(scores, cheat) {
  const lowestStart = Math.min(
      ...directions
      .map((direction) => (
        scores[cheat[0] + direction[0]]?.[cheat[1] + direction[1]]
      ))
      .filter((score) => score !== undefined)
  );
  const highestEnd = Math.max(
    ...directions
      .map((direction) => (
        scores[cheat[0] + direction[0]]?.[cheat[1] + direction[1]]
      ))
      .filter((score) => score !== Infinity && score !== undefined)
  );
  return { cheat, value: highestEnd - lowestStart - 2 };
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  let maze = data.trim().split('\n')
    .map((row) => row.split(''));

  const startPosition = maze.map((row, x) => ([x, row.indexOf('S')])).find(([_, y]) => y !== -1);
  const start = { position: startPosition, score: 0 };
  const scores = getScores(maze, start);
  const cheats = [];

  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === '#') {
        cheats.push(getCheatValue(scores, [i, j]));
      }
    }
  }

  const cheatCounts = cheats
    .filter(({ value }) => value >= 100)
    .reduce((accumulator, { value }) => {
      accumulator[value] = accumulator[value] || 0;
      accumulator[value] += 1;
      return accumulator;
    }, {})

  const result = Object.values(cheatCounts).reduce((sum, value) => (sum + value), 0);
    
  /*
  console.log(
    scores.map((row, i) => row.map((v, j) => 
      `${v}`.replace('Infinity', '').padStart(2, ' ').substring(0, 2)).join(' ')
    ).join('\n'));
  */

  console.log(result);

} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

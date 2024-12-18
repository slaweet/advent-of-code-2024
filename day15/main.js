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

  let areaMap = data.split('\n\n')[0].trim().split('\n')
        .map((row) => row.split(''));
  let moves = data.split('\n\n')[1].trim().replace(/\s/g, '').split('')

  const directions = {'^': [-1, 0], '>': [0, 1], 'v': [1, 0], '<': [0, -1]};

  let robotPosition = areaMap.map((row, x) => ([x, row.indexOf('@')])).find(([_, y]) => y !== -1);
  areaMap[robotPosition[0]][robotPosition[1]] = '.';

  moves.forEach((move) => {
    const direction = directions[move]
    let exporePosition = [robotPosition[0] + direction[0], robotPosition[1] + direction[1]];
    while (areaMap[exporePosition[0]]?.[exporePosition[1]] === 'O') {
      exporePosition = [exporePosition[0] + direction[0], exporePosition[1] + direction[1]];
    }
    if (areaMap[exporePosition[0]]?.[exporePosition[1]] === '.') {
      areaMap[exporePosition[0]][exporePosition[1]] = 'O';
      areaMap[robotPosition[0] + direction[0]][robotPosition[1] + direction[1]] = '.';
      robotPosition = [robotPosition[0] + direction[0], robotPosition[1] + direction[1]];
    }
  });
  console.log(areaMap.map((row) => row.join('')).join('\n'));
  const result = areaMap
    .map((row, i) => row.map((value, j) => value === 'O' ? 100 * i + j : 0))
    .flat()
    .reduce((sum, current) => (sum + current), 0);

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

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
        .map((row) => row.replace(/\./g, '..').replace(/#/g, '##').replace(/O/g, '[]').replace(/\@/g, '@.').split(''));
  let moves = data.split('\n\n')[1].trim().replace(/\s/g, '').split('')

  const directions = {'^': [-1, 0], '>': [0, 1], 'v': [1, 0], '<': [0, -1]};

  let robotPosition = areaMap.map((row, x) => ([x, row.indexOf('@')])).find(([_, y]) => y !== -1);
  areaMap[robotPosition[0]][robotPosition[1]] = '.';

  function canMove(position, direction) {
    const pushedPartOfBox = areaMap[position[0]]?.[position[1]];
    const otherPartOfBox = pushedPartOfBox === '[' ? ']': '[';
    const otherPartOfBoxDiff = pushedPartOfBox === '[' ? 1 : -1;
    return ['[', ']'].includes(pushedPartOfBox)
      && areaMap[position[0]][position[1] + otherPartOfBoxDiff] === otherPartOfBox
      && ( areaMap[position[0] + direction[0]]?.[position[1] + direction[1]] === '.'
        || canMove([position[0] + direction[0], position[1] + direction[1]], direction))
      && (areaMap[position[0] + direction[0]]?.[position[1] + direction[1] + otherPartOfBoxDiff] === '.'
        || canMove([position[0] + direction[0], position[1] + direction[1] + otherPartOfBoxDiff], direction));
  }

  function doMove(position, direction) {
    const pushedPartOfBox = areaMap[position[0]]?.[position[1]];
    const otherPartOfBox = pushedPartOfBox === '[' ? ']': '[';
    const otherPartOfBoxDiff = pushedPartOfBox === '[' ? 1 : -1;
    if (areaMap[position[0] + direction[0]]?.[position[1] + direction[1]] !== '.') {
      doMove([position[0] + direction[0], position[1] + direction[1]], direction)
    }
    if (areaMap[position[0] + direction[0]]?.[position[1] + direction[1] + otherPartOfBoxDiff] !== '.') {
      doMove([position[0] + direction[0], position[1] + direction[1] + otherPartOfBoxDiff], direction)
    }
    areaMap[position[0] + direction[0]][position[1] + direction[1]] = pushedPartOfBox;
    areaMap[position[0] + direction[0]][position[1] + direction[1] + otherPartOfBoxDiff] = otherPartOfBox;
    areaMap[position[0]][position[1]] = '.';
    areaMap[position[0]][position[1] + otherPartOfBoxDiff] = '.';
  }

  moves.forEach((move) => {
    const direction = directions[move]
    let explorePosition = [robotPosition[0] + direction[0], robotPosition[1] + direction[1]];
    if (areaMap[explorePosition[0]]?.[explorePosition[1]] === '.') {
      robotPosition = [robotPosition[0] + direction[0], robotPosition[1] + direction[1]];
    } else if (['<', '>'].includes(move)) {
      while (['[', ']'].includes(areaMap[explorePosition[0]]?.[explorePosition[1]])) {
        explorePosition = [explorePosition[0] + direction[0], explorePosition[1] + direction[1]];
      }
      if (areaMap[explorePosition[0]]?.[explorePosition[1]] === '.') {
        explorePosition = [robotPosition[0] + direction[0], robotPosition[1] + direction[1]];
        while (['[', ']'].includes(areaMap[explorePosition[0]]?.[explorePosition[1]])) {
          areaMap[explorePosition[0]][explorePosition[1]] = areaMap[explorePosition[0]][explorePosition[1]] === '[' 
            ? ']'
            : '[';
          explorePosition = [explorePosition[0] + direction[0], explorePosition[1] + direction[1]];
        }
        areaMap[explorePosition[0]][explorePosition[1]] = move === '<' ? '[' : ']';
        explorePosition = [robotPosition[0] + direction[0], robotPosition[1] + direction[1]];
        areaMap[explorePosition[0]][explorePosition[1]] = '.';
        robotPosition = [robotPosition[0] + direction[0], robotPosition[1] + direction[1]];
      }
    } else if (['^', 'v'].includes(move)) {
      if(canMove(explorePosition, direction)) {
        doMove(explorePosition, direction)
        robotPosition = [robotPosition[0] + direction[0], robotPosition[1] + direction[1]];
      }
    }
  });

  console.log(areaMap.map((row,i ) => row.map((v, j) => i == robotPosition[0] && j === robotPosition[1] ? '@' : v).join('')).join('\n'));
  const result = areaMap
    .map((row, i) => row.map((value, j) => value === '[' ? 100 * i + j : 0))
    .flat()
    .reduce((sum, current) => (sum + current), 0);

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

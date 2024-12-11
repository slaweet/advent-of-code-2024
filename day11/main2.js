if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const filename = process.argv[2];

const countCache = { }

function getCountAfterNBlinks(stone, n) {
    if (!countCache[stone]) {
      countCache[stone] = {};
    } else if (countCache[stone][n]) {
      return countCache[stone][n];
    }
    if (n === 0) {
      return 1;
    }

    const stoneNumberLength = `${stone}`.length;
    let result = 0;
    if (stone === 0) {
      result = getCountAfterNBlinks(1, n - 1);
    } else if (stoneNumberLength % 2 === 0) {
      result = getCountAfterNBlinks(Math.floor(stone / 10 ** (stoneNumberLength / 2)), n -1)
        + getCountAfterNBlinks(stone % (10 ** (stoneNumberLength / 2)), n - 1);
    } else {
      result = getCountAfterNBlinks(stone * 2024, n - 1);
    }

  countCache[stone][n] = result;
  return result;
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  let stones = data.trim().split(' ').map((v) => parseInt(v));

  let result = stones
    .map((stone) => getCountAfterNBlinks(stone, 75))
    .reduce((sum, current) => (sum + current), 0);
    
  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const filename = process.argv[2];

function blink(stones) {
  const stonesAfterBlink = [];
  for (let i = 0; i < stones.length; i++) {
    const stoneNumberLength = `${stones[i]}`.length;
    if (stones[i] === 0) {
      stonesAfterBlink.push(1);
    } else if (stoneNumberLength % 2 === 0) {
      stonesAfterBlink.push(parseInt(`${stones[i]}`.substr(0, stoneNumberLength / 2)));
      stonesAfterBlink.push(parseInt(`${stones[i]}`.substr(stoneNumberLength / 2, stoneNumberLength / 2)));
    } else {
      stonesAfterBlink.push(stones[i] * 2024);
    }

  }
  return stonesAfterBlink;
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  let stones = data.trim().split(' ').map((v) => parseInt(v));

  for (let i = 0; i < 25; i++) {
   stones = blink(stones);
  }

  const result = stones.length;

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

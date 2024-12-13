if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

function getPriceCosts({ buttonA, buttonB, prize }) {
  const maxButtonA = Math.ceil(prize[0] / buttonA[0]);
  const maxButtonB = Math.ceil(prize[0] / buttonB[0]);
  for (let i = 0; i <= maxButtonA; i++) {
    for (let j = 0; j <= maxButtonB; j++) {
      if ( buttonA[0] * i + buttonB[0] * j === prize[0]
        && buttonA[1] * i + buttonB[1] * j === prize[1]
      ) {
        return i * 3 + j;
      }
    }
  }
  return 0;
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  let clawMachines = data.trim().split('\n\n')
    .map((v) => {
      const machineRows = v.split('\n')
      .map((row) => row.match(/\d+/g).map((value) => parseInt(value)));
      return {
        buttonA: machineRows[0],
        buttonB: machineRows[1],
        prize: machineRows[2],
      };
    });

  const result = clawMachines
    .map(getPriceCosts)
    .reduce((sum, current) => (sum + current), 0);

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

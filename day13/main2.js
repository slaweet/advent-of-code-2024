if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

function getPriceCosts({ buttonA, buttonB, prize }) {
  /*
   * buttonA[0] * buttonACount + buttonB[0] * buttonBCount === prize[0]
   * buttonA[1] * buttonACount + buttonB[1] * buttonBCount === prize[1]
   *
   * buttonBCount  == (prize[0] - buttonA[0] * buttonACount) / buttonB[0]
   *
   * buttonA[1] * buttonACount + buttonB[1] * ((prize[0] - buttonA[0] * buttonACount) / buttonB[0]) = prize[1]
   * buttonA[1] * buttonACount * buttonB[0] + buttonB[1] * (prize[0] - buttonA[0] * buttonACount) = prize[1] * buttonB[0]
   * buttonA[1] * buttonACount * buttonB[0] + buttonB[1] * prize[0] - buttonB[1] * buttonA[0] * buttonACount = prize[1] * buttonB[0]
   * buttonA[1] * buttonACount * buttonB[0] - buttonB[1] * buttonA[0] * buttonACount = prize[1] * buttonB[0] - buttonB[1] * prize[0]
   * buttonACount * (buttonA[1] * buttonB[0] - buttonB[1] * buttonA[0]) = prize[1] * buttonB[0] - buttonB[1] * prize[0]
   * buttonACount = (prize[1] * buttonB[0] - buttonB[1] * prize[0]) / (buttonB[0] * buttonA[1] - buttonB[1] * buttonA[0])
   *
   * */
  const buttonACount = (prize[1] * buttonB[0] - buttonB[1] * prize[0]) / (buttonB[0] * buttonA[1] - buttonB[1] * buttonA[0]);
  const buttonBCount = (prize[0] - buttonA[0] * buttonACount) / buttonB[0]

  return buttonACount * 3 + buttonBCount;
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
        prize: machineRows[2].map((x) => x + 10000000000000),
      };

    });

  const result = clawMachines
    .map(getPriceCosts)
    .filter((price) => price % 1 === 0)
    .reduce((sum, current) => (sum + current), 0);

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

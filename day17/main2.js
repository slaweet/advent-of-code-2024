if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

function runProgram(registers, program) {
  const output = [];
  for (let i = 0; i < program.length; i += 2) {
    const operands = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: registers.A,
      5: registers.B,
      6: registers.C,
    };

    const operations = {
      0: (x) => {
        registers.A = Math.floor(registers.A / (2 ** operands[x]));
      },
      1: (x) => {
         registers.B = (registers.B ^ parseInt(x));
      },
      2: (x) => {
         registers.B = operands[x] % 8;
      },
      3: (x) => {
        if (registers.A !== 0) {
          i = parseInt(x) - 2;
        }
      },
      4: () => {
         registers.B = (registers.B ^ registers.C);
      },
      5: (x) => (operands[x] % 8 + 8) % 8,
      6: (x) => {
        registers.B = Math.floor(registers.A / (2 ** operands[x]));
      },
      7: (x) => {
        registers.C = Math.floor(registers.A / (2 ** operands[x]));
      },
    }
    const retVal = operations[program[i]](program[i + 1]);
    if (retVal !== undefined) {
      output.push(retVal);
    }
  }
  return output;
}
try {
  const data = fs.readFileSync(filename, 'utf8');
  let parsedData = data.trim().split('\n')
    .map((row) => row.split(': ').at(-1).split(','));

  const registers = {
    A: parseInt(parsedData[0][0]),
    B: parseInt(parsedData[1][0]),
    C: parseInt(parsedData[2][0]),
  };

  const program = parsedData.at(-1).map((x) => parseInt(x));

  let i = 0
  const maxRuns = 300000000000000;
  let step = 5000000000;
  let lastCommonLength = 0;
  const stapChangeFactor = 10;
  for (i = 0; i <= maxRuns; i += (lastCommonLength > 10 ? 1 : step)) {
    const output = runProgram({ ...registers, A: i }, program);
    const commonLength = output.length - [...new Array(program.length)].map((_, i) => i).find((_, i) => output.join('').substring(i) === program.join('').substring(i));
    if (commonLength  > lastCommonLength) {
      step = Math.max(1, Math.round(step / stapChangeFactor));
    }
    if (commonLength < lastCommonLength) {
      step = step * stapChangeFactor;
    }
    lastCommonLength = commonLength;
    if (output && output.join() === program.join() && output.length === program.length) {
      break;
    }
  }

  const result = i === maxRuns ? NaN : i;

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}
